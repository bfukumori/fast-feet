import { BaseError } from "./base-error";

export class ApplicationError extends BaseError {
	constructor(
		public readonly message: string,
		public readonly origin: string,
		public readonly statusCode: number,
	) {
		super(message, statusCode);
		this.origin = origin;
		this.name = this.constructor.name;
	}
}
