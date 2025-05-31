import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateUserDto } from "@src/application/dtos/create-user.dto";
import { CreateUserUseCase } from "@src/application/use-cases/create-user";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("users")
export class CreateUserController {
	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	@ApiOperation({ summary: "Create a new user" })
	@Post("new")
	async create(@Body() createUserDto: CreateUserDto): Promise<void> {
		await this.createUserUseCase.execute(createUserDto);
	}
}
