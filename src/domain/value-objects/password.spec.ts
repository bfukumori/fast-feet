import { Hasher } from "@src/application/services/cryptography/hasher";
import { BcryptHasher } from "@src/infrastructure/services/cryptography/bcrypt/bcrypt-hasher";
import { DomainError } from "@src/shared/errors/domain-error";
import { Password } from "./password";

const HTTP_STATUS_CODE = 400;
const VALID_PASSWORD = "#Aa12345";
const INVALID_MIN_LENGTH_PASSWORD = "#Aa123";
const INVALID_WHITE_SPACE_PASSWORD = "#Aa 12345";
const INVALID_UPPERCASE_PASSWORD = "#aa12345";
const INVALID_LOWERCASE_PASSWORD = "#AA12345";
const INVALID_NUMBER_PASSWORD = "#Aaaaaaa";
const INVALID_SPECIAL_CHAR_PASSWORD = "AAa12345";

let hasher: Hasher;

describe("[Value Object] Password", () => {
	beforeAll(() => {
		hasher = new BcryptHasher();
	});

	test("create a new password", async () => {
		const password = await Password.createFromPlain(VALID_PASSWORD, hasher);

		const isValid = await Password.isValid(
			VALID_PASSWORD,
			password.value,
			hasher,
		);

		expect(isValid).toBe(true);
	});

	test("create with invalid password (at least 8 chars length)", async () => {
		await expect(async () => {
			await Password.createFromPlain(INVALID_MIN_LENGTH_PASSWORD, hasher);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.minLength,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid password (no white spaces)", async () => {
		await expect(async () => {
			await Password.createFromPlain(INVALID_WHITE_SPACE_PASSWORD, hasher);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.whiteSpace,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid password (at least 1 uppercase)", async () => {
		await expect(async () => {
			await Password.createFromPlain(INVALID_UPPERCASE_PASSWORD, hasher);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.uppercase,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid password (at least 1 lowercase)", async () => {
		await expect(async () => {
			await Password.createFromPlain(INVALID_LOWERCASE_PASSWORD, hasher);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.lowercase,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid password (at least 1 number)", async () => {
		await expect(async () => {
			await Password.createFromPlain(INVALID_NUMBER_PASSWORD, hasher);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.number,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid password (at least 1 specialChar)", async () => {
		await expect(async () => {
			await Password.createFromPlain(INVALID_SPECIAL_CHAR_PASSWORD, hasher);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.specialChar,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});
});
