import {
	CanActivate,
	ExecutionContext,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "@src/infrastructure/decorators/is-public.decorator";
import { EnvService } from "@src/shared/config/env/env.service";
import { ApplicationError } from "@src/shared/errors/application-error";
import { FastifyRequest } from "fastify";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly envService: EnvService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const req = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(req);

		if (!token) {
			throw new ApplicationError(
				"Not authenticated.",
				AuthGuard.name,
				HttpStatus.UNAUTHORIZED,
			);
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.envService.get("JWT_SECRET"),
			});

			req.user = payload;
		} catch (error) {
			throw new ApplicationError(
				"Not authenticated.",
				AuthGuard.name,
				HttpStatus.UNAUTHORIZED,
			);
		}

		return true;
	}

	private extractTokenFromHeader(request: FastifyRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];

		return type === "Bearer" ? token : undefined;
	}
}
