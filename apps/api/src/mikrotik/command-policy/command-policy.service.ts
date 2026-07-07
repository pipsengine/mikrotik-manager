import { Injectable } from "@nestjs/common";

const dangerousPatterns = [/\/system\s+reset-configuration/i, /\/system\s+routerboard\s+upgrade/i, /remove\s+\[find\]/i];

@Injectable()
export class CommandPolicyService {
  review(commands: string[]) {
    const violations = commands.filter((command) => dangerousPatterns.some((pattern) => pattern.test(command)));
    return { allowed: violations.length === 0, violations };
  }
}
