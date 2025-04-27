import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SensorType } from "generated/prisma";

export class CreateSensorDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'SerialNumber không được để trống' })
    serialNumber: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Img không được để trống' })
    img: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Type không được để trống' })
    type: SensorType;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'User ID không được để trống' })
    userId: number;
}