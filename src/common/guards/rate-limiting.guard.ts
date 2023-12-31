import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { routeMatching } from '../utils/route-matching';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

const includedRoutes = [
  {
    path: 'borrowers',
    methods: ['POST']
  },
  {
    path: 'borrowing-process',
    methods: ['POST']
  },
]

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(@InjectRedis() private redis: Redis) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!routeMatching(request, includedRoutes)) return true;

    return this.validateRequest(request);
  }

  async validateRequest(request: any) {
    const now = new Date()
    const time = String(now.toISOString()).split(":");
    const timeTillMins = time.filter((value) => value != time[time.length - 1]).join(":");

    const old = await this.redis.get(String(timeTillMins));
    await this.redis.set(String(timeTillMins), String((parseInt(old) || 0) + 1));

    const newBucket = await this.redis.get(String(timeTillMins));
    console.log("New:", newBucket);

    if (parseInt(newBucket) >= parseInt(process.env.RATE_LIMIT_CHECKOUT))
      throw new HttpException("Too many requests", HttpStatus.TOO_MANY_REQUESTS)

    return true;
  }
}
