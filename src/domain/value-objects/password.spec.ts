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

describe("[Value Object] Password", () => {
	test("create a new password", async () => {
		const password = Password.createFromPlain(VALID_PASSWORD);

		expect(password).toBeTruthy();
		expect(password).toBe(VALID_PASSWORD);
		expect(password.toString()).toBe(VALID_PASSWORD);
	});

	test("create with invalid password (at least 8 chars length)", async () => {
		await expect(async () => {
			Password.createFromPlain(INVALID_MIN_LENGTH_PASSWORD);
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
			Password.createFromPlain(INVALID_WHITE_SPACE_PASSWORD);
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
			Password.createFromPlain(INVALID_UPPERCASE_PASSWORD);
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
			Password.createFromPlain(INVALID_LOWERCASE_PASSWORD);
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
			Password.createFromPlain(INVALID_NUMBER_PASSWORD);
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
			Password.createFromPlain(INVALID_SPECIAL_CHAR_PASSWORD);
		}).rejects.toThrow(
			new DomainError(
				Password.ERROR_MESSAGE.specialChar,
				Password.name,
				HTTP_STATUS_CODE,
			),
		);
	});
});
