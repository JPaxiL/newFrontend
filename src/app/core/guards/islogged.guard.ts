import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root'
})
/* export class IsloggedGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
} */


export class IsLoggedGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store,
    // private userService: UserService,
    private http: HttpClient
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const accessToken = this.store.selectSnapshot(AuthState.accessToken);
    if (!!accessToken) {
      // this.router.navigateByUrl('/auth/login');
      
      this.router.navigate(['/panel']);
      return false;
    }
    if (!this.store.selectSnapshot(AuthState.user)) {
      return true;
    }
    return true;
  }
}
