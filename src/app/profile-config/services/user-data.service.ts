import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  svgContents: { [key: string]: string } = {}; // Almacena los contenidos de los SVG

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
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: async data => {
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
        await this.getTypeVehicles();
        await this.getUserConfigData();

      },
      error: (errorMsg) => {
        console.log('No se pudo obtener datos del usuario', errorMsg);
      }});
  }

  async getTypeVehicles(): Promise<void> {
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

  async getUserConfigData(): Promise<void> {
    // return this.http.get<any>(`${this.apiUrl}/api/userdataconfig`);
    this.http.get<any>(`${this.apiUrl}/api/userdataconfig`).subscribe({
      next: async data => {
        this.typeVehiclesUserData = data.data;
        await this.preloadSVGs();
      },
      error: (errorMsg) => {
        console.error('Error al obtener IDs de tipos de vehículos:', errorMsg);
      }
    });
  }

  updateUserConfig(updatedUserConfig: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/userconfig`, updatedUserConfig);
  } 

  //PARA ICONOS SVG PRELOAD
  async preloadSVGs(): Promise<void> {
    console.log('INICIANDO Preload SVGS ...');
    let svgNames: string[] = this.typeVehiclesUserData.map((vehicle: any) => vehicle.var_icono);
    if (!svgNames.length || !this.typeVehiclesUserData.length){
      svgNames = this.typeVehicles.map((vehicle: any) => vehicle.var_icono);
    }
    svgNames.forEach(async (svgName) => {
      const svgPath = `assets/images/objects/nuevo/${svgName}`;
      const svgContent = await this.http.get(svgPath, { responseType: 'text' }).toPromise();
      this.svgContents[svgName] = svgContent;
      // console.log(`Contenido de ${svgName}:`, svgContent); // Mostrar contenido del SVG cargado en la consola
    });
  }
  
  

  getSVGContent(svgName: string): string {
    return this.svgContents[svgName] || ''; // Retorna el contenido del SVG, si está cargado
  }

  async colorTypeVehicleDefault(typeVehicleId: string): Promise<string> {
    const vehiculoEncontrado = this.typeVehiclesUserData.find((vehiculo: { type_vehicle_id: any; }) => vehiculo.type_vehicle_id == typeVehicleId);
    let var_icono;
    let var_color;

    if (vehiculoEncontrado) {
      var_icono = vehiculoEncontrado.var_icono;
      var_color = vehiculoEncontrado.var_color;
    } else {
      // console.log('NO ENCONTRO EL ICONO ...');
      const vehicleInTypeVehicles = this.typeVehicles.find((vh: { id: any; }) => vh.id == typeVehicleId);
      var_icono = vehicleInTypeVehicles.var_icono;
      var_color = '#c3c4c4';
      // console.log(var_icono,var_color);
    }

    const svgContent = this.getSVGContent(var_icono);
    return this.modifySVGColor(svgContent, var_color,var_icono);
  }

  modifySVGColor(svgContent: string, color: string,var_icono:string): string {
    const div = document.createElement('div');
    div.innerHTML = svgContent;
    // console.log('ANTES ......',div.innerHTML);
    // Obtener el elemento específico que deseas cambiar
    //POR DEFECTO SOLO SE DEBERA MODIFICAR LA CLASE BODY
    if (color != '#c3c4c4'){
      let bodyElements: NodeListOf<HTMLElement>;
      if (var_icono == 'carga.svg') {
        bodyElements = div.querySelectorAll('.cls-4') as NodeListOf<HTMLElement>;
        // console.log('Se ecnontra una carga.svg -->',div.innerHTML);
      } else {
        bodyElements = div.querySelectorAll('.body') as NodeListOf<HTMLElement>;
      }
      // Cambiar el color del elemento
      bodyElements.forEach((bodyElement: HTMLElement) => {
        bodyElement.style.fill = color;
      });
    }
    
    // console.log('DIV.innerHTML ---> -->',div.innerHTML);
    // Devolver el SVG modificado
    // console.log('DESPUEs ......',div.innerHTML);

    return div.innerHTML;
  }


}
