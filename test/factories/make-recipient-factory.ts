import { fakerPT_BR as faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { Recipient, RecipientProps } from "@src/domain/entities/recipient";
import { toPersistence } from "@src/infrastructure/mappers/prisma-recipient-mapper";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";

export function makeRecipient(override?: Partial<RecipientProps>): Recipient {
	const recipent = Recipient.create({
		name: faker.person.fullName(),
		street: faker.location.streetAddress(),
		number: faker.location.buildingNumber(),
		complement: faker.location.secondaryAddress(),
		state: faker.location.state({ abbreviated: true }),
		city: faker.location.city(),
		zipCode: faker.location.zipCode("########"),
		...override,
	});

	return recipent;
}

@Injectable()
export class RecipientFactory {
	constructor(private readonly prismaService: PrismaService) {}

	async makePrismaRecipient(
		data?: Partial<RecipientProps>,
	): Promise<Recipient> {
		const recipent = makeRecipient(data);

		await this.prismaService.recipient.create({
			data: toPersistence(recipent),
		});

		return recipent;
	}
}
