import { DomainError } from "@src/shared/errors/domain-error";

export class Cpf {
	private readonly _value: string;
	private static readonly _LENGTH = 11;
	private static readonly _REGEX = {
		notDigits: /[^\d]/g,
		allDigitsEqual: /^(\d)\1+$/,
		format: /(\d{3})(\d{3})(\d{3})(\d{2})/,
	};
	public static readonly ERROR_MESSAGE = {
		invalidVerifierDigit: "Invalid CPF. Verifier digit not valid.",
		invalidAllDigitsEqual: "Invalid CPF. All digits are equal.",
		invalidLength: "Invalid CPF length. Must contain 11 digits.",
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

	equals(other: Cpf): boolean {
		return this._value === other._value;
	}

	format(): string {
		return this._value.replace(Cpf._REGEX.format, "$1.$2.$3-$4");
	}

	static create(value: string): Cpf {
		const sanitized = Cpf.sanitize(value);

		Cpf.validate(sanitized);

		return new Cpf(sanitized);
	}

	private static sanitize(value: string): string {
		return value.replace(Cpf._REGEX.notDigits, "");
	}

	private static validate(cpf: string) {
		if (cpf.length !== Cpf._LENGTH) {
			throw new DomainError(Cpf.ERROR_MESSAGE.invalidLength, Cpf.name);
		}

		if (Cpf._REGEX.allDigitsEqual.test(cpf)) {
			throw new DomainError(Cpf.ERROR_MESSAGE.invalidAllDigitsEqual, Cpf.name);
		}

		const calcDigit = (factor: number) =>
			cpf
				.split("")
				.slice(0, factor - 1)
				.reduce((acc, num, i) => acc + +num * (factor - i), 0);

		const first = calcDigit(10);
		const second = calcDigit(11);

		const validFirst = ((first * 10) % 11) % 10 === +cpf[9];
		const validSecond = ((second * 10) % 11) % 10 === +cpf[10];

		if (!(validFirst && validSecond)) {
			throw new DomainError(Cpf.ERROR_MESSAGE.invalidVerifierDigit, Cpf.name);
		}
	}
}
