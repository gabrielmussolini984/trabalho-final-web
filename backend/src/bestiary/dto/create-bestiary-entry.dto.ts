import { IsEnum, IsString, MinLength } from 'class-validator';
import { Difficulty } from '../bestiary-entry.entity';

export class CreateBestiaryEntryDto {
  @IsString()
  @MinLength(1)
  creatureName: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsString()
  observedLoot: string;

  @IsString()
  notes: string;
}
