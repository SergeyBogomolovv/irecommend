export class RefreshToken {
  constructor(payload: RefreshToken) {
    Object.assign(this, payload);
  }
  exp: Date;
  token: string;
  userId: string;
}
