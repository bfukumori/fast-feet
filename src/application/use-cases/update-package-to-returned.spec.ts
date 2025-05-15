import { HttpStatus } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { PackageStatus } from "generated/prisma";
import { UpdateToReturnedUseCase } from "./update-package-to-returned";

let inMemoryPackageRepository: InMemoryPackageRepository;
let sut: UpdateToReturnedUseCase;

describe("Update to returned use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new UpdateToReturnedUseCase(inMemoryPackageRepository);
	});

	it("should be able to update to returned", async () => {
		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
		});

		inMemoryPackageRepository.packs.push(pack);

		await sut.execute(pack.id.value);

		expect(inMemoryPackageRepository.packs[0]).toMatchObject({
			status: PackageStatus.RETURNED,
		});
	});

	it("should not be able to update a nonexistent package", async () => {
		const invalidId = "invalid id";

		await expect(async () => {
			await sut.execute(invalidId);
		}).rejects.toThrow(
			new ApplicationError(
				`Package with ID: "${invalidId}" not found.`,
				UpdateToReturnedUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});

	it("should not be able to update if invalid status", async () => {
		const pack = makePackage();

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(pack.id.value);
		}).rejects.toThrow(
			new DomainError(
				Package.ERROR_MESSAGE.cantReturned,
				Package.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});
});
