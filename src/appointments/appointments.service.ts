import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  // Create a new appointment
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    // Validate business rules
    this.validateTimeSlot(new Date(createAppointmentDto.date_time));

    // Check for existing appointments
    const existing = await this.appointmentsRepository.findOne({
      where: { date_time: new Date(createAppointmentDto.date_time) },
    });

    if (existing) {
      throw new ConflictException('Time slot already booked');
    }

    return this.appointmentsRepository.save(createAppointmentDto);
  }

  // Get all appointments
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find();
  }

  // Check availability for a date
  async getAvailability(date: string): Promise<string[]> {
    // Generate all slots for the date
    const slots = this.generateTimeSlots(date);

    // Fetch existing appointments for the date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const existing = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.date_time BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getMany();

    // Filter booked slots
    const bookedSlots = existing.map((a) =>
      a.date_time.toISOString().slice(0, 16),
    );
    return slots.filter((slot) => !bookedSlots.includes(slot));
  }

  // Validate time slot rules
  private validateTimeSlot(dateTime: Date): void {
    const date = new Date(dateTime);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const now = new Date();

    // Check past dates
    if (date < now) {
      throw new ConflictException('Cannot book appointments in the past');
    }

    // Check weekday (Mon-Fri)
    if (day === 0 || day === 6) {
      throw new ConflictException('Appointments only available on weekdays');
    }

    // Check time (8:00–17:00)
    if (hours < 8 || hours >= 17) {
      throw new ConflictException('Outside business hours');
    }

    // Check 30-minute increments (0 or 30 minutes)
    if (minutes % 30 !== 0) {
      throw new ConflictException('Slots must be in 30-minute increments');
    }
  }

  // Generate all valid time slots for a date
  private generateTimeSlots(date: string): string[] {
    const slots: string[] = [];
    const currentDate = new Date(date);

    for (let hour = 8; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slot = new Date(currentDate);
        slot.setHours(hour, minute, 0, 0);
        slots.push(slot.toISOString().slice(0, 16)); // Format: "YYYY-MM-DDTHH:MM"
      }
    }
    return slots;
  }
}
