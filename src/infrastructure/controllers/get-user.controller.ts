import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CpfQueryDto } from "@src/application/dtos/cpf-query.dto";
import { GetUserDto } from "@src/application/dtos/get-user.dto";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
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
	@ApiOperation({ summary: "Find a user by cpf" })
	async getUserByCpf(@Query() { cpf }: CpfQueryDto) {
		return await this.getUserByCpfUseCase.execute(cpf);
	}

	@Get("/:id")
	@ZodSerializerDto(GetUserDto)
	@ApiOperation({ summary: "Find a user by id" })
	async getUserById(@Param() { id }: IdQueryDto) {
		return await this.getUserByIdUseCase.execute(id);
	}
}
