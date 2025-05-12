import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ApplicationError } from "../errors/application-error";

@Catch(ApplicationError)
export class ApplicationExceptionFilter implements ExceptionFilter {
	catch(exception: ApplicationError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();
		const status = exception.statusCode;

		response.status(status).send({
			statusCode: status,
			message: exception.message,
			origin: exception.origin,
			timestamp: new Date().toISOString(),
		});
	}
}
