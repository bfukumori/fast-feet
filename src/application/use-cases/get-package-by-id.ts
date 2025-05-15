import { HttpStatus, Injectable } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { toResponse } from "@src/infrastructure/mappers/response-package-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class GetPackageByIdUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute(id: string) {
		const pack = await this.packageRepository.getPackageById(id);

		if (!pack) {
			throw new ApplicationError(
				`Package with ID: "${id}" not found.`,
				GetPackageByIdUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		return toResponse(pack);
	}
}
