import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const recipientId = faker.string.uuid();
	const packageId = faker.string.uuid();
	const packageStatusNotificationId = faker.string.uuid();

	await Promise.all([
		prisma.user.upsert({
			where: {
				cpf: "12345678900",
			},
			update: {},
			create: {
				name: faker.person.fullName(),
				cpf: "12345678900",
				password:
					"$2a$10$aVn/n8JQ0A9nFqmgOCUO8.k16fYv8o14PK1qYgJUZmf9Ol78PBsiy",
				role: "ADMIN",
			},
		}),
		prisma.user.upsert({
			where: {
				cpf: "00987654321",
			},
			update: {},
			create: {
				name: faker.person.fullName(),
				cpf: "00987654321",
				password:
					"$2a$10$aVn/n8JQ0A9nFqmgOCUO8.k16fYv8o14PK1qYgJUZmf9Ol78PBsiy",
			},
		}),
		prisma.recipient.upsert({
			where: {
				id: recipientId,
			},
			update: {},
			create: {
				id: recipientId,
				name: faker.person.fullName(),
				street: faker.location.street(),
				number: faker.location.buildingNumber(),
				city: faker.location.city(),
				state: faker.location.state(),
				zipCode: faker.location.zipCode(),
				complement: faker.location.secondaryAddress(),
				packages: {
					create: {
						id: packageId,
						description: faker.lorem.sentence(),
						packageStatusNotification: {
							create: {
								id: packageStatusNotificationId,
								status: "PENDING",
							},
						},
					},
				},
			},
		}),
	]);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
