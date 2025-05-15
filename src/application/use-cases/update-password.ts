import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { ApplicationError } from "@src/shared/errors/application-error";
import { UpdatePasswordInput } from "../dtos/update-password.dto";

@Injectable()
export class UpdatePasswordUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({ password }: UpdatePasswordInput, userId: string) {
		const existingUser = await this.userRepository.getUserById(userId);

		if (!existingUser) {
			throw new ApplicationError(
				`User with ID: "${userId}" not found.`,
				UpdatePasswordUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		existingUser.changePassword(password);

		await this.userRepository.updateUser(existingUser);
	}
}
