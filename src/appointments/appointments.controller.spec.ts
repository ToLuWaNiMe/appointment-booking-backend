import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [AppointmentsService],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should create an appointment', async () => {
    const dto = {
      user_name: 'Test',
      email: 'test@example.com',
      date_time: new Date('2024-05-15T09:00:00').toISOString(),
    };
    const result = await controller.create(dto);
    expect(result).toBeDefined();
  });
});
