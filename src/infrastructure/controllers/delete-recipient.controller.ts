import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { DeleteRecipientUseCase } from "@src/application/use-cases/delete-recipient";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("recipients")
export class DeleteRecipientController {
	constructor(
		private readonly deleteRecipientUseCase: DeleteRecipientUseCase,
	) {}

	@Delete("/:id/delete")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Delete a recipient" })
	async delete(@Param() { id }: IdQueryDto): Promise<void> {
		await this.deleteRecipientUseCase.execute(id);
	}
}
