import {
  IsEmail,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: [{ given: ['John'], family: 'Doe' }] })
  @IsArray()
  @IsNotEmpty()
  name: any[];

  @ApiProperty({
    example: 'male',
    enum: ['male', 'female', 'other', 'unknown'],
  })
  @IsOptional()
  gender: any;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsString()
  @IsOptional()
  birth_date?: string;

  @ApiProperty({
    example: [{ system: 'email', value: 'john@example.com' }],
    required: false,
  })
  @IsArray()
  @IsOptional()
  telecom?: any[];

  @ApiProperty({ example: [], required: false })
  @IsArray()
  @IsOptional()
  address?: any[];

  @ApiProperty({ example: '12345678901', required: false })
  @IsString()
  @IsOptional()
  nin?: string;

  @ApiProperty({ example: '12345', required: false })
  @IsString()
  @IsOptional()
  pin?: string;

  @ApiProperty({ example: 'addr_test1...', required: false })
  @IsString()
  @IsOptional()
  walletAddress?: string;
}
