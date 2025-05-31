import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { UserFactory } from "@test/factories/make-user-factory";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Delete user [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let userFactory: UserFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		userFactory = moduleRef.get(UserFactory);
		jwtService = moduleRef.get(JwtService);

		await app.listen(0);
	});

	test("[DELETE] Delete user", async () => {
		const user = await userFactory.makePrismaUser();

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.delete(`/api/users/${user.id.value}/delete`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				id: user.id.value,
			},
		});

		expect(userOnDatabase).toBeNull();
	});

	afterAll(async () => {
		await app.close();
	});
});
