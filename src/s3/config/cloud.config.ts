import { registerAs } from '@nestjs/config';

export default registerAs('cloud', () => {
  return {
    region: process.env.YANDEX_REGION,
    endpoint: process.env.YANDEX_ENDPOINT,
    credentials: {
      accessKeyId: process.env.YANDEX_ACCESS,
      secretAccessKey: process.env.YANDEX_SECRET,
    },
  };
});
