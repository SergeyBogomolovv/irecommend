import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  constructor(payload: MessageResponse) {
    Object.assign(this, payload);
  }
  @ApiProperty({
    example: 'Сообщение с информацией',
  })
  message: string;
}
