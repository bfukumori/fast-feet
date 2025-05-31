import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { ApplicationError } from "@src/shared/errors/application-error";
import { SignInDto } from "../dtos/sign-in.dto";
import { Hasher } from "../services/cryptography/hasher";

@Injectable()
export class SignInUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
		private readonly jwtService: JwtService,
	) {}

	async execute({ cpf, password }: SignInDto) {
		const user = await this.userRepository.getUserByCpf(cpf);

		if (!user) {
			throw new ApplicationError(
				"Invalid credentials.",
				SignInUseCase.name,
				HttpStatus.UNAUTHORIZED,
			);
		}

		const passwordsMatches = await this.hasher.compare(
			password,
			user.password.value,
		);

		if (!passwordsMatches) {
			throw new ApplicationError(
				"Invalid credentials.",
				SignInUseCase.name,
				HttpStatus.UNAUTHORIZED,
			);
		}

		const payload = { sub: user.id, role: user.role };

		const accessToken = await this.jwtService.signAsync(payload);

		return {
			accessToken,
		};
	}
}
