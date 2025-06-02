import { HttpStatus, Injectable } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class UpdateToDeliveredUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute(packageId: string, photoProofUrl: string, userId: string) {
		const existingPackage =
			await this.packageRepository.getPackageById(packageId);

		if (!existingPackage) {
			throw new ApplicationError(
				`Package with ID: "${packageId}" not found.`,
				UpdateToDeliveredUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		if (userId !== existingPackage.deliveryManId) {
			throw new ApplicationError(
				`You don't have enough permissions.`,
				UpdateToDeliveredUseCase.name,
				HttpStatus.FORBIDDEN,
			);
		}

		existingPackage.setPhotoProofUrl(photoProofUrl);
		existingPackage.updateToDelivered();

		await this.packageRepository.updatePackage(existingPackage);
	}
}
