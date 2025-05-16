import { HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { ApplicationError } from "@src/shared/errors/application-error";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Injectable()
export class UpdateUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({ name, role }: UpdateUserDto, userId: string) {
		const existingUser = await this.userRepository.getUserById(userId);

		if (!existingUser) {
			throw new ApplicationError(
				`User with ID: "${userId}" not found.`,
				UpdateUserUseCase.name,
				HttpStatus.NOT_FOUND,
			);
		}

		if (name) {
			existingUser.updateName(name);
		}

		if (role) {
			existingUser.updateRole(role);
		}

		const user = User.create({
			id: existingUser.id.value,
			name: existingUser.name,
			cpf: existingUser.cpf.value,
			password: existingUser.password.value,
			role: existingUser.role,
		});

		await this.userRepository.updateUser(user);
	}
}
