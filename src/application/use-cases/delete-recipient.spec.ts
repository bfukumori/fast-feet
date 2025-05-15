import { HttpStatus } from "@nestjs/common";
import { Recipient } from "@src/domain/entities/recipient";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makeRecipient } from "@test/factories/make-recipient-factory";
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository";
import { DeleteRecipientUseCase } from "./delete-recipient";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let recipient: Recipient;
let sut: DeleteRecipientUseCase;

describe("Delete recipient use case", () => {
	beforeEach(() => {
		inMemoryRecipientRepository = new InMemoryRecipientRepository();
		sut = new DeleteRecipientUseCase(inMemoryRecipientRepository);
		recipient = makeRecipient();
	});

	it("should be able to delete a recipient", async () => {
		inMemoryRecipientRepository.recipients.push(recipient);

		await sut.execute(recipient.id.value);

		expect(inMemoryRecipientRepository.recipients.length).toBe(0);
	});

	it("should not be able to delete a nonexistent recipient", async () => {
		await expect(async () => {
			await sut.execute(recipient.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`Recipient with ID: "${recipient.id.value}" not found.`,
				DeleteRecipientUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
