import {
	CanActivate,
	ExecutionContext,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@src/infrastructure/decorators/roles.decorator";
import { ApplicationError } from "@src/shared/errors/application-error";
import { Role, User } from "generated/prisma";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]) satisfies Role[];

		if (!requiredRoles) {
			return true;
		}

		const req = context.switchToHttp().getRequest();
		const user = req.user as User;

		const condition = requiredRoles.some((role) => user.role.includes(role));

		if (condition === false) {
			throw new ApplicationError(
				"You don't have permission to access this resource",
				RolesGuard.name,
				HttpStatus.FORBIDDEN,
			);
		}

		return true;
	}
}
