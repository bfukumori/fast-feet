import { Recipient } from "@src/domain/entities/recipient";
import { Recipient as PrismaRecipient } from "generated/prisma";

export function toPersistence(recipient: Recipient): PrismaRecipient {
	return {
		id: recipient.id.value,
		name: recipient.name,
		street: recipient.street,
		number: recipient.number,
		complement: recipient.complement ?? null,
		city: recipient.city,
		state: recipient.state,
		zipCode: recipient.zipCode,
	};
}

export function toDomain(recipient: PrismaRecipient): Recipient {
	return Recipient.create({
		id: recipient.id,
		name: recipient.name,
		street: recipient.street,
		number: recipient.number,
		complement: recipient.complement,
		city: recipient.city,
		state: recipient.state,
		zipCode: recipient.zipCode,
	});
}
