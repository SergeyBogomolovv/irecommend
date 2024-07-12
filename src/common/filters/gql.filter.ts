import { ExceptionFilter, Catch, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class GqlExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GqlExceptionFilter.name);
  catch(exception: HttpException) {
    this.logger.error(
      `Error occured with message: ${exception.message}, with status: ${exception.getStatus()}`,
    );
    throw new HttpException(
      {
        message: exception.message,
        timestamp: new Date().toISOString(),
        statusCode: exception.getStatus(),
      },
      exception.getStatus(),
    );
  }
}
