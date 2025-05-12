import { Module } from "@nestjs/common";
import { Hasher } from "@src/application/services/cryptography/hasher";
import { BcryptHasher } from "../services/cryptography/bcrypt/bcrypt-hasher";

@Module({
	providers: [
		{
			provide: Hasher,
			useClass: BcryptHasher,
		},
	],
	exports: [Hasher],
})
export class CryptographyModule {}
