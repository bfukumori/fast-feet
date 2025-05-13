import { HttpStatus, INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { UpdateUserDto } from "@src/application/dtos/update-user.dto";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { UserFactory } from "@test/factories/make-user-factory";
import request from "supertest";

describe("Update user [e2e]", () => {
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

	test("[PUT] Update user", async () => {
		const user = await userFactory.makePrismaUser();

		const updateUserDto: UpdateUserDto = {
			name: "updated name",
		};

		const response = await request(app.getHttpServer())
			.put(`/api/users/${user.id.value}/edit`)
			.send(updateUserDto);

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				id: user.id.value,
			},
		});

		expect(userOnDatabase).toBeTruthy();

		expect(userOnDatabase).toStrictEqual({
			id: user.id.value,
			name: updateUserDto.name,
			cpf: user.cpf.value,
			password: user.password.value,
			role: user.role,
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
