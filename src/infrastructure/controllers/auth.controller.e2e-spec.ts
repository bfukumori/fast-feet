import { HttpStatus, INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { SignInDto } from "@src/application/dtos/sign-in.dto";
import { DatabaseModule } from "@src/shared/database/database.module";
import { UserFactory } from "@test/factories/make-user-factory";
import request from "supertest";
import { BcryptHasher } from "../services/cryptography/bcrypt/bcrypt-hasher";

describe("Auth [e2e]", () => {
	let app: INestApplication;
	let userFactory: UserFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		userFactory = moduleRef.get(UserFactory);

		await app.listen(0);
	});

	test("[POST] Authenticate a user", async () => {
		const hasher = new BcryptHasher();
		const user = await userFactory.makePrismaUser({
			password: await hasher.hash("#Aa12345"),
		});

		const signInDto: SignInDto = {
			cpf: user.cpf.value,
			password: "#Aa12345",
		};

		const response = await request(app.getHttpServer())
			.post("/api/auth/sign-in")
			.send(signInDto);

		expect(response.statusCode).toBe(HttpStatus.OK);
		expect(response.body).toMatchObject({
			accessToken: expect.any(String),
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
