import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { SignInDto } from "@src/application/dtos/sign-in.dto";
import { SignInUseCase } from "@src/application/use-cases/sign-in";
import { Public } from "@src/infrastructure/decorators/is-public.decorator";

@Controller("auth")
@Public()
export class AuthController {
	constructor(private readonly signInUsecase: SignInUseCase) {}

	@ApiOperation({ summary: "Authenticate a user" })
	@HttpCode(HttpStatus.OK)
	@Post("sign-in")
	async login(@Body() signInDto: SignInDto) {
		return await this.signInUsecase.execute(signInDto);
	}
}
