import { Injectable } from "@nestjs/common";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";

@Injectable()
export class GetAllUsersUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(params?: PaginationQueryDto) {
		const { users, currentPage, totalCount, totalPages } =
			await this.userRepository.getAll(params);

		return {
			users,
			currentPage,
			totalCount,
			totalPages,
		};
	}
}
