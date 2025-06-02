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
import { UserFactory } from "@test/factories/make-user-factory";
import { PackageStatus, Role } from "generated/prisma";
import request from "supertest";

describe("Update package [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let packageFactory: PackageFactory;
	let recipientFactory: RecipientFactory;
	let userFactory: UserFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [PackageFactory, RecipientFactory, UserFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		jwtService = moduleRef.get(JwtService);
		packageFactory = moduleRef.get(PackageFactory);
		recipientFactory = moduleRef.get(RecipientFactory);
		userFactory = moduleRef.get(UserFactory);

		await app.listen(0);
	});

	test("[PATCH] Update package to awaiting", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.value,
		};

		const pack = await packageFactory.makePrismaPackage({
			...createPackageDto,
			status: PackageStatus.RETURNED,
		});

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.patch(`/api/packages/${pack.id.value}/to-awaiting`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: pack.id.value,
			},
		});

		expect(packageOnDatabase).toBeTruthy();

		expect(packageOnDatabase).toMatchObject({
			status: PackageStatus.AWAITING_PICKUP,
		});
	});

	test("[PUT] Update package to delivered", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.value,
		};

		const pack = await packageFactory.makePrismaPackage({
			...createPackageDto,
			status: PackageStatus.PICKED_UP,
		});

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.put(`/api/packages/${pack.id.value}/to-delivered`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				photoProofUrl: "http://www.photo-url.com",
			});

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: pack.id.value,
			},
		});

		expect(packageOnDatabase).toBeTruthy();

		expect(packageOnDatabase).toMatchObject({
			deliveredPhotoUrl: "http://www.photo-url.com",
			status: PackageStatus.DELIVERED,
		});
	});

	test("[PUT] Update package to picked up", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();
		const user = await userFactory.makePrismaUser();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.value,
		};

		const pack = await packageFactory.makePrismaPackage({
			...createPackageDto,
			status: PackageStatus.AWAITING_PICKUP,
		});

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.put(`/api/packages/${pack.id.value}/to-picked`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				deliveryManId: user.id.value,
			});

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: pack.id.value,
			},
		});

		expect(packageOnDatabase).toBeTruthy();

		expect(packageOnDatabase).toMatchObject({
			deliveryManId: user.id.value,
			status: PackageStatus.PICKED_UP,
		});
	});

	test("[PATCH] Update package to returned", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const createPackageDto: CreatePackageDto = {
			description: faker.commerce.productDescription(),
			recipientId: recipient.id.value,
		};

		const pack = await packageFactory.makePrismaPackage({
			...createPackageDto,
			status: PackageStatus.PICKED_UP,
		});

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.patch(`/api/packages/${pack.id.value}/to-return`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const packageOnDatabase = await prismaService.package.findFirst({
			where: {
				id: pack.id.value,
			},
		});

		expect(packageOnDatabase).toBeTruthy();

		expect(packageOnDatabase).toMatchObject({
			status: PackageStatus.RETURNED,
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
