import { HttpStatus, Injectable } from "@nestjs/common";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class UpdateToPickedUpUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute(packageId: string, deliveryManId: string) {
		const existingPackage =
			await this.packageRepository.getPackageById(packageId);

		if (!existingPackage) {
			throw new ApplicationError(
				`Package with ID: "${packageId}" not found.`,
				UpdateToPickedUpUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		existingPackage.updateToPickedUp();
		existingPackage.setDeliveryManId(deliveryManId);

		await this.packageRepository.updatePackage(existingPackage);
	}
}
