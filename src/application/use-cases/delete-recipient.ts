import { HttpStatus, Injectable } from "@nestjs/common";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class DeleteRecipientUseCase {
	constructor(private readonly recipientRepository: RecipientRepository) {}

	async execute(recipientId: string) {
		const existingRecipient =
			await this.recipientRepository.getRecipientById(recipientId);

		if (!existingRecipient) {
			throw new ApplicationError(
				`Recipient with ID: "${recipientId}" not found.`,
				DeleteRecipientUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}
		await this.recipientRepository.deleteRecipient(existingRecipient.id.value);
	}
}
