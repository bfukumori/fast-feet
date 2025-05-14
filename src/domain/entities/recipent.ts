import { DomainError } from "@src/shared/errors/domain-error";
import { Id } from "../value-objects/id";

type InternalRecipientProps = {
	id?: Id;
	name: string;
	street: string;
	number: string;
	complement?: string | null;
	city: string;
	state: string;
	zipCode: string;
};

type RecipientProps = Omit<InternalRecipientProps, "id">;

export type RestoreRecipientProps = Omit<InternalRecipientProps, "id"> & {
	id: string;
};

export class Recipient {
	private static readonly _CEP_LENGTH = 8;
	private static readonly _STATE_LENGHT = 2;
	private static readonly _REGEX = {
		zipCode: /^\d{8}$/,
		state: /^[A-Z]{2}$/,
	};
	public static readonly ERROR_MESSAGE = {
		invalidZipCode: `Invalid zip code. Must be at ${Recipient._CEP_LENGTH} characters long and contain only numbers. Ex: 12345678`,
		invalidState: `Must be at ${Recipient._STATE_LENGHT} characters long and contain only letters. Ex: SP`,
	};

	public readonly id: Id;
	public readonly name: string;
	public readonly street: string;
	public readonly number: string;
	public readonly complement?: string | null;
	public readonly city: string;
	public readonly state: string;
	public readonly zipCode: string;

	private constructor({
		id,
		name,
		street,
		number,
		complement,
		city,
		state,
		zipCode,
	}: InternalRecipientProps) {
		this.id = id ?? Id.create();
		this.name = name;
		this.street = street;
		this.number = number;
		this.complement = complement;
		this.city = city;
		this.state = state;
		this.zipCode = zipCode;
	}

	static create({
		name,
		street,
		number,
		complement,
		city,
		state,
		zipCode,
	}: RecipientProps): Recipient {
		Recipient.validateState(state);
		Recipient.validateZipcode(zipCode);

		return new Recipient({
			name,
			street,
			number,
			complement,
			city,
			state,
			zipCode,
		});
	}

	static restore({
		name,
		street,
		number,
		complement,
		city,
		state,
		zipCode,
		id,
	}: RestoreRecipientProps): Recipient {
		return new Recipient({
			id: Id.create(id),
			name,
			street,
			number,
			complement,
			city,
			state,
			zipCode,
		});
	}

	private static validateZipcode(cep: string): void {
		if (!Recipient._REGEX.zipCode.test(cep)) {
			throw new DomainError(
				Recipient.ERROR_MESSAGE.invalidZipCode,
				Recipient.name,
			);
		}
	}

	private static validateState(state: string): void {
		if (!Recipient._REGEX.state.test(state)) {
			throw new DomainError(
				Recipient.ERROR_MESSAGE.invalidState,
				Recipient.name,
			);
		}
	}
}
