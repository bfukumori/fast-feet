import { Injectable } from "@nestjs/common";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";

@Injectable()
export class GetAllRecipientsUseCase {
	constructor(private readonly recipientRepository: RecipientRepository) {}

	async execute(params?: PaginationQueryDto) {
		const { recipients, currentPage, totalCount, totalPages } =
			await this.recipientRepository.getAll(params);

		return {
			recipients,
			currentPage,
			totalCount,
			totalPages,
		};
	}
}
