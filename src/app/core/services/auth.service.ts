import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



export interface OAuthResource {
//  stripe_publishable_key?: string;


  access_token: string,
  expires_in: number,
  refresh_token: string,
  token_type: string,
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  public createToken(
    username: string,
    password: string,
): Observable<OAuthResource> {
  //return this.http.post<OAuthResource>('http://127.0.0.1:8001/api/auth/token', {
    return this.http.post<OAuthResource>('http://localhost:8001/oauth/token', {
      grant_type: 'password',
      client_id: '4',
      client_secret: 'IrptwYaLS29MpLhzGrj7rDLKBf1EViDVvAGSlJqN',
      username: username,
      password: password,
      scope: '*'
    });
}

  
}
