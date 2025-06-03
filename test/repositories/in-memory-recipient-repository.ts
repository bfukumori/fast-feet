import { GetRecipientDto } from "@src/application/dtos/get-recipient.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { Recipient } from "@src/domain/entities/recipient";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { toResponse } from "@src/infrastructure/mappers/response-recipient-mapper";

export class InMemoryRecipientRepository implements RecipientRepository {
	public recipients: Recipient[] = [];

	async getAll(param: PaginationQueryDto): Promise<{
		recipients: GetRecipientDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}> {
		const totalCount = this.recipients.length;

		const { limit, page } = param || { limit: 10, page: 1 };
		const skip = (page - 1) * limit;

		return {
			recipients: this.recipients.slice(skip, skip + limit).map(toResponse),
			totalPages: Math.ceil(totalCount / limit),
			totalCount,
			currentPage: page,
		};
	}

	async createRecipient(recipient: Recipient) {
		this.recipients.push(recipient);
	}

	async getRecipientById(id: string) {
		const recipient = this.recipients.find(
			(recipient) => recipient.id.value === id,
		);

		if (!recipient) return null;

		return recipient;
	}

	async updateRecipient(recipient: Recipient): Promise<void> {
		const recipientIndex = this.recipients.findIndex(
			(u) => u.id === recipient.id,
		);

		this.recipients[recipientIndex] = recipient;
	}

	async deleteRecipient(id: string): Promise<void> {
		const recipientIndex = this.recipients.findIndex(
			(recipient) => recipient.id.value === id,
		);

		this.recipients.splice(recipientIndex, 1);
	}
}
