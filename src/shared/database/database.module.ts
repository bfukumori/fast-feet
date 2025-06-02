import { Module } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { PrismaPackageRepository } from "@src/infrastructure/repositories/prisma/prisma-package-repository";
import { PrismaRecipientRepository } from "@src/infrastructure/repositories/prisma/prisma-recipient-repository";
import { PrismaUserRepository } from "@src/infrastructure/repositories/prisma/prisma-user-repository";
import { PrismaService } from "./prisma/prisma.service";

@Module({
	providers: [
		PrismaService,
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
		{
			provide: PackageRepository,
			useClass: PrismaPackageRepository,
		},
		{
			provide: RecipientRepository,
			useClass: PrismaRecipientRepository,
		},
	],
	exports: [
		PrismaService,
		UserRepository,
		PackageRepository,
		RecipientRepository,
	],
})
export class DatabaseModule {}
