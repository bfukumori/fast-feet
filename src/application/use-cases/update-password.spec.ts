import { HttpStatus } from "@nestjs/common";
import { Password } from "@src/domain/value-objects/password";
import { ApplicationError } from "@src/shared/errors/application-error";
import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { UpdatePasswordUseCase } from "./update-password";

let inMemoryUserRepository: InMemoryUserRepository;
let hasher: FakeHasher;
let sut: UpdatePasswordUseCase;

describe("Update password use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		hasher = new FakeHasher();
		sut = new UpdatePasswordUseCase(inMemoryUserRepository);
	});

	it("should be able to update password", async () => {
		const user = makeUser();
		inMemoryUserRepository.users.push(user);

		const hashedPwd = await hasher.hash("new password");

		user.changePassword(hashedPwd);

		await sut.execute(
			{ password: hashedPwd, repeatPassword: hashedPwd },
			user.id.value,
		);

		expect(inMemoryUserRepository.users[0]).toMatchObject({
			password: Password.createFromHashed(hashedPwd),
		});
	});

	it("should not be able to update a nonexistent user", async () => {
		const invalidId = "invalid id";

		await expect(async () => {
			await sut.execute({ password: "", repeatPassword: "" }, invalidId);
		}).rejects.toThrow(
			new ApplicationError(
				`User with ID: "${invalidId}" not found.`,
				UpdatePasswordUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
