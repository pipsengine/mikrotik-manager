import { Body, Get, Param, Post } from "@nestjs/common";

export abstract class ResourceController {
  protected constructor(private readonly resourceName: string) {}

  @Get()
  list() {
    return { resource: this.resourceName, items: [], status: "ready" };
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return { resource: this.resourceName, id, status: "ready" };
  }

  @Post()
  create(@Body() body: unknown) {
    return { resource: this.resourceName, accepted: true, body };
  }
}
