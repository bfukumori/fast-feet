import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateRecipientDto } from "@src/application/dtos/create-recipient.dto";
import { CreateRecipientUseCase } from "@src/application/use-cases/create-recipient";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("recipients")
export class CreateRecipientController {
	constructor(
		private readonly createRecipientUseCase: CreateRecipientUseCase,
	) {}

	@ApiOperation({ summary: "Create a new recipient" })
	@Post("new")
	async create(@Body() createRecipientDto: CreateRecipientDto): Promise<void> {
		await this.createRecipientUseCase.execute(createRecipientDto);
	}
}
