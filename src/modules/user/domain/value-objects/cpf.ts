export class Cpf {
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

	equals(other: Cpf): boolean {
		return this._value === other._value;
	}

	format(): string {
		return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
	}

	static create(value: string): Cpf {
		const sanitized = Cpf.sanitize(value);

		if (!Cpf.isValid(sanitized)) {
			throw new Error("Invalid CPF");
		}

		return new Cpf(sanitized);
	}

	private static sanitize(value: string): string {
		return value.replace(/[^\d]/g, "");
	}

	private static isValid(value: string): boolean {
		if (!value || value.length !== 11 || /^(\d)\1+$/.test(value)) {
			return false;
		}

		const calcDigit = (factor: number) =>
			value
				.split("")
				.slice(0, factor - 1)
				.reduce((acc, num, i) => acc + +num * (factor - i), 0);

		const first = calcDigit(10);
		const second = calcDigit(11);

		const validFirst = ((first * 10) % 11) % 10 === +value[9];
		const validSecond = ((second * 10) % 11) % 10 === +value[10];

		return validFirst && validSecond;
	}
}
