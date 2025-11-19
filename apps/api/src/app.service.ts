import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'doku-seal-api',
      version: '1.0.0',
    };
  }

  getHello() {
    return {
      message: 'Welcome to Doku-Seal API',
      version: '1.0.0',
      docs: '/api/docs',
    };
  }
}
