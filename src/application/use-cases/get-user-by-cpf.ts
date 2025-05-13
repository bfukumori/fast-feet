import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { toResponse } from "@src/infrastructure/mappers/response-user-mapper";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class GetUserByCpfUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(cpf: string) {
		const user = await this.userRepository.getUserByCpf(cpf);

		if (!user) {
			throw new ApplicationError(
				`User with cpf: "${cpf}" not found.`,
				GetUserByCpfUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		return toResponse(user);
	}
}
