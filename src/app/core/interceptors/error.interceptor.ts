import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError } from 'rxjs/operators';
import { LogOut } from '../store/auth.actions';

// @Injectable()
// export class ErrorInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     return next.handle(request);
//   }
// }

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
  ) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     return next.handle(request).pipe(
//      catchError(error => {
//         if (request.url.includes('/auth/token') || error.status !== 401) {
//           return throwError(error);
//         }
//         this.store.dispatch(new LogOut());
//         this.router.navigateByUrl('/auth/login');
//         return throwError(error);
//       //  if (error.status === 401) {
//       //   // remove Bearer token and redirect to login page
//       //    this.router.navigate(['/auth/login']);
//       //  }
//       //  return throwError( error );
//      }));
//  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Ignore non-401 errors in this interceptor
        if (request.url.includes('/auth/token') || error.status !== 401) {
          return throwError(error);
        }

        this.store.dispatch(new LogOut());
        this.router.navigateByUrl('/auth/login');
        return throwError(error);
      }),
    );
  }
}
