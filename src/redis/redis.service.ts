import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;
  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    this.redis.on('connect', () => {
      console.log('Reddis connected✅');
    });
    this.redis.on('error', (err) => {
      console.log('Reddis connection error❌:', err);
    });
  }

  async get(key: string) {
    return this.redis.get(key);
  }
  async set(key: string, value: any, expire?: number) {
    if (expire)
      return await this.redis.set(key, JSON.stringify(value), 'EX', expire);
    return await this.redis.set(key, JSON.stringify(value));
  }
  async del(key: string) {
    return await this.redis.del(key);
  }
}
