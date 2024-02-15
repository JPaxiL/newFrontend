import { Injectable, Output, EventEmitter, ElementRef  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  svgContents: { [key: string]: string } = {}; // Almacena los contenidos de los SVG
  svgContentsSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG
  svgContentsGreenSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG
  svgContentsBlueSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG
  svgContentsRedSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG

  userData: any = {};
  userName: string = '';
  userEmail: string = '';
  companyName: string = '';
  userDataInitialized: boolean = false;
  userConfigDataInitialized: boolean = false;
  apiUrl = environment.apiUrl; 
  typeVehicles: any = {};
  typeVehiclesUserData: any = {};
  changeItemIcon :string = '';

  reportsUser : any;
  eventsUser : any;
  reportsUserLoaded: boolean = false;  

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(private http: HttpClient,private sanitizer: DomSanitizer,public spinner: NgxSpinnerService) {}

  getUserData(){
    console.log('USER DATA SERVICE LOADING');
    //tambien llamamos los tipos de vehicles
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: async data => {
        //this.userData = this.panelService.userData = data[0];
        console.log('User Data Info ->: ',data);
        // console.log('User Data obtenida ======> ',  data.data);
        // console.log('User VEHICLES obtenida ======> ',  data.data2);
        // console.log('User CONFIG DATA obtenida ======> ',  data.data3);
        this.typeVehicles = await data.data2;
        this.typeVehiclesUserData = await data.data3;
        this.userData = await data.data;
        this.userName = data.data.nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').replace(/  +/g, ' ').trim();
        this.userEmail = data.data.var_email;
        this.companyName = data.data.var_nombre_comercial; //Otro var_razon_social 
        this.userDataInitialized = true;
        this.spinner.hide('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner
        this.changeItemIcon = this.getChangeItemColor();
        console.log('USER DATA SERVICE LOADED')
        this.userDataCompleted.emit(true);
        this.geofencesPrivileges.emit(true);
        this.geopointsPrivileges.emit(true);
      },
      error: (errorMsg) => {
        console.log('No se pudo obtener datos del usuario', errorMsg);
      }});
  }


  public getReportsForUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/getPermissReports`);
  }

  updateUserConfig(updatedUserConfig: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/userconfig`, updatedUserConfig);
  } 
  changePasswordUser(infoUser: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/changePassword`, infoUser);
  } 

  get firstLetter(){
    let letter = this.userName.charAt(0);
    if(letter === letter.toLowerCase()){
      return letter.toUpperCase();
    }else{
      return letter;
    }
  }

  //FUNCION PARA SABER SI EL VEHICULO CAMBIA ESTADO O NO
  getChangeItemColor(){
    if (this.userData.bol_ondas){
      return 'ondas';
    }else if (this.userData.bol_vehicle){
      return 'vehicles';
    }else if (this.userData.bol_cursor){
      return 'cursor';
    }else{
      return '';
    }
  }

}