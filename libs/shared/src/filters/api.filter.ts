import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(
      `Error ${exception.message} with status ${exception.getStatus()} ${format(new Date(), 'dd.MM.yy HH:mm:ss')}`,
    );

    if (host.getType<string>() === 'graphql') {
      throw new GraphQLError(exception.message, {
        extensions: {
          http: { status: exception.getStatus() },
          timestamp: new Date().toISOString(),
          code: exception.name,
        },
      });
    }

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    }
  }
}
