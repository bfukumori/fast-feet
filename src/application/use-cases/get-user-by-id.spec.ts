import { HttpStatus } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory.user-repository";
import { GetUserByIdUseCase } from "./get-user-by-id";

let inMemoryUserRepository: InMemoryUserRepository;
let user: User;
let sut: GetUserByIdUseCase;

describe("Get user by id use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		sut = new GetUserByIdUseCase(inMemoryUserRepository);
		user = makeUser();
	});

	it("should be able to get a user by its id", async () => {
		inMemoryUserRepository.users.push(user);

		const fetchedUser = await sut.execute(user.id.value);

		expect(fetchedUser).toStrictEqual({
			id: user.id.value,
			name: user.name,
			cpf: user.cpf.value,
			role: user.role,
		});
	});

	it("should not be able to get a nonexistent user", async () => {
		await expect(async () => {
			await sut.execute(user.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`User with ID: "${user.id.value}" not found.`,
				GetUserByIdUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
