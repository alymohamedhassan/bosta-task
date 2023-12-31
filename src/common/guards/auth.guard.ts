import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Buffer } from 'buffer';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { routeMatching } from '../utils/route-matching';

const allowedRoutes = [
  {
    path: 'borrowers',
    methods: ['GET', 'POST']
  },
  {
    path: 'books',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  },
]

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return routeMatching(request, allowedRoutes) || this.validateRequest(request);
  }

  decode(encoding: string): string {
    return Buffer.from(encoding, 'base64').toString('ascii');
  }

  async validateRequest(request: any) {
    const authorization = request.headers.authorization;
    if (!authorization?.split(" ")) {
      return false;
    }

    const token = authorization.split(" ")[1]

    const decoded = this.decode(token)
    const email = decoded.split(":")[0]
    const password = decoded.split(":")[1]

    const borrower = await this.prisma.borrower.findFirst({
      select: {
        id: true,
        email: true,
      },
      where: {
        email,
        passwordHash: password,
      }
    })

    if (!borrower)
      return false;

    request['borrower'] = borrower;
    return true;
  }
}
