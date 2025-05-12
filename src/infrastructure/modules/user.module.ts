import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "@src/application/use-cases/create-user";
import { DatabaseModule } from "@src/shared/database/database.module";
import { CreateUserController } from "../controllers/create-user.controller";
import { CryptographyModule } from "./cryptography.module";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [CreateUserController],
	providers: [CreateUserUseCase],
})
export class UserModule {}
