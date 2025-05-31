import { Injectable } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { PackageRepository } from "@src/domain/repositories/package-repository";
import { CreatePackageDto } from "../dtos/create-package.dto";

@Injectable()
export class CreatePackageUseCase {
	constructor(private readonly packageRepository: PackageRepository) {}

	async execute({ description, recipientId }: CreatePackageDto) {
		const pack = Package.create({
			description,
			recipientId,
		});

		await this.packageRepository.createPackage(pack);
	}
}
