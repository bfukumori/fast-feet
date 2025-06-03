import { GetPackageDto } from "@src/application/dtos/get-package.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { Package } from "@src/domain/entities/package";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { toResponse } from "@src/infrastructure/mappers/response-package-mapper";

export class InMemoryPackageRepository implements PackageRepository {
	public packs: Package[] = [];

	async getAll(params?: PaginationQueryDto): Promise<{
		packages: GetPackageDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}> {
		const totalCount = this.packs.length;

		const { limit, page } = params || { limit: 10, page: 1 };
		const skip = (page - 1) * limit;

		return {
			packages: this.packs.slice(skip, skip + limit).map(toResponse),
			totalPages: Math.ceil(totalCount / limit),
			totalCount,
			currentPage: page,
		};
	}

	async createPackage(pack: Package) {
		this.packs.push(pack);
	}

	async getPackageById(id: string) {
		const pack = this.packs.find((pack) => pack.id.value === id);

		if (!pack) return null;

		return pack;
	}

	async updatePackage(pack: Package): Promise<void> {
		const packIndex = this.packs.findIndex((u) => u.id === pack.id);

		this.packs[packIndex] = pack;
	}

	async deletePackage(id: string): Promise<void> {
		const packIndex = this.packs.findIndex((pack) => pack.id.value === id);

		this.packs.splice(packIndex, 1);
	}
}
