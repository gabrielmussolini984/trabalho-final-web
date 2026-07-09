import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TibiaService } from './tibia.service';

@UseGuards(JwtAuthGuard)
@Controller('tibia/creatures')
export class TibiaController {
  constructor(private readonly tibia: TibiaService) {}

  @Get()
  list() {
    return this.tibia.listCreatures();
  }

  @Get(':race')
  async detail(@Param('race') race: string) {
    const creature = await this.tibia.getCreature(race);
    if (!creature) {
      throw new NotFoundException(`Creature "${race}" not found`);
    }
    return creature;
  }
}
