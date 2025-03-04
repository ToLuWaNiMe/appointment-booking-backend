/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  user_name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  date_time: string;
}

