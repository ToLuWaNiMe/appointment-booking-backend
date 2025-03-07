import { Logger } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  private readonly logger = new Logger(AppointmentsController.name); // Create a new appointment
  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }
  // Get all appointments (admin-only)
  @Get()
  async findAll(@Query('apiKey') apiKey: string): Promise<Appointment[]> {
    if (apiKey !== process.env.ADMIN_API_KEY) {
      this.logger.warn(`UNAUTHORIZED access atempt with API key: ${apiKey}`);
      throw new ForbiddenException('Invalid API key');
    }
    this.logger.log(`Admin Accessed all appointments`);
    return this.appointmentsService.findAll();
  }
  // Check available slots for a date
  @Get('availability')
  async getAvailability(@Query('date') date: string): Promise<string[]> {
    return await this.appointmentsService.getAvailability(date);
  }
}
