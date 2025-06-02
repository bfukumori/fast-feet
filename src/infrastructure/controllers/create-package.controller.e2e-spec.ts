import { fakerPT_BR as faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { CreatePackageDto } from "@src/application/dtos/create-package.dto";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { RecipientFactory } from "@test/factories/make-recipient-factory";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Create package [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
	let recipientFactory: RecipientFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [RecipientFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		jwtService = moduleRef.get(JwtService);
		recipientFactory = moduleRef.get(RecipientFactory);

		await app.listen(0);
	});

	test("[POST] Create package", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.toString(),
		};

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.post("/api/packages/new")
			.set("Authorization", `Bearer ${accessToken}`)
			.send(createPackageDto);

		expect(response.statusCode).toBe(HttpStatus.CREATED);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				recipientId: createPackageDto.recipientId,
			},
		});

		expect(packageOnDatabase).toBeTruthy();
		expect(packageOnDatabase).toMatchObject(createPackageDto);
	});

	afterAll(async () => {
		await app.close();
	});
});
