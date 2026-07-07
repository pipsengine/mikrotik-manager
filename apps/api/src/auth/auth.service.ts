import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { passwordPolicy } from "@mikroktic-manager/security-kit";

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  login(email: string, rememberMe = false) {
    if (!email) throw new UnauthorizedException("Email is required.");
    return {
      accessToken: this.jwt.sign({ sub: email, permissions: ["dashboard.view"] }, { expiresIn: "15m" }),
      refreshToken: this.jwt.sign({ sub: email, rememberMe }, { secret: process.env.JWT_REFRESH_SECRET ?? "development-refresh", expiresIn: rememberMe ? "30d" : "8h" }),
      passwordPolicy,
      mfaReady: true,
      sessionTimeoutMinutes: rememberMe ? 43200 : 480
    };
  }
}
