import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { DeletePackageUseCase } from "@src/application/use-cases/delete-package";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("packages")
export class DeletePackageController {
	constructor(private readonly deletePackageUseCase: DeletePackageUseCase) {}

	@Delete("/:id/delete")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Delete a package" })
	async delete(@Param() { id }: IdQueryDto): Promise<void> {
		await this.deletePackageUseCase.execute(id);
	}
}
