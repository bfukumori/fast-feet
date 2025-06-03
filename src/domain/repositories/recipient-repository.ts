import { GetRecipientDto } from "@src/application/dtos/get-recipient.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { Recipient } from "../entities/recipient";

export abstract class RecipientRepository {
	abstract getRecipientById(id: string): Promise<Recipient | null>;
	abstract createRecipient(recipient: Recipient): Promise<void>;
	abstract updateRecipient(recipient: Recipient): Promise<void>;
	abstract deleteRecipient(id: string): Promise<void>;
	abstract getAll(params?: PaginationQueryDto): Promise<{
		recipients: GetRecipientDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}>;
}
