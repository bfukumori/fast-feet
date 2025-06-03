import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { UpdateRecipientDto } from "@src/application/dtos/update-recipient.dto";
import { DatabaseModule } from "@src/shared/database/database.module";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { RecipientFactory } from "@test/factories/make-recipient-factory";
import { Role } from "generated/prisma";
import request from "supertest";

describe("Update recipient [e2e]", () => {
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

	test("[PUT] Update recipient complement to null if empty", async () => {
		const recipient = await recipientFactory.makePrismaRecipient({
			complement: undefined,
		});

		const updateRecipientDto: UpdateRecipientDto = {
			complement: "",
		};

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.put(`/api/recipients/${recipient.id.value}/edit`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send(updateRecipientDto);

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const recipientOnDatabase = await prismaService.recipient.findFirst({
			where: {
				id: recipient.id.value,
			},
		});

		expect(recipientOnDatabase).toBeTruthy();

		expect(recipientOnDatabase?.complement).toBeNull();
	});

	test("[PUT] Update recipient complement", async () => {
		const recipient = await recipientFactory.makePrismaRecipient();

		const updateRecipientDto: UpdateRecipientDto = {
			complement: "Updated Complement",
		};

		const accessToken = jwtService.sign({ sub: "", role: Role.ADMIN });

		const response = await request(app.getHttpServer())
			.put(`/api/recipients/${recipient.id.value}/edit`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send(updateRecipientDto);

		expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

		const recipientOnDatabase = await prismaService.recipient.findFirst({
			where: {
				id: recipient.id.value,
			},
		});

		expect(recipientOnDatabase).toBeTruthy();

		expect(recipientOnDatabase?.complement).toStrictEqual(
			updateRecipientDto.complement,
		);
	});

	afterAll(async () => {
		await app.close();
	});
});
