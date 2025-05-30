import { HttpStatus } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { toPersistence } from "@src/infrastructure/mappers/prisma-user-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { Role } from "generated/prisma";
import { CreateUserDto } from "../dtos/create-user.dto";
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
		const createUserDto: CreateUserDto = {
			name: "John Doe",
			cpf: "11649425066",
			password: "#Aa12345",
			role: Role.DELIVERY_MAN,
		};

		await sut.execute(createUserDto);

		expect(inMemoryUserRepository.users).toHaveLength(1);
		expect(inMemoryUserRepository.users[0].id.value).toBeTruthy();
	});

	it("should not be able to create a new user with the same cpf", async () => {
		const user1 = makeUser();
		const user2 = makeUser();

		await sut.execute(toPersistence(user1));

		await expect(async () => {
			await sut.execute(toPersistence(user2));
		}).rejects.toThrow(
			new ApplicationError(
				User.ERROR_MESSAGE.alreadyExists,
				CreateUserUseCase.name,
				HttpStatus.CONFLICT,
			),
		);
	});

	it("should not be able to create a new user with invalid role", async () => {
		await expect(async () => {
			makeUser({ role: "invalid-role" as Role });
		}).rejects.toThrow(
			new DomainError(
				User.ERROR_MESSAGE.invalidRole,
				User.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});
});
