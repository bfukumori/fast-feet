import { HttpStatus } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { GetUserByCpfUseCase } from "./get-user-by-cpf";

let inMemoryUserRepository: InMemoryUserRepository;
let user: User;
let sut: GetUserByCpfUseCase;

describe("Get user by cpf use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		sut = new GetUserByCpfUseCase(inMemoryUserRepository);
		user = makeUser();
	});

	it("should be able to get a user by its cpf", async () => {
		inMemoryUserRepository.users.push(user);

		const fetchedUser = await sut.execute(user.cpf.value);

		expect(fetchedUser).toStrictEqual({
			id: user.id.value,
			name: user.name,
			cpf: user.cpf.value,
			role: user.role,
		});
	});

	it("should not be able to get a nonexistent user", async () => {
		await expect(async () => {
			await sut.execute(user.cpf.value);
		}).rejects.toThrow(
			new ApplicationError(
				`User with cpf: "${user.cpf.value}" not found.`,
				GetUserByCpfUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
