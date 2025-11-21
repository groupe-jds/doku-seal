import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { PrismaService } from '../../database/prisma.service';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import type { SignInDto, SignUpDto } from '@doku-seal/validators';

type ValidatedUser = {
  id: number;
  email: string;
  name: string;
  roles: string[];
  disabled: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials (used by Local Strategy)
   */
  async validateUser(email: string, password: string): Promise<ValidatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        roles: true,
        disabled: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.disabled) {
      throw new UnauthorizedException('Account is disabled');
    }

    if (!user.password) {
      throw new UnauthorizedException('Please sign in with your OAuth provider');
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from result
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Sign in user and return JWT tokens
   */
  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto.email, signInDto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Update last signed in timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastSignedIn: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Sign up new user
   */
  async signUp(signUpDto: SignUpDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(signUpDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        name: signUpDto.name,
        password: hashedPassword,
        roles: ['USER'],
      },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
      },
    });

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

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
        throw new UnauthorizedException('Invalid token');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      const accessToken = this.jwtService.sign(newPayload);

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
        lastSignedIn: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists for security
    if (!user) {
      return { message: 'If the email exists, a reset link will be sent' };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await argon2.hash(token);

    // Save token to database (expires in 1 hour)
    await this.prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiry: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    console.log('Password reset token:', token);

    return {
      message: 'If the email exists, a reset link will be sent',
      // Remove this in production:
      resetToken: token,
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    // Find valid token
    const resetTokens = await this.prisma.passwordResetToken.findMany({
      where: {
        expiry: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    let validToken = null;
    for (const resetToken of resetTokens) {
      try {
        const isValid = await argon2.verify(resetToken.token, token);
        if (isValid) {
          validToken = resetToken;
          break;
        }
      } catch (error) {
        // Invalid token format, continue to next
        continue;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: validToken.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    await this.prisma.passwordResetToken.delete({
      where: { id: validToken.id },
    });

    return { message: 'Password successfully reset' };
  }
}
