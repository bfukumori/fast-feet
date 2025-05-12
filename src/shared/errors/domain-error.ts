import { HttpStatus } from "@nestjs/common";
import { BaseError } from "./base-error";

export class DomainError extends BaseError {
	constructor(
		public readonly message: string,
		public readonly origin: string,
		public readonly statusCode: number = HttpStatus.BAD_REQUEST,
	) {
		super(message, statusCode);
		this.origin = origin;
		this.name = this.constructor.name;
	}
}
