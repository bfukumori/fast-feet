import { GetRecipientDto } from "@src/application/dtos/get-recipient.dto";
import { Recipient } from "@src/domain/entities/recipient";

export function toResponse(recipient: Recipient): GetRecipientDto {
	return {
		id: recipient.id.value,
		name: recipient.name,
		street: recipient.street,
		number: recipient.number,
		complement: recipient.complement,
		city: recipient.city,
		state: recipient.state,
		zipCode: recipient.zipCode,
	};
}
