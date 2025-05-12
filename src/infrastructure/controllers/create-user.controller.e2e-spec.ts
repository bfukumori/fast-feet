import { INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { CreateUserDto } from "@src/application/dtos/create-user.dto";
import { UserRole } from "@src/domain/enums/user-role.enum";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import request from "supertest";

describe("Create user [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
			providers: [],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		await app.listen(0);
	});

	it("[POST] Create user", async () => {
		const createUserDto: CreateUserDto = {
			name: "John Doe",
			cpf: "11649425066",
			password: "#Aa12345",
			role: UserRole.DELIVERY_MAN,
		};

		const response = await request(app.getHttpServer())
			.post("/api/users/create")
			.send(createUserDto);

		expect(response.statusCode).toBe(201);

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				cpf: createUserDto.cpf,
			},
		});

		expect(userOnDatabase).toBeTruthy();
	});

	afterAll(async () => {
		await app.close();
	});
});
