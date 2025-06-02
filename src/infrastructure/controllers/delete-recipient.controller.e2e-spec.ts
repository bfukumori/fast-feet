import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { RecipientFactory } from "@test/factories/make-recipient-factory";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Delete recipient [e2e]", () => {
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

	test("[DELETE] Delete recipient", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.delete(`/api/recipients/${recipient.id.value}/delete`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const recipientOnDatabase = await prismaService.recipient.findFirst({
			where: {
				id: recipient.id.value,
			},
		});

		expect(recipientOnDatabase).toBeNull();
	});

	afterAll(async () => {
		await app.close();
	});
});
