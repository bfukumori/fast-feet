import { HttpStatus } from "@nestjs/common";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makeRecipient } from "@test/factories/make-recipient-factory";
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository";
import { UpdateRecipientUseCase } from "./update-recipient";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: UpdateRecipientUseCase;

describe("Update recipient use case", () => {
	beforeEach(() => {
		inMemoryRecipientRepository = new InMemoryRecipientRepository();
		sut = new UpdateRecipientUseCase(inMemoryRecipientRepository);
	});

	it("should be able to update a new recipient", async () => {
		const recipient = makeRecipient();

		inMemoryRecipientRepository.recipients.push(recipient);

		recipient.updateComplement("new complement");

		await sut.execute(recipient, recipient.id.value);

		expect(inMemoryRecipientRepository.recipients[0]).toMatchObject({
			complement: "new complement",
		});
	});

	it("should not be able to update a nonexistent recipient", async () => {
		const invalidId = "invalid id";

		await expect(async () => {
			await sut.execute({ complement: "updated complement" }, invalidId);
		}).rejects.toThrow(
			new ApplicationError(
				`Recipient with ID: "${invalidId}" not found.`,
				UpdateRecipientUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
