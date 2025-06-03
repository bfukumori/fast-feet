import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CpfQueryDto } from "@src/application/dtos/cpf-query.dto";
import { GetAllUsersDto } from "@src/application/dtos/get-all-users.dto";
import { GetUserDto } from "@src/application/dtos/get-user.dto";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { GetAllUsersUseCase } from "@src/application/use-cases/get-all-users";
import { GetUserByCpfUseCase } from "@src/application/use-cases/get-user-by-cpf";
import { GetUserByIdUseCase } from "@src/application/use-cases/get-user-by-id";
import { Role } from "generated/prisma";
import { ZodSerializerDto } from "nestjs-zod";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("users")
export class GetUserController {
	constructor(
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly getUserByCpfUseCase: GetUserByCpfUseCase,
		private readonly getAllUsersUseCase: GetAllUsersUseCase,
	) {}

	@Get()
	@ZodSerializerDto(GetAllUsersDto)
	@ApiOperation({ summary: "List all users" })
	async getAll(@Query() params?: PaginationQueryDto) {
		return await this.getAllUsersUseCase.execute(params);
	}

	@Get("/search-by-cpf")
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
