import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteUserUseCase } from "@src/application/use-cases/delete-user";

@Controller("users")
export class DeleteUserController {
	constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

	@Delete("/:userId/delete")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Delete a user" })
	async delete(@Param("userId") userId: string): Promise<void> {
		await this.deleteUserUseCase.execute(userId);
	}
}
