import { HttpStatus, INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { UserFactory } from "@test/factories/make-user-factory";
import request from "supertest";

describe("Get user [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let userFactory: UserFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		userFactory = moduleRef.get(UserFactory);

		await app.listen(0);
	});

	beforeEach(async () => {
		await prismaService.user.deleteMany();
	});

	test("[GET] Get user by its id", async () => {
		const user = await userFactory.makePrismaUser();

		const response = await request(app.getHttpServer()).get(
			`/api/users/${user.id.value}`,
		);

		expect(response.statusCode).toBe(HttpStatus.OK);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				id: user.id.value,
			},
		});

		expect(userOnDatabase).not.toBeNull();
	});

	test("[GET] Get user by its cpf", async () => {
		const user = await userFactory.makePrismaUser();

		const response = await request(app.getHttpServer()).get(
			`/api/users?cpf=${user.cpf.value}`,
		);

		expect(response.statusCode).toBe(HttpStatus.OK);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				cpf: user.cpf.value,
			},
		});

		expect(userOnDatabase).not.toBeNull();
	});

	it("should return null if can't find a user with a given id", async () => {
		const invalidUserId = "invalid-id";
		const response = await request(app.getHttpServer()).get(
			`/api/users/${invalidUserId}`,
		);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				id: invalidUserId,
			},
		});

		expect(userOnDatabase).toBeNull();
		expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
	});

	it("should return null if can't find a user with a given cpf", async () => {
		const invalidUserCpf = "invalid-cpf";
		const response = await request(app.getHttpServer()).get(
			`/api/users?cpf=${invalidUserCpf}`,
		);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				cpf: invalidUserCpf,
			},
		});

		expect(userOnDatabase).toBeNull();
		expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
	});

	afterAll(async () => {
		await app.close();
	});
});
