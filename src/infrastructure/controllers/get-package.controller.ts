import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { GetAllPackagesDto } from "@src/application/dtos/get-all-packages.dto";
import { GetPackageDto } from "@src/application/dtos/get-package.dto";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { GetAllPackagesUseCase } from "@src/application/use-cases/get-all-packages";
import { GetPackageByIdUseCase } from "@src/application/use-cases/get-package-by-id";
import { Role } from "generated/prisma";
import { ZodSerializerDto } from "nestjs-zod";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("packages")
export class GetPackageController {
	constructor(
		private readonly getPackageByIdUseCase: GetPackageByIdUseCase,
		private readonly getAllPackagesUseCase: GetAllPackagesUseCase,
	) {}

	@Get()
	@ZodSerializerDto(GetAllPackagesDto)
	@ApiOperation({ summary: "List all packages" })
	async getAll(@Query() params?: PaginationQueryDto) {
		return await this.getAllPackagesUseCase.execute(params);
	}

	@Get("/:id")
	@ZodSerializerDto(GetPackageDto)
	@ApiOperation({ summary: "Find a package by id" })
	async getPackageById(@Param() { id }: IdQueryDto) {
		return await this.getPackageByIdUseCase.execute(id);
	}
}
