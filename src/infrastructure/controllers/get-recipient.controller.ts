import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { GetAllRecipientsDto } from "@src/application/dtos/get-all-recipients.dto";
import { GetRecipientDto } from "@src/application/dtos/get-recipient.dto";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { GetAllRecipientsUseCase } from "@src/application/use-cases/get-all-recipients";
import { GetRecipientByIdUseCase } from "@src/application/use-cases/get-recipient-by-id";
import { Role } from "generated/prisma";
import { ZodSerializerDto } from "nestjs-zod";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("recipients")
export class GetRecipientController {
	constructor(
		private readonly getAllRecipientsUseCase: GetAllRecipientsUseCase,
		private readonly getRecipientByIdUseCase: GetRecipientByIdUseCase,
	) {}

	@Get()
	@ZodSerializerDto(GetAllRecipientsDto)
	@ApiOperation({ summary: "List all recipients" })
	async getAll(@Query() params?: PaginationQueryDto) {
		return await this.getAllRecipientsUseCase.execute(params);
	}

	@Get("/:id")
	@ZodSerializerDto(GetRecipientDto)
	@ApiOperation({ summary: "Find a recipient by id" })
	async getRecipientById(@Param() { id }: IdQueryDto) {
		return await this.getRecipientByIdUseCase.execute(id);
	}
}
