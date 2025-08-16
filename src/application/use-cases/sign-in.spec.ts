import { HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApplicationError } from "@src/shared/errors/application-error";
import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user-factory";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { SignInDto } from "../dtos/sign-in.dto";
import { SignInUseCase } from "./sign-in";

let inMemoryUserRepository: InMemoryUserRepository;
let hasher: FakeHasher;
let sut: SignInUseCase;
let jwtService: JwtService;

describe("Sign in use case", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		hasher = new FakeHasher();
		jwtService = new JwtService({
			secret: "supersecret",
		});
		sut = new SignInUseCase(inMemoryUserRepository, hasher, jwtService);
	});

	it("should be able to sign in a user", async () => {
		const user = makeUser({
			password: await hasher.hash("#Aa12345"),
		});
		await inMemoryUserRepository.createUser(user);

		const signinUserDto: SignInDto = {
			cpf: user.cpf.value,
			password: "#Aa12345",
		};

		const { accessToken } = await sut.execute(signinUserDto);

		expect(accessToken).toBeTruthy();
	});

	it("should not be able to signin an unexisting user", async () => {
		await expect(async () => {
			const user = makeUser({
				password: await hasher.hash("#Aa12345"),
			});

			await inMemoryUserRepository.createUser(user);

			const signinUserDto: SignInDto = {
				cpf: "62195837012",
				password: "#Aa12345",
			};
			await sut.execute(signinUserDto);
		}).rejects.toThrow(
			new ApplicationError(
				"Invalid credentials.",
				SignInUseCase.name,
				HttpStatus.UNAUTHORIZED,
			),
		);
	});

	it("should not be able to signin a user with invalid credentials", async () => {
		await expect(async () => {
			const user = makeUser({
				password: await hasher.hash("#Aa12345"),
			});

			await inMemoryUserRepository.createUser(user);

			const signinUserDto: SignInDto = {
				cpf: user.cpf.value,
				password: "invalid-password",
			};
			await sut.execute(signinUserDto);
		}).rejects.toThrow(
			new ApplicationError(
				"Invalid credentials.",
				SignInUseCase.name,
				HttpStatus.UNAUTHORIZED,
			),
		);
	});
});
