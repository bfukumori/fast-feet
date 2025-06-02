import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { GetPackageDto } from "@src/application/dtos/get-package.dto";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { GetPackageByIdUseCase } from "@src/application/use-cases/get-package-by-id";
import { Role } from "generated/prisma";
import { ZodSerializerDto } from "nestjs-zod";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("packages")
export class GetPackageController {
	constructor(private readonly getPackageByIdUseCase: GetPackageByIdUseCase) {}

	@Get("/:id")
	@ZodSerializerDto(GetPackageDto)
	@ApiOperation({ summary: "Find a package by id" })
	async getPackageById(@Param() { id }: IdQueryDto) {
		return await this.getPackageByIdUseCase.execute(id);
	}
}
