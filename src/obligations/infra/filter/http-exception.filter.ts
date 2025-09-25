import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '../module/config/service/config.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const isProduction = this.configService.get('env') === 'production';

    response.status(status).json(
      isProduction
        ? {
            statusCode: status,
            message: exception.message,
          }
        : {
            statusCode: status,
            message: exception.message,
            path: request.url,
            stack: exception.stack,
          },
    );
  }
}
