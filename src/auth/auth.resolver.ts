import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { VerifyAccountInput } from './dto/verify.input';
import { PasswordResetRequestInput } from './dto/password-reset-request.input';
import { PasswordResetInput } from './dto/password-reset.input';
import { Response, Request } from 'express';
import { AccessTokenResponse, MessageResponse, Serialize } from '@app/shared';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Serialize(AccessTokenResponse)
  @Mutation(() => AccessTokenResponse, { name: 'login' })
  login(
    @Args('loginInput') loginInput: LoginInput,
    @Context('res') response: Response,
  ) {
    return this.authService.login(loginInput, response);
  }

  @Mutation(() => MessageResponse, { name: 'register' })
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Serialize(AccessTokenResponse)
  @Mutation(() => AccessTokenResponse, { name: 'verify_account' })
  verifyAccount(
    @Args('verifyAccountInput') verifyAccountInput: VerifyAccountInput,
    @Context('res') response: Response,
  ) {
    return this.authService.verifyAccount(verifyAccountInput, response);
  }

  @Mutation(() => MessageResponse, { name: 'password_reset_request' })
  passwordResetRequest(
    @Args('passwordResetRequestInput')
    passwordResetRequestInput: PasswordResetRequestInput,
  ) {
    return this.authService.passwordResetRequest(passwordResetRequestInput);
  }

  @Mutation(() => MessageResponse, { name: 'password_reset' })
  resetPassword(
    @Args('passwordResetInput') passwordResetInput: PasswordResetInput,
  ) {
    return this.authService.passwordReset(passwordResetInput);
  }

  @Query(() => AccessTokenResponse, { name: 'refresh' })
  refresh(@Context('req') request: Request) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.refresh(refreshToken);
  }

  @Serialize(MessageResponse)
  @Mutation(() => MessageResponse, { name: 'logout' })
  logout(@Context('req') request: Request, @Context('res') response: Response) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.logout(response, refreshToken);
  }
}
