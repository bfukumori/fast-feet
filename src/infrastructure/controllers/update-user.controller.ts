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
import { UpdateUserDto } from "@src/application/dtos/update-user.dto";
import { UpdateUserUseCase } from "@src/application/use-cases/update-user";

@Controller("users")
export class UpdateUserController {
	constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

	@Put("/:id/edit")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Update a user name or role" })
	async update(
		@Param() { id }: IdQueryDto,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<void> {
		await this.updateUserUseCase.execute(updateUserDto, id);
	}
}
