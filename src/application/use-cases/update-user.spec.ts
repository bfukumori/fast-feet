import { HttpStatus } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { toPersistence } from "@src/infrastructure/mappers/prisma-user-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";
import { DomainError } from "@src/shared/errors/domain-error";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory.user-repository";
import { Role } from "generated/prisma";
import { UpdateUserUseCase } from "./update-user";

let inMemoryUserRepository: InMemoryUserRepository;
let user: User;
let sut: UpdateUserUseCase;

describe("Update user use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		sut = new UpdateUserUseCase(inMemoryUserRepository);
		user = makeUser();
	});

	it("should be able to update a new user", async () => {
		inMemoryUserRepository.users.push(user);

		user.updateName("new name");
		user.updateRole(Role.ADMIN);

		await sut.execute(toPersistence(user), user.id.value);

		expect(inMemoryUserRepository.users[0]).toStrictEqual(
			makeUser({
				id: user.id.value,
				name: "new name",
				role: Role.ADMIN,
			}),
		);
	});

	it("should not be able to update a nonexistent user", async () => {
		await expect(async () => {
			await sut.execute(toPersistence(user), user.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`User with ID: "${user.id.value}" not found.`,
				UpdateUserUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});

	it("should not be able to update a user with invalid role", async () => {
		await expect(async () => {
			makeUser({ role: "invalid-role" as Role });
		}).rejects.toThrow(
			new DomainError("Invalid role", User.name, HttpStatus.BAD_REQUEST),
		);
	});
});
