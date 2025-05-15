import { HttpStatus, Injectable } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class DeletePackageUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute(packageId: string) {
		const existingPackage =
			await this.packageRepository.getPackageById(packageId);

		if (!existingPackage) {
			throw new ApplicationError(
				`Package with ID: "${packageId}" not found.`,
				DeletePackageUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}
		await this.packageRepository.deletePackage(existingPackage.id.value);
	}
}
