import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaClient } from "generated/prisma";

const prisma = new PrismaClient();

async function main() {
	const recipientId = faker.string.uuid();
	const packageId = faker.string.uuid();
	const packageStatusNotificationId = faker.string.uuid();

	await Promise.all([
		prisma.user.upsert({
			where: {
				cpf: "68720915098",
			},
			update: {},
			create: {
				name: faker.person.fullName(),
				cpf: "68720915098",
				password:
					"$2y$10$dNPhHTsoLUHybaFCmb6oC.Ffi0oWFR1dG28LIFlqVNu8O5s/RiYJa",
				role: "ADMIN",
			},
		}),
		prisma.user.upsert({
			where: {
				cpf: "35995158082",
			},
			update: {},
			create: {
				name: faker.person.fullName(),
				cpf: "35995158082",
				password:
					"$2y$10$dNPhHTsoLUHybaFCmb6oC.Ffi0oWFR1dG28LIFlqVNu8O5s/RiYJa",
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
								status: "AWAITING_PICKUP",
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
