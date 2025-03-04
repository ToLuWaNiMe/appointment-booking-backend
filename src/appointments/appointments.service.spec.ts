import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should reject invalid time slots', async () => {
    const invalidSlot = new Date('2024-05-15T07:30:00'); // Outside business hours
    await expect(service.create({ date_time: invalidSlot } as any))
      .rejects.toThrow(ConflictException);
  });
});