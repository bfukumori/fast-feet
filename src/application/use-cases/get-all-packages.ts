import { Injectable } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";

@Injectable()
export class GetAllPackagesUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute(params?: PaginationQueryDto) {
		const { packages, currentPage, totalCount, totalPages } =
			await this.packageRepository.getAll(params);

		return {
			packages,
			currentPage,
			totalCount,
			totalPages,
		};
	}
}
