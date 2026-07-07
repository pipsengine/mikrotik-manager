import { Injectable } from "@nestjs/common";
import { routerInventorySections } from "@mikroktic-manager/shared";

@Injectable()
export class InventoryService {
  list() {
    return { sections: routerInventorySections, routers: [] };
  }
}
