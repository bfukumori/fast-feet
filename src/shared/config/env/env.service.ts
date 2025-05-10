import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvSchema } from "./env.schema";

@Injectable()
export class EnvService {
	constructor(private readonly configService: ConfigService<EnvSchema, true>) {}

	get<T extends keyof EnvSchema>(key: T) {
		return this.configService.get<T>(key, { infer: true });
	}
}
