import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    content: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'ID không được để trống' })
    id: number;
}
