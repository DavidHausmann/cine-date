import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RequestUser } from "../../common/interfaces/request-user.interface";
import { UsersService } from "../users/users.service";

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginWithGoogle(accessToken: string) {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new UnauthorizedException("Google token invalid");
    }

    const payload = (await res.json()) as Partial<GoogleUserInfo>;
    if (!payload.sub || !payload.email || !payload.name) {
      throw new UnauthorizedException("Google token invalid");
    }

    const user = await this.usersService.upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.picture,
    });

    const appToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      accessToken: appToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async getOptionalUserFromBearerToken(
    authorization?: string,
  ): Promise<RequestUser | undefined> {
    if (!authorization?.startsWith("Bearer ")) {
      return undefined;
    }

    try {
      const token = authorization.slice("Bearer ".length);
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        name: string;
      }>(token);
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      };
    } catch {
      return undefined;
    }
  }
}
