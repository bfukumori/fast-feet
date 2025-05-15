import { Recipient } from "../entities/recipient";

export abstract class RecipientRepository {
	abstract getRecipientById(id: string): Promise<Recipient | null>;
	abstract createRecipient(recipient: Recipient): Promise<void>;
	abstract updateRecipient(recipient: Recipient): Promise<void>;
	abstract deleteRecipient(id: string): Promise<void>;
}
