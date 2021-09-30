import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>( environment.apiUrl + `/api/user`);
  }

  public getUsers(currentPage: string): Observable<User> {
    console.log(environment.apiUrl , currentPage);
    return this.http.get<User>(environment.apiUrl + 'clientes?page=' + currentPage);
      // .map(res => res.json());
  }
}
