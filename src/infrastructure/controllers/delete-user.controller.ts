import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { DeleteUserUseCase } from "@src/application/use-cases/delete-user";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("users")
export class DeleteUserController {
	constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

	@Delete("/:id/delete")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Delete a user" })
	async delete(@Param() { id }: IdQueryDto): Promise<void> {
		await this.deleteUserUseCase.execute(id);
	}
}
