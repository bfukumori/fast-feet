// biome-ignore assist/source/organizeImports: false
import { initializeTracing } from "./tracing";
initializeTracing();
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";
import { EnvService } from "./shared/config/env/env.service";
import { ApplicationExceptionFilter } from "./shared/filters/application-exception.filter";
import { DomainExceptionFilter } from "./shared/filters/domain-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	app.setGlobalPrefix("api");
	app.useGlobalFilters(
		new ApplicationExceptionFilter(),
		new DomainExceptionFilter(),
	);

	patchNestJsSwagger();

	const config = new DocumentBuilder()
		.setTitle("FastFeet API")
		.setDescription("The FastFeet API documentation")
		.setVersion("1.0")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api-docs", app, documentFactory);

	const envService = app.get(EnvService);

	await app.listen(envService.get("PORT"));
}
bootstrap();
