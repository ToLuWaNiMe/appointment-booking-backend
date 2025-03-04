import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  email: string;

  @Column({ type: 'datetime' })
  date_time: Date;

  @Column({ default: 'pending' })
  status: string; // e.g., pending, confirmed, canceled
}
