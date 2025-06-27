import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
} from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const repsonse = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception?.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError).message;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        break;
      case ThrottlerException:
        status = (exception as ThrottlerException).getStatus();
        message = (exception as any).message;
        break;
      case ValidationError:
        status = (exception as any).status;
        message = (exception as any).response.message;
        break;
      case EntityPropertyNotFoundError:
        status = (exception as any).status;
        message = (exception as any).message;
        break;
      default:
        console.log(exception as any);
        status = (exception as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
        message = (exception as any)?.response?.message || message;
    }

    return repsonse.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
