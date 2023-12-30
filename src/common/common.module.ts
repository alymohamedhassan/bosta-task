import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateLimitGuard } from './guards/rate-limiting.guard';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    NestRedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      },
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class CommonModule {}
