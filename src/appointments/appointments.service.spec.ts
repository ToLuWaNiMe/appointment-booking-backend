import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });
  it('should reject invalid time slots', async () => {
    const invalidSlot: string = '2023-10-10T10:00:00Z';
    const createAppointmentDto: CreateAppointmentDto = {
      date_time: invalidSlot,
      user_name: 'testUser',
      email: 'test@example.com',
    };
    await expect(service.create(createAppointmentDto)).rejects.toThrow(
      ConflictException,
    );
  });
});
