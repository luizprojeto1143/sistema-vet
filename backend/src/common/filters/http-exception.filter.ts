import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // DEBUG: Extract real error details even for unknown exceptions
        const realError = exception as any;
        const debugMessage = realError.message || 'Unknown Error';
        const debugStack = realError.stack || '';

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : { error: 'Internal Server Error', message: debugMessage, stack: debugStack };

        console.error('⚠️ Error:', exception);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message, // Will now contain object with details
        });
    }
}
