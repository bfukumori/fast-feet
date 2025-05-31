import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { EnvService } from "@src/shared/config/env/env.service";
import { ApplicationError } from "@src/shared/errors/application-error";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
	let guard: AuthGuard;
	let reflector: Reflector;
	let jwtService: JwtService;
	let envService: EnvService;

	const mockReflector = {
		getAllAndOverride: vi.fn(),
	};

	const mockJwtService = {
		verifyAsync: vi.fn(),
	};

	const mockEnvService = {
		get: vi.fn(),
	};

	const createMockExecutionContext = (
		authHeader?: string,
	): Partial<ExecutionContext> =>
		({
			switchToHttp: () => ({
				getRequest: () => ({
					headers: {
						authorization: authHeader,
					},
				}),
			}),
			getHandler: () => vi.fn(),
			getClass: () => vi.fn(),
		}) as unknown as ExecutionContext;

	beforeEach(() => {
		reflector = mockReflector as unknown as Reflector;
		jwtService = mockJwtService as unknown as JwtService;
		envService = mockEnvService as unknown as EnvService;
		guard = new AuthGuard(jwtService, envService, reflector);
		vi.clearAllMocks();
	});

	it("should allow access to public route", async () => {
		mockReflector.getAllAndOverride.mockReturnValue(true);

		const context = createMockExecutionContext() as ExecutionContext;
		const result = await guard.canActivate(context);
		expect(result).toBe(true);
	});

	it("should deny access if no token is provided", async () => {
		mockReflector.getAllAndOverride.mockReturnValue(false);

		const context = createMockExecutionContext(undefined) as ExecutionContext;

		await expect(guard.canActivate(context)).rejects.toThrow(ApplicationError);
	});

	it("should deny access if token is invalid", async () => {
		mockReflector.getAllAndOverride.mockReturnValue(false);
		mockEnvService.get.mockReturnValue("fake-secret");
		mockJwtService.verifyAsync.mockRejectedValue(new Error("Invalid token"));

		const context = createMockExecutionContext(
			"Bearer invalid.token",
		) as ExecutionContext;

		await expect(guard.canActivate(context)).rejects.toThrow(ApplicationError);
	});

	it("should allow access if token is valid", async () => {
		mockReflector.getAllAndOverride.mockReturnValue(false);
		mockEnvService.get.mockReturnValue("fake-secret");
		mockJwtService.verifyAsync.mockResolvedValue({ sub: "user-id" });

		const mockRequest = {
			headers: {
				authorization: "Bearer valid.token",
			},
		};

		const context = {
			switchToHttp: () => ({
				getRequest: () => mockRequest,
			}),
			getHandler: () => vi.fn(),
			getClass: () => vi.fn(),
		} as unknown as ExecutionContext;

		const result = await guard.canActivate(context);
		expect(result).toBe(true);
	});
});
