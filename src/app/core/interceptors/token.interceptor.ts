import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     return next.handle(request);
//   }
// }


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const accessToken = this.store.selectSnapshot(AuthState.accessToken);

    if (accessToken && !req.url.includes('auth/token')) {
      const tokenHeader = 'Bearer ' + accessToken;

      req = req.clone({
        setHeaders: {
          Authorization: tokenHeader,
        },
      });
    }

    return next.handle(req);
  }
}