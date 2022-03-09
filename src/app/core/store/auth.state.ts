import { Injectable } from '@angular/core';

import { State, Selector, StateContext, Action } from '@ngxs/store';
import { AuthService } from '../services/auth.service';
import { LogOut, SignIn, UpdateUser } from './auth.actions';

import { tap } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { OAuthResource } from '../interfaces/User';
import { Observable } from 'rxjs';

export interface AuthStateModel {
  // accessToken?: string;
  access_token: string;
  refresh_token: string;
  user?: User;
  name: string;
  email: string;
  pedro: string;
  expires_in: number;
}

export interface StateModel {
  // accessToken?: string;
  auth: AuthStateModel;
  current: string;
}

@State<AuthStateModel>({
  name: 'auth',
})

@Injectable()
export class AuthState {

  static accessToken(state: StateModel): string{
    return state.auth.access_token;
  }

  static user(state: StateModel): string {
    return state.current;
  }

  // selectors and constructor ommited
  // @Selector()
  static token(state: AuthStateModel): string{
    return state.email;
  }

  // @Selector()
  static userDetails(state: AuthStateModel): string {
    // return {
    //   names: state.name,
    //   email: state.email
    // };
    return state.name;
  }


  constructor(
    private authService: AuthService
  ) { }

  @Action(SignIn)
  SignIn(
    { patchState }: StateContext<AuthStateModel>,
    { name, password }: SignIn,
  ): Observable<OAuthResource> {
    return this.authService
      .createToken(name, password)
      .pipe(
        tap(data => patchState({ access_token: data.access_token })),
        tap(data => patchState({ expires_in: data.expires_in })),
        tap(data => patchState({ refresh_token: data.refresh_token })),
        // tap(({ access_token: access_token }) => patchState({ access_token })),
        // tap(({ expires_in: expires_in }) => patchState({ expires_in })),
        // tap(({ refresh_token: refresh_token }) => patchState({ refresh_token }))
      );
  }

  @Action(UpdateUser)
  public updateUser(
    { patchState }: StateContext<AuthStateModel>,
    { user }: UpdateUser,
  ): void {
    patchState({ user });
  }

  @Action(LogOut)
  LogOut(
    { patchState }: StateContext<AuthStateModel>,
  ): void {}
}
