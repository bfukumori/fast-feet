import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApplicationError } from "@src/shared/errors/application-error";
import { Role } from "generated/prisma";
import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
	let guard: RolesGuard;
	let reflector: Reflector;

	const mockReflector = {
		getAllAndOverride: vi.fn(),
	};

	const createMockExecutionContext = (): Partial<ExecutionContext> =>
		({
			switchToHttp: () => ({
				getRequest: () => ({
					user: {
						role: Role.ADMIN,
					},
				}),
			}),
			getHandler: () => vi.fn(),
			getClass: () => vi.fn(),
		}) as unknown as ExecutionContext;

	beforeEach(() => {
		reflector = mockReflector as unknown as Reflector;
		guard = new RolesGuard(reflector);
		vi.clearAllMocks();
	});

	it("should allow access if there is no guard", async () => {
		mockReflector.getAllAndOverride.mockReturnValue(undefined);

		const context = createMockExecutionContext() as ExecutionContext;
		const result = await guard.canActivate(context);
		expect(result).toBe(true);
	});

	it("should allow access to admin routes", async () => {
		mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

		const context = createMockExecutionContext() as ExecutionContext;
		const result = await guard.canActivate(context);
		expect(result).toBe(true);
	});

	it("should deny access to admin routes for unauthorized user", async () => {
		mockReflector.getAllAndOverride.mockReturnValue([Role.DELIVERY_MAN]);

		const context = createMockExecutionContext() as ExecutionContext;

		await expect(guard.canActivate(context)).rejects.toThrow(ApplicationError);
	});
});
