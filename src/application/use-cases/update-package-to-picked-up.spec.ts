import { fakerPT_BR as faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { PackageStatus } from "generated/prisma";
import { UpdateToPickedUpUseCase } from "./update-package-to-picked-up";

let inMemoryPackageRepository: InMemoryPackageRepository;
let sut: UpdateToPickedUpUseCase;

describe("Update to picked up use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new UpdateToPickedUpUseCase(inMemoryPackageRepository);
	});

	it("should be able to update to picked up", async () => {
		const pack = makePackage({
			deliveryManId: faker.string.uuid(),
		});

		inMemoryPackageRepository.packs.push(pack);

		await sut.execute(pack.id.value, pack.deliveryManId ?? "");

		expect(inMemoryPackageRepository.packs[0]).toMatchObject({
			status: PackageStatus.PICKED_UP,
		});
		expect(inMemoryPackageRepository.packs[0].pickedDate).not.toBeNull();
	});

	it("should not be able to update a nonexistent package", async () => {
		const invalidId = "invalid id";

		await expect(async () => {
			await sut.execute(invalidId, "");
		}).rejects.toThrow(
			new ApplicationError(
				`Package with ID: "${invalidId}" not found.`,
				UpdateToPickedUpUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});

	it("should not be able to update if invalid status", async () => {
		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
		});

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(pack.id.value, pack.deliveryManId ?? "");
		}).rejects.toThrow(
			new DomainError(
				Package.ERROR_MESSAGE.cantPickup,
				Package.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});
});
