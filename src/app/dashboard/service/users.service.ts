import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface User {

  name: String;
  email: String;
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<User[]>(environment.apiUrl+`/api/user`);
  }
  public getUsers<User>(currentPage: string) {
    console.log(environment.apiUrl,currentPage);
    return this.http.get<User>(environment.apiUrl + 'clientes?page='+currentPage);
      // .map(res => res.json());
  }

  
}
