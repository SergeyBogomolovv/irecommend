import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  sendLink() {
    return `<div>Go to <a href='https://irecommend.vercel.app'>frontend</a></div>`;
  }
}
