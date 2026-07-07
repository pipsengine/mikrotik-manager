import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string; rememberMe?: boolean }) {
    return this.auth.login(body.email, body.rememberMe);
  }
}
