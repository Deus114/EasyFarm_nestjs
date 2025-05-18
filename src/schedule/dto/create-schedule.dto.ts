import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RepeatType } from "generated/prisma";

export class CreateScheduleDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: "Title không được để trống" })
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ example: "HH:mm" })
    @IsNotEmpty({ message: "StartTime không được để trống" })
    startTime: string; // "HH:mm"

    @ApiProperty({ example: "DAILY | WEEKLY | MONTHLY" })
    @IsNotEmpty({ message: "RepeatType không được để trống" })
    @IsEnum(RepeatType)
    repeatType: RepeatType;

    @ApiProperty({ example: "[0, ..., 6]" })
    @IsOptional()
    @IsArray()
    repeatDays?: number[];  // Chỉ cần nếu weekly

    @ApiProperty({ example: "[1, ..., 31]" })
    @IsOptional()
    @IsArray()
    repeatDates?: number[]; // Chỉ cần nếu monthly

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
