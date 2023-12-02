import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userData: any = {};
  userName: string = '';
  userEmail: string = '';
  userDataInitialized: boolean = false;
  apiUrl = environment.apiUrl; 
  typeVehicles: any = {};
  typeVehiclesUserData: any = {};

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(private http: HttpClient,) {}

  getUserData(){
    console.log('Getting User Data');
    //tambien llamamos los tipos de vehicles
    this.getTypeVehicles();
    this.getUserConfigData();
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

  getTypeVehicles(): void {
    // console.log('Getting Type Vehicles');
    this.http.get<any>(`${this.apiUrl}/api/typevehicleId`).subscribe({
      next: data => {
        this.typeVehicles = data.data;
      },
      error: (errorMsg) => {
        console.error('Error al obtener IDs de tipos de vehículos:', errorMsg);
      }
    });
  }

  getUserConfigData(): void {
    // return this.http.get<any>(`${this.apiUrl}/api/userdataconfig`);
    this.http.get<any>(`${this.apiUrl}/api/userdataconfig`).subscribe({
      next: data => {
        this.typeVehiclesUserData = data.data;
      },
      error: (errorMsg) => {
        console.error('Error al obtener IDs de tipos de vehículos:', errorMsg);
      }
    });
  }

  updateUserConfig(updatedUserConfig: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/userconfig`, updatedUserConfig);
  }


}