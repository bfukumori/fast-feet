import { Module } from "@nestjs/common";
import { CreateRecipientUseCase } from "@src/application/use-cases/create-recipient";
import { DeleteRecipientUseCase } from "@src/application/use-cases/delete-recipient";
import { GetAllRecipientsUseCase } from "@src/application/use-cases/get-all-recipients";
import { GetRecipientByIdUseCase } from "@src/application/use-cases/get-recipient-by-id";
import { UpdateRecipientUseCase } from "@src/application/use-cases/update-recipient";
import { DatabaseModule } from "@src/shared/database/database.module";
import { CreateRecipientController } from "../controllers/create-recipient.controller";
import { DeleteRecipientController } from "../controllers/delete-recipient.controller";
import { GetRecipientController } from "../controllers/get-recipient.controller";
import { UpdateRecipientController } from "../controllers/update-recipient.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [
		CreateRecipientController,
		UpdateRecipientController,
		GetRecipientController,
		DeleteRecipientController,
	],
	providers: [
		CreateRecipientUseCase,
		UpdateRecipientUseCase,
		GetRecipientByIdUseCase,
		DeleteRecipientUseCase,
		GetAllRecipientsUseCase,
	],
	exports: [DatabaseModule],
})
export class RecipientModule {}
