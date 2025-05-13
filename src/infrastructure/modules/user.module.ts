import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "@src/application/use-cases/create-user";
import { DeleteUserUseCase } from "@src/application/use-cases/delete-user";
import { GetUserByCpfUseCase } from "@src/application/use-cases/get-user-by-cpf";
import { GetUserByIdUseCase } from "@src/application/use-cases/get-user-by-id";
import { UpdateUserUseCase } from "@src/application/use-cases/update-user";
import { DatabaseModule } from "@src/shared/database/database.module";
import { CreateUserController } from "../controllers/create-user.controller";
import { DeleteUserController } from "../controllers/delete-user.controller";
import { GetUserController } from "../controllers/get-user.controller";
import { UpdateUserController } from "../controllers/update-user.controller";
import { CryptographyModule } from "./cryptography.module";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateUserController,
		UpdateUserController,
		DeleteUserController,
		GetUserController,
	],
	providers: [
		CreateUserUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,
		GetUserByIdUseCase,
		GetUserByCpfUseCase,
	],
})
export class UserModule {}
