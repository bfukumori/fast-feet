import { fakerPT_BR as faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { CreateRecipientDto } from "@src/application/dtos/create-recipient.dto";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Create recipient [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		jwtService = moduleRef.get(JwtService);

		await app.listen(0);
	});

	test("[POST] Create recipient", async () => {
		const createRecipientDto: CreateRecipientDto = {
			name: faker.person.fullName(),
			state: faker.location.state({ abbreviated: true }),
			city: faker.location.city(),
			number: faker.location.buildingNumber(),
			street: faker.location.streetAddress(),
			zipCode: faker.location.zipCode({ format: "########" }),
			complement: faker.location.secondaryAddress(),
		};

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.post("/api/recipients/new")
			.set("Authorization", `Bearer ${accessToken}`)
			.send(createRecipientDto);

		expect(response.statusCode).toBe(HttpStatus.CREATED);

		const recipientOnDatabase = await prismaService.recipient.findFirst({
			where: {
				zipCode: createRecipientDto.zipCode,
			},
		});

		expect(recipientOnDatabase).toBeTruthy();
		expect(recipientOnDatabase).toMatchObject(createRecipientDto);
	});

	afterAll(async () => {
		await app.close();
	});
});
