import { GetPackageDto } from "@src/application/dtos/get-package.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { Package } from "../entities/package";

export abstract class PackageRepository {
	abstract getPackageById(id: string): Promise<Package | null>;
	abstract createPackage(pack: Package): Promise<void>;
	abstract updatePackage(pack: Package): Promise<void>;
	abstract deletePackage(id: string): Promise<void>;
	abstract getAll(params?: PaginationQueryDto): Promise<{
		packages: GetPackageDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}>;
}
