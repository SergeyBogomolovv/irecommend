import { StreamingBlobPayloadInputTypes } from '@smithy/types';

export class UploadImageDto {
  file: StreamingBlobPayloadInputTypes;
  path: 'logos' | 'images';
}
