import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { BestiaryService } from './bestiary.service';
import { CreateBestiaryEntryDto } from './dto/create-bestiary-entry.dto';
import { UpdateBestiaryEntryDto } from './dto/update-bestiary-entry.dto';

@UseGuards(JwtAuthGuard)
@Controller('bestiary')
export class BestiaryController {
  constructor(private readonly bestiary: BestiaryService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateBestiaryEntryDto) {
    return this.bestiary.create(user.sub, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.bestiary.findAllForUser(user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBestiaryEntryDto,
  ) {
    return this.bestiary.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.bestiary.remove(user.sub, id);
  }
}
