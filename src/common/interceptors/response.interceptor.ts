import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // exclude url api
    const request: Request = context.switchToHttp().getRequest();
    const excludeRoutes = ['/api/netease/url', '/api/tencent/url'];
    if (excludeRoutes.some((route: string) => request.url.startsWith(route))) {
      return next.handle();
    }

    // wrap response
    return next.handle().pipe(
      map((data: unknown) => {
        return {
          code: HttpStatus.OK,
          message: 'success',
          data: data,
        };
      }),
    );
  }
}
