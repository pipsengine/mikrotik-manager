import { Module } from "@nestjs/common";
import { SecretsController } from "./secrets.controller";

@Module({ controllers: [SecretsController] })
export class SecretsModule {}
