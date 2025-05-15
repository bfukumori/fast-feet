import { HttpStatus } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { DeletePackageUseCase } from "./delete-package";

let inMemoryPackageRepository: InMemoryPackageRepository;
let pack: Package;
let sut: DeletePackageUseCase;

describe("Delete package use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new DeletePackageUseCase(inMemoryPackageRepository);
		pack = makePackage();
	});

	it("should be able to delete a package", async () => {
		inMemoryPackageRepository.packs.push(pack);

		await sut.execute(pack.id.value);

		expect(inMemoryPackageRepository.packs.length).toBe(0);
	});

	it("should not be able to delete a nonexistent package", async () => {
		await expect(async () => {
			await sut.execute(pack.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`Package with ID: "${pack.id.value}" not found.`,
				DeletePackageUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
