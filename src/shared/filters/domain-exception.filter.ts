import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { DomainError } from "@src/shared/errors/domain-error";
import { FastifyReply } from "fastify";

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
	catch(exception: DomainError, host: ArgumentsHost) {
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
