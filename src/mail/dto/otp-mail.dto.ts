export class OtpMailDto {
  constructor(payload: OtpMailDto) {
    Object.assign(this, payload);
  }
  readonly to: string;
  readonly code: number;
}
