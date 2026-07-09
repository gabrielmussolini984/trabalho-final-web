import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(email: string, passwordHash: string): Promise<User> {
    const existing = await this.repo.findOneBy({ email });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    return this.repo.save(this.repo.create({ email, passwordHash }));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }
}
