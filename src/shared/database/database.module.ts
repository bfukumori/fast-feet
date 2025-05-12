import { Module } from "@nestjs/common";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { PrismaUserRepository } from "@src/infrastructure/repositories/prisma/prisma-user-repository";
import { PrismaService } from "./prisma/prisma.service";

@Module({
	providers: [
		PrismaService,
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
	],
	exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
