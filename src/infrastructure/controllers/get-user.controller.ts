import { Controller, Get, Param, Query } from "@nestjs/common";
import { GetUserDto } from "@src/application/dtos/get-user.dto";
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
	@ZodSerializerDto(GetUserDto)
	async getUserByCpf(@Query("cpf") cpf: string) {
		return await this.getUserByCpfUseCase.execute(cpf);
	}

	@Get("/:userId")
	@ZodSerializerDto(GetUserDto)
	async getUserById(@Param("userId") userId: string) {
		return await this.getUserByIdUseCase.execute(userId);
	}
}
