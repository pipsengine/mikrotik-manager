import { Controller, Get } from "@nestjs/common";
import { routerConfigurationDomains } from "@mikroktic-manager/shared";

@Controller("configuration")
export class ConfigurationController {
  @Get("domains")
  domains() {
    return { domains: routerConfigurationDomains };
  }
}
