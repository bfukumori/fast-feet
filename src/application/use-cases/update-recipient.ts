import { HttpStatus, Injectable } from "@nestjs/common";
import { Recipient } from "@src/domain/entities/recipient";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { ApplicationError } from "@src/shared/errors/application-error";
import { UpdateRecipientDto } from "../dtos/update-recipient.dto";

@Injectable()
export class UpdateRecipientUseCase {
	constructor(private readonly recipientRepository: RecipientRepository) {}

	async execute({ complement }: UpdateRecipientDto, recipientId: string) {
		const existingRecipient =
			await this.recipientRepository.getRecipientById(recipientId);

		if (!existingRecipient) {
			throw new ApplicationError(
				`Recipient with ID: "${recipientId}" not found.`,
				UpdateRecipientUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		if (complement) {
			existingRecipient.updateComplement(complement);
		}

		const recipient = Recipient.create({
			id: existingRecipient.id.value,
			name: existingRecipient.name,
			street: existingRecipient.street,
			number: existingRecipient.number,
			state: existingRecipient.state,
			city: existingRecipient.city,
			zipCode: existingRecipient.zipCode,
			complement: existingRecipient.complement,
		});

		await this.recipientRepository.updateRecipient(recipient);
	}
}
