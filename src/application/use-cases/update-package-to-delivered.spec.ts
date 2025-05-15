import { fakerPT_BR as faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { PackageStatus } from "generated/prisma";
import { UpdateToDeliveredUseCase } from "./update-package-to-delivered";

let inMemoryPackageRepository: InMemoryPackageRepository;
let sut: UpdateToDeliveredUseCase;

describe("Update to delivered use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new UpdateToDeliveredUseCase(inMemoryPackageRepository);
	});

	it("should be able to update to delivered", async () => {
		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
			deliveredPhotoUrl: faker.image.url(),
		});

		inMemoryPackageRepository.packs.push(pack);

		await sut.execute(pack.id.value, pack.deliveredPhotoUrl ?? "");

		expect(inMemoryPackageRepository.packs[0]).toMatchObject({
			status: PackageStatus.DELIVERED,
		});
	});

	it("should not be able to update a nonexistent package", async () => {
		const invalidId = "invalid id";

		await expect(async () => {
			await sut.execute(invalidId, "");
		}).rejects.toThrow(
			new ApplicationError(
				`Package with ID: "${invalidId}" not found.`,
				UpdateToDeliveredUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});

	it("should not be able to update if invalid status", async () => {
		const pack = makePackage({ deliveredPhotoUrl: faker.image.url() });

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(pack.id.value, pack.deliveredPhotoUrl ?? "");
		}).rejects.toThrow(
			new DomainError(
				Package.ERROR_MESSAGE.cantDelivered,
				Package.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});

	it("should not be able to update if there is no photo proof", async () => {
		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
		});

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(pack.id.value, pack.deliveredPhotoUrl ?? "");
		}).rejects.toThrow(
			new DomainError(
				Package.ERROR_MESSAGE.deliveryPhotoProofRequired,
				Package.name,
			),
		);
	});
});
