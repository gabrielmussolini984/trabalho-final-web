import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BestiaryEntry } from './bestiary-entry.entity';
import { CreateBestiaryEntryDto } from './dto/create-bestiary-entry.dto';
import { UpdateBestiaryEntryDto } from './dto/update-bestiary-entry.dto';
import { TibiaService } from '../tibia/tibia.service';

@Injectable()
export class BestiaryService {
  constructor(
    @InjectRepository(BestiaryEntry) private readonly repo: Repository<BestiaryEntry>,
    private readonly tibia: TibiaService,
  ) {}

  async create(userId: string, dto: CreateBestiaryEntryDto): Promise<BestiaryEntry> {
    const exists = await this.tibia.creatureExists(dto.creatureName);
    if (!exists) {
      throw new BadRequestException(`Creature "${dto.creatureName}" was not found in TibiaData`);
    }
    const duplicate = await this.repo.findOneBy({ userId, creatureName: dto.creatureName });
    if (duplicate) {
      throw new ConflictException('You already have a bestiary entry for this creature');
    }
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  findAllForUser(userId: string): Promise<BestiaryEntry[]> {
    return this.repo.find({ where: { userId } });
  }

  async update(userId: string, id: string, dto: UpdateBestiaryEntryDto): Promise<BestiaryEntry> {
    const entry = await this.repo.findOneBy({ id, userId });
    if (!entry) {
      throw new NotFoundException('Bestiary entry not found');
    }
    Object.assign(entry, dto);
    return this.repo.save(entry);
  }

  async remove(userId: string, id: string): Promise<void> {
    const entry = await this.repo.findOneBy({ id, userId });
    if (!entry) {
      throw new NotFoundException('Bestiary entry not found');
    }
    await this.repo.remove(entry);
  }
}
