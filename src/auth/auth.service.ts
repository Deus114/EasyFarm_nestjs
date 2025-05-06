import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
        private mailService: MailService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            let isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true)
                return user;
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            id,
            name,
            email,
            role
        };

        let refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(refresh_token, id);

        return {
            access_token: this.jwtService.sign(payload),
            id,
            name,
            email,
            role
        };

    }

    async register(registerUserDto: RegisterUserDto) {
        let res = await this.usersService.register(registerUserDto)
        return res;
    }

    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        });
        return refreshToken
    }

    processRefreshToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken,
                { secret: this.configService.get<string>("JWT_REFRESH_TOKEN"), }
            )
            let user = await this.usersService.findUserByRefreshToken(refreshToken);
            if (user) {
                const { id, name, email, role } = user;
                const payload = {
                    sub: "token login",
                    iss: "from server",
                    id,
                    name,
                    email,
                    role
                }
                let refresh_token = this.createRefreshToken(payload);
                await this.usersService.updateRefreshToken(refresh_token, id);

                response.clearCookie('refreshToken');
                response.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    id,
                    name,
                    email,
                    role
                };
            } else {
                throw new BadRequestException(`Refresh token không hợp lệ, vui lòng đăng nhập`);
            }
        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ, vui lòng đăng nhập`);
        }
    }

    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateRefreshToken("", user.id);
        response.clearCookie("refreshToken");
        return "ok";
    }

    // Hàm sinh OTP 6 số
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Gửi OTP quên mật khẩu
    async sendForgotPasswordOtp(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new BadRequestException('Email không hợp lệ');
        }

        const otp = this.generateOtp();

        // Lưu OTP và hạn dùng 1 phút
        await this.prisma.user.update({
            where: { email },
            data: {
                otp,
                otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
            },
        });

        // Gửi OTP qua email
        await this.mailService.sendOtpEmail(email, otp);

        return { message: 'OTP sent to email' };
    }

    // Xác thực OTP
    async verifyOtp(email: string, otp: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp) {
            throw new BadRequestException('OTP Không hợp lệ');
        }

        if (user.otpExpiresAt < new Date()) {
            throw new BadRequestException('OTP Đã hết hạn');
        }

        return user;
    }

    // Đổi mật khẩu
    async resetPassword(email: string, newPassword: string) {
        const hashedPassword = this.usersService.getHashPassword(newPassword);

        return await this.prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                otp: null, // Xoá OTP sau khi đổi mật khẩu
                otpExpiresAt: null,
            },
        });
    }
}
