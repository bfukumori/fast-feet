import { Hasher } from "@src/application/services/cryptography/hasher";

export class FakeHasher implements Hasher {
	hash(value: string): Promise<string> {
		return Promise.resolve(value.concat("-hashed"));
	}

	compare(value: string, hashedValue: string): Promise<boolean> {
		return Promise.resolve(value.concat("-hashed") === hashedValue);
	}
}
