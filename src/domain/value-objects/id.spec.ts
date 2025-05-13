import { randomUUID } from "node:crypto";
import { DomainError } from "@src/shared/errors/domain-error";
import { Id } from "./id";

const HTTP_STATUS_CODE = 400;
const VALID_ID = randomUUID();
const INVALID_ID = "1";

describe("[Value Object] Id", () => {
	test("create a new id", async () => {
		const id = Id.create(VALID_ID);

		expect(id).toBeTruthy();
		expect(id.value).toBe(VALID_ID);
		expect(id.toString()).toBe(VALID_ID);
	});

	test("compare ids", async () => {
		const id = Id.create(VALID_ID);
		const expectedOutput = true;

		const isEqual = id.equals(id);

		expect(isEqual).toBe(expectedOutput);
	});

	test("create with invalid id (invalid uuid format)", async () => {
		await expect(async () => {
			Id.create(INVALID_ID);
		}).rejects.toThrow(
			new DomainError(
				Id.ERROR_MESSAGE.invalidUUIDFormat,
				Id.name,
				HTTP_STATUS_CODE,
			),
		);
	});
});
