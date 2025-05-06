import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgotPassDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
}

export class VerifyOtpDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'OTP không được để trống' })
    otp: string;
}

export class ResetPassDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
    newPassword: string;
}