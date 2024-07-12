export class UserJwtPayload {
  constructor(payload: UserJwtPayload) {
    Object.assign(this, payload);
  }
  readonly id: string;
}
