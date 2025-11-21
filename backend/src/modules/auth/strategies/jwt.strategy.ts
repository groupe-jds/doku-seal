import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigService } from '@nestjs/config';
import type { PrismaService } from '../../../database/prisma.service';

export type JwtPayload = {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
};

export type CurrentUserPayload = {
  userId: number;
  email: string;
  name: string;
  roles: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        disabled: true,
      },
    });

    if (!user || user.disabled) {
      throw new UnauthorizedException('User not found or disabled');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
  }
}
