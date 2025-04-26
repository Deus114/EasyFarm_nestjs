import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    content: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'User ID không được để trống' })
    userId: number;
}

