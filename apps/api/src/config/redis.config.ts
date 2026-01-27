import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.UPSTASH_REDIS_URL,
  ttl: 60,
}));