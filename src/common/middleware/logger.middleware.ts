import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const requestId = uuidv4();

    req['requestId'] = requestId;

    this.logger.log(
      `[${requestId}] ${req.method} ${req.originalUrl} - ${req.ip} - User-Agent: ${req.get('User-Agent')}`
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const logLevel = statusCode >= 400 ? 'error' : 'log';

      this.logger[logLevel](
        `[${requestId}] ${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms`
      );
    });

    next();
  }
}
