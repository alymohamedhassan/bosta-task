import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Buffer } from 'buffer';
import { trace } from 'console';
import { decode } from 'punycode';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

const allowedRoutes = [
  {
    path: 'borrowers',
    methods: ['POST']
  },
  {
    path: 'books',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  },
]

export const routeMatching = (request: any, allowedRoutes: any[]) => {
  const isRouteMatch = allowedRoutes.some((route) => {
    const isPAthMatch = request.route?.path.includes(route.path);
    const isMethodMatch =
      !route.methods || route.methods.includes(request.method);
    return isPAthMatch && isMethodMatch;
  });

  return isRouteMatch;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request) || routeMatching(request, allowedRoutes);
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
