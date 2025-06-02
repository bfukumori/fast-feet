import { Injectable } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import {
	toDomain,
	toPersistence,
} from "@src/infrastructure/mappers/prisma-package-mapper";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";

@Injectable()
export class PrismaPackageRepository implements PackageRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getPackageById(id: string): Promise<Package | null> {
		const pack = await this.prisma.package.findUnique({
			where: { id },
		});

		if (!pack) {
			return null;
		}

		return toDomain(pack);
	}

	async createPackage(pack: Package): Promise<void> {
		await this.prisma.package.create({
			data: toPersistence(pack),
		});
	}

	async updatePackage(pack: Package): Promise<void> {
		await this.prisma.package.update({
			where: { id: pack.id.value },
			data: toPersistence(pack),
		});
	}

	async deletePackage(id: string): Promise<void> {
		await this.prisma.package.delete({
			where: { id },
		});
	}
}
