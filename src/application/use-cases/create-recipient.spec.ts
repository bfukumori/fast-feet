import { HttpStatus } from "@nestjs/common";
import { Recipient } from "@src/domain/entities/recipient";
import { toPersistence } from "@src/infrastructure/mappers/prisma-recipient-mapper";
import { DomainError } from "@src/shared/errors/domain-error";
import { makeRecipient } from "@test/factories/make-recipient-factory";
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository";
import { CreateRecipientUseCase } from "./create-recipient";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: CreateRecipientUseCase;

describe("Create recipient use case", () => {
	beforeEach(() => {
		inMemoryRecipientRepository = new InMemoryRecipientRepository();
		sut = new CreateRecipientUseCase(inMemoryRecipientRepository);
	});

	it("should be able to create a new recipient", async () => {
		const recipient = makeRecipient();

		await sut.execute(toPersistence(recipient));

		expect(inMemoryRecipientRepository.recipients).toHaveLength(1);
		expect(inMemoryRecipientRepository.recipients[0].id.value).toBeTruthy();
	});

	it("should be able to create a new recipient without a complement", async () => {
		const recipient = makeRecipient({
			complement: null,
		});

		await sut.execute(toPersistence(recipient));

		expect(inMemoryRecipientRepository.recipients).toHaveLength(1);
		expect(inMemoryRecipientRepository.recipients[0].id.value).toBeTruthy();
		expect(inMemoryRecipientRepository.recipients[0].complement).toBeNull();
	});

	it("should not be able to create a new recipient with invalid zipcode", async () => {
		await expect(async () => {
			makeRecipient({
				zipCode: "invalid",
			});
		}).rejects.toThrow(
			new DomainError(
				Recipient.ERROR_MESSAGE.invalidZipCode,
				Recipient.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});

	it("should not be able to create a new recipient with invalid state", async () => {
		await expect(async () => {
			makeRecipient({
				state: "invalid",
			});
		}).rejects.toThrow(
			new DomainError(
				Recipient.ERROR_MESSAGE.invalidState,
				Recipient.name,
				HttpStatus.BAD_REQUEST,
			),
		);
	});
});
