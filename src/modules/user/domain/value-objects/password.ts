export class Password {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
		Object.freeze(this);
	}

	get value(): string {
		return this._value;
	}

	toString(): string {
		return this._value;
	}

	equals(other: Password): boolean {
		return this._value === other._value;
	}

	static create(value: string): Password {
		Password.validate(value);

		return new Password(value);
	}

	private static validate(password: string) {
		if (password.length < 8) {
			throw new Error("Invalid password. Must be at least 8 characters long.");
		}

		if (password.includes(" ")) {
			throw new Error("Invalid password. Must not contain spaces.");
		}

		if (!/[A-Z]/.test(password)) {
			throw new Error(
				"Invalid password. Must contain at least one uppercase letter.",
			);
		}

		if (!/[a-z]/.test(password)) {
			throw new Error(
				"Invalid password. Must contain at least one lowercase letter.",
			);
		}

		if (!/[0-9]/.test(password)) {
			throw new Error("Invalid password. Must contain at least one number.");
		}

		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			throw new Error(
				"Invalid password. Must contain at least one special character.",
			);
		}

		return password;
	}
}
