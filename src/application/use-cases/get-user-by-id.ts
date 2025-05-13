import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { toResponse } from "@src/infrastructure/mappers/response-user-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class GetUserByIdUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userId: string) {
		const user = await this.userRepository.getUserById(userId);

		if (!user) {
			throw new ApplicationError(
				`User with ID: "${userId}" not found.`,
				GetUserByIdUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		return toResponse(user);
	}
}
