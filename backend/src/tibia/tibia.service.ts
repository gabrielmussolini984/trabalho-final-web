import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreatureDetail, CreatureSummary } from './creature.interface';

const BASE_URL = 'https://api.tibiadata.com/v4';

@Injectable()
export class TibiaService {
  constructor(private readonly http: HttpService) {}

  async listCreatures(): Promise<CreatureSummary[]> {
    const response = await firstValueFrom(this.http.get(`${BASE_URL}/creatures`));
    return response.data.creatures.creature_list.map((c: any) => ({
      name: c.name,
      race: c.race,
      imageUrl: c.image_url,
    }));
  }

  async getCreature(race: string): Promise<CreatureDetail | null> {
    // TibiaData responds with HTTP 400 (not 200) when the race is invalid,
    // which makes Axios reject the request — treat any request failure as "not found".
    let response;
    try {
      response = await firstValueFrom(this.http.get(`${BASE_URL}/creature/${race}`));
    } catch {
      return null;
    }
    const c = response.data.creature;
    if (!c?.name) {
      return null;
    }
    return {
      name: c.name,
      race,
      imageUrl: c.image_url,
      description: c.description,
      hitpoints: c.hitpoints,
    };
  }

  async creatureExists(race: string): Promise<boolean> {
    const creature = await this.getCreature(race);
    return creature !== null;
  }
}
