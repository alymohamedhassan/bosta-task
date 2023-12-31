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
    methods: ['GET']
  },
]

const adminRoutes = [
  {
    path: 'borrowing-process',
    methods: ['GET']
  },
  {
    path: 'books',
    methods: ['POST', 'PATCH', 'DELETE']
  },
]

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if the routes is allowed without any admin privileges, move forward
    if (routeMatching(request, allowedRoutes)) return true;

    // Check if username is admin_username from env validate on that
    if (routeMatching(request, adminRoutes)) 
      return this.validateAdminRequest(request)
    
    return this.validateRequest(request);
  }

  decode(encoding: string): string {
    return Buffer.from(encoding, 'base64').toString('ascii');
  }

  async validateAdminRequest(request: any) {
    const authorization = request.headers.authorization;
    if (!authorization?.split(" ")) {
      return false;
    }

    const token = authorization.split(" ")[1]

    const decoded = this.decode(token)
    const email = decoded.split(":")[0]
    const password = decoded.split(":")[1]

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminUsername === email && adminPassword === password)
      return true

    return false;
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
