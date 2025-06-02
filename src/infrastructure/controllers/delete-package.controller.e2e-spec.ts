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

describe("Delete package [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	("");
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

	test("[DELETE] Delete package", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.value,
		};

		const pack = await packageFactory.makePrismaPackage(createPackageDto);

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.delete(`/api/packages/${pack.id.value}/delete`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: pack.id.value,
			},
		});

		expect(packageOnDatabase).toBeNull();
	});

	afterAll(async () => {
		await app.close();
	});
});
