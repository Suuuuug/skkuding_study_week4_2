// http-exception.filter.ts
import { 
    ExceptionFilter, 
    Catch, 
    ArgumentsHost, 
    HttpException, 
    HttpStatus 
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = 
            exception instanceof HttpException
                ? exception.getResponse()
                : { error: '서버 오류가 발생했습니다.' };

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            error: message,
        });
    }
}