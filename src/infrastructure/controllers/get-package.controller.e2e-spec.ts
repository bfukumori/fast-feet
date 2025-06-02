import { randomUUID } from "node:crypto";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { CreatePackageDto } from "@src/application/dtos/create-package.dto";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { PackageFactory } from "@test/factories/make-package-factory";
import { RecipientFactory } from "@test/factories/make-recipient-factory";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Get package [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let packageFactory: PackageFactory;
	let recipientFactory: RecipientFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [PackageFactory, RecipientFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		packageFactory = moduleRef.get(PackageFactory);
		recipientFactory = moduleRef.get(RecipientFactory);
		jwtService = moduleRef.get(JwtService);

		await app.listen(0);
	});

	beforeEach(async () => {
		await prismaService.package.deleteMany();
	});

	test("[GET] Get package by its id", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.value,
		};
		const pack = await packageFactory.makePrismaPackage(createPackageDto);

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.get(`/api/packages/${pack.id.value}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(HttpStatus.OK);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: pack.id.value,
			},
		});

		expect(packageOnDatabase).not.toBeNull();
	});

	it("should return null if can't find a package with a given id", async () => {
		const invalidPackageId = randomUUID();

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.get(`/api/packages/${invalidPackageId}`)
			.set("Authorization", `Bearer ${accessToken}`);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: invalidPackageId,
			},
		});

		expect(packageOnDatabase).toBeNull();
		expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
	});

	afterAll(async () => {
		await app.close();
	});
});
