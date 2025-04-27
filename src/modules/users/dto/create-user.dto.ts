import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'demo.cred@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Demo Cred' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'AyushDemoCred@123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 