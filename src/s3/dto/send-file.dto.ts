import { StreamingBlobPayloadInputTypes } from '@smithy/types';

export class SendFileImageDto {
  constructor(payload: SendFileImageDto) {
    Object.assign(this, payload);
  }
  file: StreamingBlobPayloadInputTypes;
  path: 'logos' | 'images';
  fileName: string;
}
