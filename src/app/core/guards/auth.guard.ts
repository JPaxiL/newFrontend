import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/User';
// import { UserService } from '../services/users.service';
import { UpdateUser } from '../store/auth.actions';
import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root'
})
// export class AuthGuard implements CanActivate {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return true;
//   }
// }


export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store,
    // private userService: UserService,
    private http: HttpClient
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    { url }: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const accessToken = this.store.selectSnapshot(AuthState.accessToken);

    if (!accessToken) {
      // this.router.navigateByUrl('/auth/login');
      this.router.navigateByUrl('/');
      return false;
    }

    if (!!this.store.selectSnapshot(AuthState.user)) {
      return true;
    }

    return true;
    // return this.userService.current().pipe(
    // return this.http.get('hol').pipe(
    //   map((user: any) => {
    //     this.store.dispatch(new UpdateUser(user));
    //     return true;
    //   }),
    //   catchError(() => of(false)),
    // );
  }
}
