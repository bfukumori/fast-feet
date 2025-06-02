import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Put,
	Req,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { IdQueryDto } from "@src/application/dtos/id-query.dto";

import { ReqUserDto } from "@src/application/dtos/req-user.dto";
import { UpdateToDeliveredDto } from "@src/application/dtos/update-to-delivered.dto";
import { UpdateToPickedUpDto } from "@src/application/dtos/update-to-picked-up.dto";
import { UpdateToAwaitingPickUpUseCase } from "@src/application/use-cases/update-package-to-awating-pick-up";
import { UpdateToDeliveredUseCase } from "@src/application/use-cases/update-package-to-delivered";
import { UpdateToPickedUpUseCase } from "@src/application/use-cases/update-package-to-picked-up";
import { UpdateToReturnedUseCase } from "@src/application/use-cases/update-package-to-returned";
import { Role } from "generated/prisma";
import { Roles } from "../decorators/roles.decorator";

@Roles(Role.ADMIN)
@Controller("packages")
export class UpdatePackageController {
	constructor(
		private readonly updateToAwaitingPickUpUseCase: UpdateToAwaitingPickUpUseCase,
		private readonly updateToPickedUpUseCase: UpdateToPickedUpUseCase,
		private readonly updateToReturnedUseCase: UpdateToReturnedUseCase,
		private readonly updateToDeliveredUseCase: UpdateToDeliveredUseCase,
	) {}

	@Patch("/:id/to-awaiting")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Update a package to awaiting status" })
	async updateToAwating(@Param() { id }: IdQueryDto): Promise<void> {
		await this.updateToAwaitingPickUpUseCase.execute(id);
	}

	@Put("/:id/to-delivered")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Update a package to delivered status" })
	async updateToDelivered(
		@Req() { user }: ReqUserDto,
		@Param() { id }: IdQueryDto,
		@Body() { photoProofUrl }: UpdateToDeliveredDto,
	): Promise<void> {
		await this.updateToDeliveredUseCase.execute(id, photoProofUrl, user.sub);
	}

	@Put("/:id/to-picked")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Update a package to picked up status" })
	async updateToPickedUpd(
		@Param() { id }: IdQueryDto,
		@Body() { deliveryManId }: UpdateToPickedUpDto,
	): Promise<void> {
		await this.updateToPickedUpUseCase.execute(id, deliveryManId);
	}

	@Patch("/:id/to-return")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Update a package to returned status" })
	async updateToReturned(@Param() { id }: IdQueryDto): Promise<void> {
		await this.updateToReturnedUseCase.execute(id);
	}
}
