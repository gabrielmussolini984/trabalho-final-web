import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateBestiaryEntryDto } from './create-bestiary-entry.dto';

export class UpdateBestiaryEntryDto extends PartialType(
  OmitType(CreateBestiaryEntryDto, ['creatureName'] as const),
) {}
