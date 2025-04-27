import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SensorStatus, SensorType } from "generated/prisma";

export class UpdateSensorDto {

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    serialNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    type: SensorType;

    @ApiProperty()
    @IsNotEmpty()
    status: SensorStatus;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    img: string;
}
