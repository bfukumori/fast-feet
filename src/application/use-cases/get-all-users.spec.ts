import { User } from "@src/domain/entities/user";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { GetAllUsersUseCase } from "./get-all-users";

let inMemoryUserRepository: InMemoryUserRepository;
let user: User;
let sut: GetAllUsersUseCase;

describe("Get all users", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		sut = new GetAllUsersUseCase(inMemoryUserRepository);
		user = makeUser();
	});

	it("should be able to list users", async () => {
		for (let index = 0; index <= 10; index++) {
			inMemoryUserRepository.users.push(user);
		}

		const { users } = await sut.execute();

		expect(users).toHaveLength(10);
	});
});
