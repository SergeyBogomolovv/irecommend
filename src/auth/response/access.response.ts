import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {
  constructor(payload: AccessTokenResponse) {
    Object.assign(this, payload);
  }
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'токен, в котором закодирована основная инфа о пользователе',
  })
  readonly access_token: string;
}
