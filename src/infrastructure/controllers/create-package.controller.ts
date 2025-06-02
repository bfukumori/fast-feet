import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreatePackageDto } from "@src/application/dtos/create-package.dto";
import { CreatePackageUseCase } from "@src/application/use-cases/create-package";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("packages")
export class CreatePackageController {
	constructor(private readonly createPackageUseCase: CreatePackageUseCase) {}

	@ApiOperation({ summary: "Create a new package" })
	@Post("new")
	async create(@Body() createPackageDto: CreatePackageDto): Promise<void> {
		await this.createPackageUseCase.execute(createPackageDto);
	}
}
