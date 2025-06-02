import { randomUUID } from "node:crypto";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { Package } from "@src/domain/entities/package";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { makePackage } from "@test/factories/make-package-factory";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { PackageStatus } from "generated/prisma";
import { UpdateToDeliveredUseCase } from "./update-package-to-delivered";

let inMemoryPackageRepository: InMemoryPackageRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: UpdateToDeliveredUseCase;

describe("Update to delivered use case", () => {
	beforeEach(() => {
		inMemoryPackageRepository = new InMemoryPackageRepository();
		inMemoryUserRepository = new InMemoryUserRepository();
		sut = new UpdateToDeliveredUseCase(inMemoryPackageRepository);
	});

	it("should be able to update to delivered", async () => {
		const user = makeUser();

		inMemoryUserRepository.createUser(user);

		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
			deliveredPhotoUrl: faker.image.url(),
			deliveryManId: user.id.value,
		});

		inMemoryPackageRepository.packs.push(pack);

		await sut.execute(
			pack.id.value,
			pack.deliveredPhotoUrl ?? "",
			user.id.value,
		);

		expect(inMemoryPackageRepository.packs[0]).toMatchObject({
			status: PackageStatus.DELIVERED,
		});
		expect(inMemoryPackageRepository.packs[0].deliveredDate).not.toBeNull();
		expect(inMemoryPackageRepository.packs[0].deliveredPhotoUrl).not.toBeNull();
	});

	it("should not be able to update a nonexistent package", async () => {
		const invalidId = "invalid id";
		const user = makeUser();

		inMemoryUserRepository.createUser(user);

		await expect(async () => {
			await sut.execute(invalidId, "", user.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`Package with ID: "${invalidId}" not found.`,
				UpdateToDeliveredUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});

	it("should not be able to update if invalid status", async () => {
		const user = makeUser();

		inMemoryUserRepository.createUser(user);

		const pack = makePackage({
			deliveredPhotoUrl: faker.image.url(),
			deliveryManId: user.id.value,
		});

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(
				pack.id.value,
				pack.deliveredPhotoUrl ?? "",
				user.id.value,
			);
		}).rejects.toThrow(
			new DomainError(
				Package.ERROR_MESSAGE.cantDelivered,
				Package.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});

	it("should not be able to update if there is no photo proof", async () => {
		const user = makeUser();

		inMemoryUserRepository.createUser(user);

		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
			deliveryManId: user.id.value,
		});

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(
				pack.id.value,
				pack.deliveredPhotoUrl ?? "",
				user.id.value,
			);
		}).rejects.toThrow(
			new DomainError(
				Package.ERROR_MESSAGE.deliveryPhotoProofRequired,
				Package.name,
			),
		);
	});

	it("should not be able to update if it's not the same person who picked up", async () => {
		const user = makeUser();

		inMemoryUserRepository.createUser(user);

		const pack = makePackage({
			status: PackageStatus.PICKED_UP,
			deliveryManId: randomUUID(),
		});

		inMemoryPackageRepository.packs.push(pack);

		await expect(async () => {
			await sut.execute(
				pack.id.value,
				pack.deliveredPhotoUrl ?? "",
				user.id.value,
			);
		}).rejects.toThrow(
			new ApplicationError(
				`You don't have enough permissions.`,
				UpdateToDeliveredUseCase.name,
				HttpStatus.FORBIDDEN,
			),
		);
	});
});
