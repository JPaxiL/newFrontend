import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OAuthResource } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  public createToken(
    username: string,
    password: string,
): Observable<OAuthResource> {
    return this.http.post<OAuthResource>(environment.apiUrl+'/oauth/token', {
      grant_type: 'password',
      client_id: '84',
      client_secret: 'LUTj1k8Tley9SvQ1Jwmrha1HPHJs87ShfiQVB18S',
      username: username,
      password: password,
      scope: '*'
    });
}


}
