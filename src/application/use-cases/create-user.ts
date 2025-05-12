import { HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@src/domain/entities/user";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { Password } from "@src/domain/value-objects/password";
import { ApplicationError } from "@src/shared/errors/application-error";
import { CreateUserInput } from "../dtos/create-user.dto";
import { Hasher } from "../services/cryptography/hasher";

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	async execute({ cpf, name, password, role }: CreateUserInput) {
		const userWithSameCpf = await this.userRepository.getUserByCpf(cpf);

		if (userWithSameCpf) {
			throw new ApplicationError(
				"User already exists.",
				CreateUserUseCase.name,
				HttpStatus.CONFLICT,
			);
		}

		const rawPassword = Password.createFromPlain(password);
		const hashedPassword = await this.hasher.hash(rawPassword);

		const user = User.create({
			name,
			cpf,
			password: hashedPassword,
			role,
		});

		await this.userRepository.createUser(user);
	}
}
