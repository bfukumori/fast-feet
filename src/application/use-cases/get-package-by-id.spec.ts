import { HttpStatus } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { GetPackageByIdUseCase } from "./get-package-by-id";

let inMemoryPackageRepository: InMemoryPackageRepository;
let pack: Package;
let sut: GetPackageByIdUseCase;

describe("Get package by id use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new GetPackageByIdUseCase(inMemoryPackageRepository);
		pack = makePackage();
	});

	it("should be able to get a package by its id", async () => {
		inMemoryPackageRepository.packs.push(pack);

		const fetchedPackage = await sut.execute(pack.id.value);

		expect(fetchedPackage).toStrictEqual({
			id: pack.id.value,
			deliveryManId: pack.deliveryManId,
			recipientId: pack.recipientId,
			status: pack.status,
			description: pack.description,
			pickedDate: pack.pickedDate,
			deliveredDate: pack.deliveredDate,
			deliveredPhotoUrl: pack.deliveredPhotoUrl,
			returnedDate: pack.returnedDate,
		});
	});

	it("should not be able to get a nonexistent package", async () => {
		await expect(async () => {
			await sut.execute(pack.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`Package with ID: "${pack.id.value}" not found.`,
				GetPackageByIdUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
