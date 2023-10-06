import { Injectable, Output, EventEmitter } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userData: any = {};
  userName: string = '';
  userEmail: string = '';
  userDataInitialized: boolean = false;

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(private http: HttpClient,) {}
  private api_url = environment.apiUrl;


  getUserData(){
    console.log('Getting User Data');
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: data => {
        //this.userData = this.panelService.userData = data[0];
        //console.log('User Data obtenida: ',data[0]);
        console.log('User Data obtenida ======> ',  data.data);
        this.userData = data.data;
        this.userName = data.data.nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').replace(/  +/g, ' ').trim();
        this.userEmail = data.data.email;
        this.userDataInitialized = true;
        this.userDataCompleted.emit(true);
        this.geofencesPrivileges.emit(true);
        this.geopointsPrivileges.emit(true);
      },
      error: (errorMsg) => {
        console.log('No se pudo obtener datos del usuario', errorMsg);
      }});
  }
  changeColor(color: string){
    
  }
  putConfig(vehicle: any): Observable<any>{
    return this.http.put(this.api_url+"/api/tracker/"+vehicle.IMEI,vehicle);
  }
}