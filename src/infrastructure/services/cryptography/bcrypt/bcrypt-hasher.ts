import { Injectable } from "@nestjs/common";
import { Hasher } from "@src/application/services/cryptography/hasher";
import { compare, hash } from "bcrypt-ts";

@Injectable()
export class BcryptHasher implements Hasher {
	private static HASH_SALT_LENGTH = 8;

	async hash(value: string): Promise<string> {
		return hash(value, BcryptHasher.HASH_SALT_LENGTH);
	}

	async compare(value: string, hashedValue: string): Promise<boolean> {
		return compare(value, hashedValue);
	}
}
