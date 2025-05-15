import { HttpStatus, Injectable } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class UpdateToDeliveredUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute(packageId: string, photoProofUrl: string) {
		const existingPackage =
			await this.packageRepository.getPackageById(packageId);

		if (!existingPackage) {
			throw new ApplicationError(
				`Package with ID: "${packageId}" not found.`,
				UpdateToDeliveredUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		existingPackage.updateToDelivered();
		existingPackage.setPhotoProofUrl(photoProofUrl);

		await this.packageRepository.updatePackage(existingPackage);
	}
}
