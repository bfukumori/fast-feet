import { DomainError } from "@src/shared/errors/domain-error";
import { Cpf } from "./cpf";

const HTTP_STATUS_CODE = 400;
const VALID_CPF = "11649425066";
const FORMATTED_VALID_CPF = "116.494.250-66";
const INVALID_LENGTH_CPF = "1234";
const INVALID_ALL_DIGITS_EQUAL_CPF = "11111111111";
const INVALID_VERIFIER_DIGIT_CPF = "12345678900";

describe("[Value Object] Cpf", () => {
	test("create a new cpf", async () => {
		const cpf = Cpf.create(VALID_CPF);

		expect(cpf).toBeTruthy();
		expect(cpf.value).toBe(VALID_CPF);
		expect(cpf.toString()).toBe(VALID_CPF);
	});

	test("format a cpf", async () => {
		const cpf = Cpf.create(VALID_CPF);

		const formattedCpf = cpf.format();

		expect(formattedCpf).toBe(FORMATTED_VALID_CPF);
	});

	test("compare cpfs", async () => {
		const cpf = Cpf.create(VALID_CPF);
		const expectedOutput = true;

		const isEqual = cpf.equals(cpf);

		expect(isEqual).toBe(expectedOutput);
	});

	test("create with invalid cpf (length equals 11)", async () => {
		await expect(async () => {
			Cpf.create(INVALID_LENGTH_CPF);
		}).rejects.toThrow(
			new DomainError(
				Cpf.ERROR_MESSAGE.invalidLength,
				Cpf.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid cpf (all digits equal)", async () => {
		await expect(async () => {
			Cpf.create(INVALID_ALL_DIGITS_EQUAL_CPF);
		}).rejects.toThrow(
			new DomainError(
				Cpf.ERROR_MESSAGE.invalidAllDigitsEqual,
				Cpf.name,
				HTTP_STATUS_CODE,
			),
		);
	});

	test("create with invalid cpf (verifier digit)", async () => {
		await expect(async () => {
			Cpf.create(INVALID_VERIFIER_DIGIT_CPF);
		}).rejects.toThrow(
			new DomainError(
				Cpf.ERROR_MESSAGE.invalidVerifierDigit,
				Cpf.name,
				HTTP_STATUS_CODE,
			),
		);
	});
});
