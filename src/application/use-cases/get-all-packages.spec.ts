import { Package } from "@src/domain/entities/package";
import { makePackage } from "@test/factories/make-package-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { GetAllPackagesUseCase } from "./get-all-packages";

let inMemoryPackageRepository: InMemoryPackageRepository;
let pack: Package;
let sut: GetAllPackagesUseCase;

describe("Get all packages", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		sut = new GetAllPackagesUseCase(inMemoryPackageRepository);
		pack = makePackage();
	});

	it("should be able to list packages", async () => {
		for (let index = 0; index <= 10; index++) {
			inMemoryPackageRepository.packs.push(pack);
		}

		const { packages } = await sut.execute();

		expect(packages).toHaveLength(10);
	});
});
