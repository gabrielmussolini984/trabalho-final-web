import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BestiaryEntry } from '../bestiary/bestiary-entry.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => BestiaryEntry, (entry) => entry.user)
  entries: BestiaryEntry[];
}
