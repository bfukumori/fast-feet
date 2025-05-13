import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "@src/application/dtos/create-user.dto";
import { CreateUserUseCase } from "@src/application/use-cases/create-user";

@Controller("users")
export class CreateUserController {
	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	@Post("new")
	async create(@Body() createUserDto: CreateUserDto): Promise<void> {
		await this.createUserUseCase.execute(createUserDto);
	}
}
