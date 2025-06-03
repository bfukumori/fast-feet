import { Injectable } from "@nestjs/common";
import { GetPackageDto } from "@src/application/dtos/get-package.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
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

	async getAll(params?: PaginationQueryDto): Promise<{
		packages: GetPackageDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}> {
		const { limit, page } = params || { limit: 10, page: 1 };
		const skip = (page - 1) * limit;

		const [packages, totalCount] = await Promise.all([
			this.prisma.package.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			this.prisma.package.count(),
		]);

		return {
			packages: packages.map((pack) => ({
				...pack,
				createdAt: pack.createdAt.toISOString(),
				deliveredDate: pack.deliveredDate?.toISOString(),
				pickedDate: pack.pickedDate?.toISOString(),
				returnedDate: pack.returnedDate?.toISOString(),
			})),
			totalCount,
			totalPages: Math.ceil(totalCount / limit),
			currentPage: page,
		};
	}

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
