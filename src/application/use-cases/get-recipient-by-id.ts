import { HttpStatus, Injectable } from "@nestjs/common";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { toResponse } from "@src/infrastructure/mappers/response-recipient-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class GetRecipientByIdUseCase {
	constructor(private readonly recipientRepository: RecipientRepository) {}

	async execute(id: string) {
		const recipient = await this.recipientRepository.getRecipientById(id);

		if (!recipient) {
			throw new ApplicationError(
				`Recipient with ID: "${id}" not found.`,
				GetRecipientByIdUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		return toResponse(recipient);
	}
}
