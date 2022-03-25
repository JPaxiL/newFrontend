import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OAuthResource } from '../interfaces/User';


// import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
// import * as global from '../globals/globalesVar';
// import { AuthHttp } from 'ng2-bearer';
// import {DataTableModule,SharedModule} from 'primeng/primeng';
// import {AuthenticationService} from './authentication.service';
@Injectable()
export class UserService {

    urlApi : 'localhost' | undefined;
    isAdmin: boolean = false;
    // auth;
    users: any;
    constructor(private http: HttpClient) {
    }
    getUsers(currentPage: string): Observable<OAuthResource> {
      return this.http.get<OAuthResource>(this.urlApi + 'clientes?page='+currentPage);
        // .map(res => res.json());
    }
    showOneUser(id: string){
      return this.http.get(this.urlApi + 'clientes/'+id);
        // .map(res => res.json());
    }
    newUser(user: any){
      return this.http.post(this.urlApi+'users',user);
        // .map(res => res.json());
    }
    deleteUser(user: any){
      return this.http.delete(this.urlApi+'users',user);
        // .map(res => res.json());
    }
    updateUser(user: any){
      ////console.log(user);
      return this.http.put(this.urlApi+'users/'+user.id,user);
        // .map(res => res.json());
    }
    currentUser() {
      return this.http.get(this.urlApi+'currentUser');
        // .map(res => {
        //   if (res.url==this.urlApi+'disabledUser') {
        //     this._auth.logOut();
        //   }
        //     let auth = this.extractData;

        //     return res.json();
        //   });
    }
    getAll(): Observable<OAuthResource>{
      return this.http.get<OAuthResource>(this.urlApi + 'clientes?page=1&per_page=50');
        // .map(res => res.json());
    }
    //falta el search
//    search(currentPage,busquedaNombre,busquedaApellido,busquedaEmpresa,busquedaEmail,busquedaEstadoUsuario,sortby,sortbydesc){
//      if (sortby!='false') {
//        return this.http.get(this.urlApi + 'users?page='+ currentPage+'&nombre='+busquedaNombre+'&apellido='+busquedaApellido+'&nombre_empresa='+busquedaEmpresa+'&correo='+busquedaEmail+'&habilitado='+busquedaEstadoUsuario+'&sort_by='+sortby).map((response: Response) => response.json());

//      }else if (sortbydesc!='false' ){
//       return this.http.get(this.urlApi + 'users?page='+ currentPage+'&nombre='+busquedaNombre+'&apellido='+busquedaApellido+'&nombre_empresa='+busquedaEmpresa+'&correo='+busquedaEmail+'&habilitado='+busquedaEstadoUsuario+'&sort_by_desc='+sortbydesc).map((response: Response) => response.json());
//      }else{
//        return this.http.get(this.urlApi + 'users?page='+ currentPage+'&nombre='+busquedaNombre+'&apellido='+busquedaApellido+'&nombre_empresa='+busquedaEmpresa+'&correo='+busquedaEmail+'&habilitado='+busquedaEstadoUsuario).map((response: Response) => response.json());
//      }

//     }

//     private extractData(response: Response) {
//             let body = response;
//             if (this.auth.admin=="true") {
//               this.isAdmin = true;
//               //Variable LOGIN, si está logueado entonces !userService.isAdmin
//             }else{
//               ////console.log("No tiene permisos");
//             }
//             return body || {};
//         }
}