import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  LETHAL = 'lethal',
}

@Entity()
@Unique(['userId', 'creatureName'])
export class BestiaryEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatureName: string;

  @Column({ type: 'text' })
  difficulty: Difficulty;

  @Column({ type: 'text', default: '' })
  observedLoot: string;

  @Column({ type: 'text', default: '' })
  notes: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.entries, { onDelete: 'CASCADE' })
  user: User;
}
