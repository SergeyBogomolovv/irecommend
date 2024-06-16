import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { VerifyAccountInput } from './dto/verify.input';
import { PasswordResetInput } from './dto/password-reset.input';
import { Response, Request } from 'express';
import { AccessTokenResponse, MessageResponse } from '@app/shared';
import { VerifyResponse } from '@app/shared/dto/verify.response';
import { ValidateAuthResponse } from '@app/shared/dto/validate_auth.response';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccessTokenResponse, { name: 'login' })
  login(
    @Args('loginInput') loginInput: LoginInput,
    @Context('res') response: Response,
  ) {
    return this.authService.login(loginInput, response);
  }

  @Mutation(() => VerifyResponse, { name: 'register' })
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AccessTokenResponse, { name: 'verify_account' })
  verifyAccount(
    @Args('verifyAccountInput') verifyAccountInput: VerifyAccountInput,
    @Context('res') response: Response,
  ) {
    return this.authService.verifyAccount(verifyAccountInput, response);
  }

  @Mutation(() => VerifyResponse, { name: 'password_reset_request' })
  passwordResetRequest(@Args('email') email: string) {
    return this.authService.passwordResetRequest(email);
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

  @Query(() => ValidateAuthResponse, { name: 'validate_auth' })
  validateAuth(@Args('refreshToken', { nullable: true }) refreshToken: string) {
    return this.authService.validateAuth(refreshToken);
  }

  @Mutation(() => MessageResponse, { name: 'logout' })
  logout(@Context('req') request: Request, @Context('res') response: Response) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.logout(response, refreshToken);
  }
}
