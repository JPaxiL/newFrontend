import { Injectable, Output, EventEmitter } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userData: any = {};
  showBtnSubcuentas: boolean = false;
  userName: string = '';
  userEmail: string = '';
  userDataInitialized: boolean = false;

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) {}


  getUserData(){
    console.log('Getting User Data');
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: data => {
        //this.userData = this.panelService.userData = data[0];
        console.log('User Data obtenida: ',data[0]);
        this.userData = data[0];
        //this.showBtnSubcuentas = this.userData.privilegios == "subusuario"? false: true;
        this.userName = data[0].nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').replace(/  +/g, ' ').trim();
        this.userEmail = data[0].email;
        this.userDataInitialized = true;
        this.userDataCompleted.emit(true);
        this.geofencesPrivileges.emit(true);
        this.geopointsPrivileges.emit(true);
      },
      error: () => {
        console.log('No se pudo obtener datos del usuario');
      }});
  }
}