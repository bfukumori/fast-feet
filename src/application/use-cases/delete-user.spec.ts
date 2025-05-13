import { HttpStatus } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory.user-repository";
import { DeleteUserUseCase } from "./delete-user";

let inMemoryUserRepository: InMemoryUserRepository;
let user: User;
let sut: DeleteUserUseCase;

describe("Delete user use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		sut = new DeleteUserUseCase(inMemoryUserRepository);
		user = makeUser();
	});

	it("should be able to delete a user", async () => {
		inMemoryUserRepository.users.push(user);

		await sut.execute(user.id.value);

		expect(inMemoryUserRepository.users.length).toBe(0);
	});

	it("should not be able to delete a nonexistent user", async () => {
		await expect(async () => {
			await sut.execute(user.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`User with ID: "${user.id.value}" not found.`,
				DeleteUserUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
