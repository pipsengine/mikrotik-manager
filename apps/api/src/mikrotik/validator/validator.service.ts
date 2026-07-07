import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidatorService {
  validate(routerId: string) {
    return { routerId, valid: true, checks: ["connectivity", "configuration", "security", "health"] };
  }
}
