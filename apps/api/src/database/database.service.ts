import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { pool } from './pool';

@Injectable()
export class DatabaseService implements OnModuleDestroy{
   query<T = any>(text: string, params?: any[]) {
    return pool.query<T>(text, params);
  }

  async onModuleDestroy() {
    await pool.end();
  }
}
