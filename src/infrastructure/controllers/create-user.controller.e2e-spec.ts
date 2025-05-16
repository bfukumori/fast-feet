import { HttpStatus, INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { CreateUserDto } from "@src/application/dtos/create-user.dto";
import { Hasher } from "@src/application/services/cryptography/hasher";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Create user [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;

	const mockHasher = {
		hash: vi.fn().mockResolvedValue("hashed-password"),
	};

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(Hasher)
			.useValue(mockHasher)
			.compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);

		await app.listen(0);
	});

	test("[POST] Create user", async () => {
		const createUserDto: CreateUserDto = {
			name: "John Doe",
			cpf: "11649425066",
			password: "#Aa12345",
			role: Role.DELIVERY_MAN,
		};

		const response = await request(app.getHttpServer())
			.post("/api/users/new")
			.send(createUserDto);

		expect(response.statusCode).toBe(HttpStatus.CREATED);
		expect(mockHasher.hash).toHaveBeenCalledWith("#Aa12345");

		const userOnDatabase = await prismaService.user.findFirst({
			where: {
				cpf: createUserDto.cpf,
			},
		});

		expect(userOnDatabase).toBeTruthy();
		expect(userOnDatabase).toMatchObject({
			...createUserDto,
			password: "hashed-password",
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
