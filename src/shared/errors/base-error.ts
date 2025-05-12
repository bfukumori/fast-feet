import { HttpStatus } from "@nestjs/common";

export abstract class BaseError extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
	) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
	}
}
