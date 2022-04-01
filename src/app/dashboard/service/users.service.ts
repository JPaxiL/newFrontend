import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user:any;
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>( environment.apiUrl + `/api/user`);
  }

  public getUsers(currentPage: string): Observable<User> {
    //console.log(environment.apiUrl , currentPage);
    return this.http.get<User>(environment.apiUrl + 'clientes?page=' + currentPage);
      // .map(res => res.json());
  }

  public async setUserInLocalStorage(){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/user`)
    .toPromise()
    .then( res => {
      localStorage.setItem('user_id',res.data.id)
    });
  }
}
