import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { TibiaService } from './tibia.service';
import { TibiaController } from './tibia.controller';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [TibiaService],
  controllers: [TibiaController],
  exports: [TibiaService],
})
export class TibiaModule {}
