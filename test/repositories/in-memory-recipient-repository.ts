import { Recipient } from "@src/domain/entities/recipient";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";

export class InMemoryRecipientRepository implements RecipientRepository {
	public recipients: Recipient[] = [];

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
