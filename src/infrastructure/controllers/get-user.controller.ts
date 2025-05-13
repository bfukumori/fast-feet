import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserDto } from "@src/application/dtos/user-dto";
import { GetUserByCpfUseCase } from "@src/application/use-cases/get-user-by-cpf";
import { GetUserByIdUseCase } from "@src/application/use-cases/get-user-by-id";
import { ZodSerializerDto } from "nestjs-zod";

@Controller("users")
export class GetUserController {
	constructor(
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly getUserByCpfUseCase: GetUserByCpfUseCase,
	) {}

	@Get()
	@ZodSerializerDto(UserDto)
	async getUserByCpf(@Query("cpf") cpf: string) {
		return await this.getUserByCpfUseCase.execute(cpf);
	}

	@Get("/:userId")
	@ZodSerializerDto(UserDto)
	async getUserById(@Param("userId") userId: string) {
		return await this.getUserByIdUseCase.execute(userId);
	}
}
