import { randomUUID } from "node:crypto";
import { DomainError } from "@src/shared/errors/domain-error";

export class Id {
	private readonly _value: string;
	private static readonly REGEX = {
		validUUIDFormat:
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
	};
	public static readonly ERROR_MESSAGE = {
		invalidUUIDFormat: "Invalid Id. UUID format not valid.",
	};

	private constructor(value?: string) {
		this._value = value ?? randomUUID();
		Object.freeze(this);
	}

	get value(): string {
		return this._value;
	}

	toString(): string {
		return this._value;
	}

	equals(other: Id): boolean {
		return this._value === other._value;
	}

	static create(value?: string): Id {
		if (value) {
			Id.validate(value);
		}

		return new Id(value);
	}

	private static validate(id: string) {
		if (!Id.REGEX.validUUIDFormat.test(id)) {
			throw new DomainError(Id.ERROR_MESSAGE.invalidUUIDFormat, Id.name);
		}
	}
}
