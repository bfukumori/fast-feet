import { Recipient } from "@src/domain/entities/recipient";
import { makeRecipient } from "@test/factories/make-recipient-factory";
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository";
import { GetAllRecipientsUseCase } from "./get-all-recipients";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let recipient: Recipient;
let sut: GetAllRecipientsUseCase;

describe("Get all recipients", () => {
	beforeEach(() => {
		inMemoryRecipientRepository = new InMemoryRecipientRepository();
		sut = new GetAllRecipientsUseCase(inMemoryRecipientRepository);
		recipient = makeRecipient();
	});

	it("should be able to list recipients", async () => {
		for (let index = 0; index <= 10; index++) {
			inMemoryRecipientRepository.recipients.push(recipient);
		}

		const { recipients } = await sut.execute();

		expect(recipients).toHaveLength(10);
	});
});
