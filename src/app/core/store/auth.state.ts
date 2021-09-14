import { Injectable } from "@angular/core";

import { State, Selector, StateContext, Action } from '@ngxs/store';
import { AuthService } from "../services/auth.service";
import { SignIn, UpdateUser } from "./auth.actions";

import { tap } from 'rxjs/operators';
import { User } from "../interfaces/User";



export interface AuthStateModel {
    // accessToken?: string;
    access_token?: string;
    refresh_token: string;
    user?: User;
    name: String;
    email: String;
    pedro: string;
    expires_in: number;
  }
  
  @State<AuthStateModel>({
    name: 'auth',
  })

  @Injectable()
  export class AuthState {

    static accessToken(state: any) {
      return state.auth.access_token;
    }

    static user(state: any) {
      return state.current;
    }

    // selectors and constructor ommited
    // @Selector()
    static token(state: AuthStateModel) {
      return state.email;
    }
  
    // @Selector()
    static userDetails(state: AuthStateModel) {
      return {
        namess: state.name,
        emaila: state.email
      };
    }

    constructor(private authService: AuthService) {}
    
    @Action(SignIn)
    SignIn(
      { patchState }: StateContext<AuthStateModel>,
      { name, password }: SignIn,
    ) {
      return this.authService
        .createToken(name, password)
        .pipe(
          tap(({ access_token: access_token }) => patchState({ access_token })),
          tap(({ expires_in: expires_in }) => patchState({ expires_in })),
          tap(({ refresh_token: refresh_token }) => patchState({ refresh_token })),
          
        );
    }
  
    @Action(UpdateUser)
    public updateUser(
      { patchState }: StateContext<AuthStateModel>,
      { user }: UpdateUser,
    ) {
      patchState({ user });
    }
  }