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
    return this.http.post<OAuthResource>(environment.apiUrl + '/api/login', {
      grant_type: 'password',
      client_id: environment.idClient ,
      client_secret: environment.secretClient ,
      username: '' + username,
      password: '' + password,
      scope: '*'
    });
}


}
