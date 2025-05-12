import { HttpStatus } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { UserRole } from "@src/domain/enums/user-role.enum";
import { toPersistence } from "@src/infrastructure/mappers/user-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory.user-repository";
import { CreateUserUseCase } from "./create-user";

let inMemoryUserRepository: InMemoryUserRepository;
let hasher: FakeHasher;
let sut: CreateUserUseCase;

describe("Create user use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		hasher = new FakeHasher();
		sut = new CreateUserUseCase(inMemoryUserRepository, hasher);
	});

	it("should be able to create a new user", async () => {
		const user = makeUser();

		await sut.execute(toPersistence(user));

		expect(inMemoryUserRepository.users).toHaveLength(1);
		expect(inMemoryUserRepository.users[0]).toStrictEqual(
			User.create({
				cpf: user.cpf.value,
				name: user.name,
				role: user.role,
				password: await hasher.hash(user.password.toString()),
			}),
		);
	});

	it("should not be able to create a new user with the same cpf", async () => {
		const user1 = makeUser();
		const user2 = makeUser();

		await sut.execute(toPersistence(user1));

		await expect(async () => {
			await sut.execute(toPersistence(user2));
		}).rejects.toThrow(
			new ApplicationError(
				"User already exists.",
				CreateUserUseCase.name,
				HttpStatus.CONFLICT,
			),
		);
	});

	it("should not be able to create a new user with invalid role", async () => {
		await expect(async () => {
			makeUser("invalid-role" as UserRole);
		}).rejects.toThrow(
			new DomainError("Invalid role", User.name, HttpStatus.BAD_REQUEST),
		);
	});
});
