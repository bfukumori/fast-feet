import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SignInUseCase } from "@src/application/use-cases/sign-in";
import { EnvModule } from "@src/shared/config/env/env.module";
import { EnvService } from "@src/shared/config/env/env.service";
import { AuthController } from "../controllers/auth.controller";
import { UserModule } from "./user.module";

const EXPIRES_IN = "1d";

@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			useFactory: async (envService: EnvService) => ({
				secret: envService.get("JWT_SECRET"),
				global: true,
				signOptions: { expiresIn: EXPIRES_IN },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [SignInUseCase],
	exports: [SignInUseCase],
})
export class AuthModule {}
