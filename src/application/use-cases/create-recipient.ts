import { Injectable } from "@nestjs/common";
import { Recipient } from "@src/domain/entities/recipient";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { CreateRecipientInput } from "../dtos/create-recipient.dto";

@Injectable()
export class CreateRecipientUseCase {
	constructor(private readonly recipientRepository: RecipientRepository) {}

	async execute({
		name,
		city,
		number,
		state,
		street,
		zipCode,
		complement,
	}: CreateRecipientInput) {
		const recipient = Recipient.create({
			name,
			city,
			number,
			state,
			street,
			zipCode,
			complement: complement ?? null,
		});

		await this.recipientRepository.createRecipient(recipient);
	}
}
