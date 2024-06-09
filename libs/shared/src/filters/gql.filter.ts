import { ExceptionFilter, Catch, HttpException, Logger } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GqlExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GqlExceptionFilter.name);
  catch(exception: HttpException) {
    this.logger.error(
      `Error occured with message: ${exception.message}, with status: ${exception.getStatus()}`,
    );

    throw new GraphQLError(exception.message, {
      extensions: {
        http: { status: exception.getStatus() },
        timestamp: new Date().toISOString(),
        code: exception.name,
      },
    });
  }
}
