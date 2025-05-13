import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { DeleteUserUseCase } from "@src/application/use-cases/delete-user";

@Controller("users")
export class DeleteUserController {
	constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

	@Delete("/:userId/delete")
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param("userId") userId: string): Promise<void> {
		await this.deleteUserUseCase.execute(userId);
	}
}
