import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { envSchema } from "@src/shared/config/env/env.schema";
import { config } from "dotenv";
import { PrismaClient } from "generated/prisma";
import { afterAll, beforeAll } from "vitest";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
	if (!env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const url = new URL(env.DATABASE_URL);
	url.searchParams.set("schema", schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schemaId);
	process.env.DATABASE_URL = databaseURL;

	execSync("pnpx prisma migrate deploy");
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prisma.$disconnect();
});
