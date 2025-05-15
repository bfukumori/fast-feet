import { toPersistence } from "@src/infrastructure/mappers/prisma-package-mapper";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { CreatePackageUseCase } from "./create-package";

let inMemoryPackageRepository: InMemoryPackageRepository;
let sut: CreatePackageUseCase;

describe("Create package use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new CreatePackageUseCase(inMemoryPackageRepository);
	});

	it("should be able to create a new package", async () => {
		const pack = makePackage();

		await sut.execute(toPersistence(pack));

		expect(inMemoryPackageRepository.packs).toHaveLength(1);
		expect(inMemoryPackageRepository.packs[0].id.value).toBeTruthy();
	});
});
