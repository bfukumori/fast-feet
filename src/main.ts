import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";
import { EnvService } from "./shared/config/env/env.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, new FastifyAdapter());

	app.setGlobalPrefix("api");

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
