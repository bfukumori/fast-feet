import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { AuthGuard } from "./infrastructure/guards/auth/auth.guard";
import { RolesGuard } from "./infrastructure/guards/auth/roles.guard";
import { AuthModule } from "./infrastructure/modules/auth.module";
import { PackageModule } from "./infrastructure/modules/package.module";
import { RecipientModule } from "./infrastructure/modules/recipient.module";
import { UserModule } from "./infrastructure/modules/user.module";
import { EnvModule } from "./shared/config/env/env.module";
import { envSchema } from "./shared/config/env/env.schema";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => envSchema.parse(env),
		}),
		EnvModule,
		AuthModule,
		UserModule,
		PackageModule,
		RecipientModule,
	],
	providers: [
		JwtService,
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
("");
