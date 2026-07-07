import { Controller, Get } from "@nestjs/common";

@Controller("jobs")
export class JobsController {
  @Get()
  list() {
    return { jobs: ["automatic-backup", "discovery", "validation", "notifications", "scheduled-jobs"] };
  }
}
