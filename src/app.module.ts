import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
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
		UserModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
	],
})
export class AppModule {}
