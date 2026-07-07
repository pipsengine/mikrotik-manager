import { Global, Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {
  constructor() {
    super({ datasources: { db: { url: process.env.DATABASE_URL } } });
  }
}

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
