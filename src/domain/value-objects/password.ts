import { Hasher } from "@src/application/services/cryptography/hasher";
import { DomainError } from "@src/shared/errors/domain-error";

export class Password {
	private readonly _value: string;
	private static readonly _MIN_LENGTH = 8;
	private static readonly _REGEX = {
		whiteSpace: /\s/,
		uppercase: /[A-Z]/,
		lowercase: /[a-z]/,
		number: /[0-9]/,
		specialChar: /[!@#$%^&*(),.?":{}|<>]/,
	};
	public static readonly ERROR_MESSAGE = {
		minLength: `Must be at least ${Password._MIN_LENGTH} characters long.`,
		whiteSpace: "Must not contain spaces.",
		uppercase: "Must contain at least one uppercase letter.",
		lowercase: "Must contain at least one lowercase letter.",
		number: "Must contain at least one number.",
		specialChar: "Must contain at least one special character.",
	};

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

	static async createFromPlain(
		value: string,
		hasher: Hasher,
	): Promise<Password> {
		Password.validate(value);

		const hashedPwd = await hasher.hash(value);

		return new Password(hashedPwd);
	}

	static createFromHashed(hashed: string): Password {
		return new Password(hashed);
	}

	static async isValid(pwd: string, hashedPwd: string, hasher: Hasher) {
		return await hasher.compare(pwd, hashedPwd);
	}

	private static validate(password: string) {
		if (password.length < Password._MIN_LENGTH) {
			throw new DomainError(Password.ERROR_MESSAGE.minLength, Password.name);
		}

		if (Password._REGEX.whiteSpace.test(password)) {
			throw new DomainError(Password.ERROR_MESSAGE.whiteSpace, Password.name);
		}

		if (!Password._REGEX.uppercase.test(password)) {
			throw new DomainError(Password.ERROR_MESSAGE.uppercase, Password.name);
		}

		if (!Password._REGEX.lowercase.test(password)) {
			throw new DomainError(Password.ERROR_MESSAGE.lowercase, Password.name);
		}

		if (!Password._REGEX.number.test(password)) {
			throw new DomainError(Password.ERROR_MESSAGE.number, Password.name);
		}

		if (!Password._REGEX.specialChar.test(password)) {
			throw new DomainError(Password.ERROR_MESSAGE.specialChar, Password.name);
		}
	}
}
