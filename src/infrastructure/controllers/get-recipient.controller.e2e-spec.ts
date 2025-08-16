import { randomUUID } from "node:crypto";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import {
	makeRecipient,
	RecipientFactory,
} from "@test/factories/make-recipient-factory";
import { Role } from "generated/prisma";
import request from "supertest";
import { toPersistence } from "../mappers/prisma-recipient-mapper";

describe("Get recipient [e2e]", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let recipientFactory: RecipientFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [RecipientFactory],
		}).compile();

		app = moduleRef.createNestApplication(new FastifyAdapter());
		app.setGlobalPrefix("api");

		prismaService = moduleRef.get(PrismaService);
		recipientFactory = moduleRef.get(RecipientFactory);
		jwtService = moduleRef.get(JwtService);

		await app.listen(0);
	});

	beforeEach(async () => {
		await prismaService.recipient.deleteMany();
	});

	test("[GET] List recipients", async () => {
		const recipient1 = makeRecipient();
		const recipient2 = makeRecipient();
		await prismaService.recipient.createMany({
			data: [toPersistence(recipient1), toPersistence(recipient2)],
		});

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.get("/api/recipients")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(HttpStatus.OK);

		const recipientsOnDatabase = await prismaService.recipient.findMany();

		expect(recipientsOnDatabase).toHaveLength(2);
	});

	test("[GET] Get recipient by its id", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.get(`/api/recipients/${recipient.id.value}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(HttpStatus.OK);

		const recipientOnDatabase = await prismaService.recipient.findFirst({
			where: {
				id: recipient.id.value,
			},
		});

		expect(recipientOnDatabase).not.toBeNull();
	});

	it("should return null if can't find a recipient with a given id", async () => {
		const invalidRecipientId = randomUUID();

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.get(`/api/recipients/${invalidRecipientId}`)
			.set("Authorization", `Bearer ${accessToken}`);

		const recipientOnDatabase = await prismaService.recipient.findFirst({
			where: {
				id: invalidRecipientId,
			},
		});

		expect(recipientOnDatabase).toBeNull();
		expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
	});

	afterAll(async () => {
		await app.close();
	});
});
