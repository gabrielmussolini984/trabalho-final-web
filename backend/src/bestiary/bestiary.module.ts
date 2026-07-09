import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TibiaModule } from '../tibia/tibia.module';
import { BestiaryEntry } from './bestiary-entry.entity';
import { BestiaryService } from './bestiary.service';
import { BestiaryController } from './bestiary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BestiaryEntry]), AuthModule, TibiaModule],
  providers: [BestiaryService],
  controllers: [BestiaryController],
})
export class BestiaryModule {}
