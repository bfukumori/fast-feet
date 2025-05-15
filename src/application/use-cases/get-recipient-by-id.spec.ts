import { HttpStatus } from "@nestjs/common";
import { Recipient } from "@src/domain/entities/recipient";
import { ApplicationError } from "@src/shared/errors/application-error";
import { makeRecipient } from "@test/factories/make-recipient-factory";
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository";
import { GetRecipientByIdUseCase } from "./get-recipient-by-id";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let recipient: Recipient;
let sut: GetRecipientByIdUseCase;

describe("Get recipient by cpf use case", () => {
	beforeEach(() => {
		inMemoryRecipientRepository = new InMemoryRecipientRepository();
		sut = new GetRecipientByIdUseCase(inMemoryRecipientRepository);
		recipient = makeRecipient();
	});

	it("should be able to get a recipient by its id", async () => {
		inMemoryRecipientRepository.recipients.push(recipient);

		const fetchedRecipient = await sut.execute(recipient.id.value);

		expect(fetchedRecipient).toStrictEqual({
			id: recipient.id.value,
			name: recipient.name,
			street: recipient.street,
			number: recipient.number,
			complement: recipient.complement,
			city: recipient.city,
			state: recipient.state,
			zipCode: recipient.zipCode,
		});
	});

	it("should not be able to get a nonexistent recipient", async () => {
		await expect(async () => {
			await sut.execute(recipient.id.value);
		}).rejects.toThrow(
			new ApplicationError(
				`Recipient with ID: "${recipient.id.value}" not found.`,
				GetRecipientByIdUseCase.name,
				HttpStatus.NOT_FOUND,
			),
		);
	});
});
