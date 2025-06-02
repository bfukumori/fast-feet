import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Put,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { UpdateRecipientDto } from "@src/application/dtos/update-recipient.dto";
import { UpdateRecipientUseCase } from "@src/application/use-cases/update-recipient";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("recipients")
export class UpdateRecipientController {
	constructor(
		private readonly updateRecipientUseCase: UpdateRecipientUseCase,
	) {}

	@Put("/:id/edit")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Update a recipient" })
	async update(
		@Param() { id }: IdQueryDto,
		@Body() updateRecipientDto: UpdateRecipientDto,
	): Promise<void> {
		await this.updateRecipientUseCase.execute(updateRecipientDto, id);
	}
}
