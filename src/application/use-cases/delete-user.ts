import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { ApplicationError } from "@src/shared/errors/application-error";

@Injectable()
export class DeleteUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userId: string) {
		const existingUser = await this.userRepository.getUserById(userId);

		if (!existingUser) {
			throw new ApplicationError(
				`User with ID: "${userId}" not found.`,
				DeleteUserUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}
		await this.userRepository.deleteUser(existingUser.id.value);
	}
}
