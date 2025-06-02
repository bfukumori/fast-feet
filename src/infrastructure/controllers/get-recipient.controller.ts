import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { GetRecipientDto } from "@src/application/dtos/get-recipient.dto";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";
import { GetRecipientByIdUseCase } from "@src/application/use-cases/get-recipient-by-id";
import { Role } from "generated/prisma";
import { ZodSerializerDto } from "nestjs-zod";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("recipients")
export class GetRecipientController {
	constructor(
		private readonly getRecipientByIdUseCase: GetRecipientByIdUseCase,
	) {}

	@Get("/:id")
	@ZodSerializerDto(GetRecipientDto)
	@ApiOperation({ summary: "Find a recipient by id" })
	async getRecipientById(@Param() { id }: IdQueryDto) {
		return await this.getRecipientByIdUseCase.execute(id);
	}
}
