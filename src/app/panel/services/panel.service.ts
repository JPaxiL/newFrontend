import { Injectable } from '@angular/core';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PanelService {

  options = new Array(
    { id:'GEOPOINTS' , name:"Geopunto"},
    { id:'HISTORIAL' , name:"Historial"},
    { id:'VEHICLES' , name:"Vehículos"},
    { id:'ALERTS', name:"Todas las Alertas"},
    { id:'ALERTS-GPS', name:"Alertas GPS"},
    { id:'ALERTS-GPS-CREATE', name:"Alertas GPS"},
    { id:'ALERTS-PLATFORMS', name:"Alertas Plataforma"},
    { id:'ALERTS-PLATFORM-CREATE', name:"Alertas Plataforma"},
    { id:'ALERTS-ACCESSORIES', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-ACCESSORIE-CREATE', name:"Alertas Seguridad Vehicular"},
    { id:'GEOFENCES', name:"Geocercas"},
    { id:'CIRCULAR-GEOFENCE', name:"Circular Geofences"},
    { id:'POLYLINE-GEOFENCE', name:"Polyline Geofences"},
    { id:'EVENT-USER', name:'Eventos'},
    { id:'USER-CONFIG', name:'Configuración del Usuario'},
    { id:'DASHBOARD', name: 'Dashboard'},
    { id:'AUDITORIA', name: 'Auditoría'},
    { id:'SUBCUENTAS', name: 'Relación de Subcuentas'},
    { id:'DRIVERS', name: 'Relación de Conductores'},

  );

  nombreComponente: string = '';
  nombreCabecera: string = '';
  clasePanelActivo: string = '';

  userData: any; //Informacion del usuario

  constructor(private http: HttpClient) { }

  clickShowPanel( nomComponent:string ){
    console.log("-----clickShowPanel");
    console.log(this.activePanelClass());
    
    if(this.nombreComponente == nomComponent || this.nombreComponente.includes(nomComponent)){

      console.log(nomComponent);
      console.log(this.nombreComponente );
      
      $("#panelMonitoreo").hide( "slow" );
      this.nombreComponente = '';
    } else {
      $("#panelMonitoreo").show( "slow" );
      this.nombreComponente = nomComponent;
      this.clasePanelActivo = this.activePanelClass();
      console.log(this.nombreComponente);

      const item = this.options.filter((item)=> item.id == nomComponent);
      this.nombreCabecera = item[0].name;
    }
  }

  clickHeaderToggle( nomComponent: string){
    this.nombreComponente = nomComponent;
    const item = this.options.filter((item)=> item.id == nomComponent);
    this.nombreCabecera = item[0].name;
  }

  activePanelClass(){
    switch(this.nombreComponente){
      case "VEHICLES":
        return 'vehiculos';
      case "ALERTS":
      case "ALERTS-GPS":
      case "ALERTS-PLATFORMS":
      case "ALERTS-ACCESSORIES":
        return 'alertas';
      case "GEOFENCES":
        return 'geocercas';
      case "CIRCULAR-GEOFENCE":
        return 'circular-geofences';
      case "POLYLINE-GEOFENCE":
        return 'polyline-geofences';
      case "GEOPOINTS":
        return 'geopuntos';
      case "HISTORIAL":
        return 'historial';
      case "EVENT-USER":
        return 'notificaciones';
      case "USER-CONFIG":
        return 'configuracion';
      case "DASHBOARD":
        return 'dashboard';
      case "AUDITORIA":
        return 'auditoria';
      case "SUBCUENTAS":
        return 'subcuentas';
      case "DRIVERS":
        return 'drivers';
      default:
        return '';
    }
  }
  public async activity_logout(user: any){
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/logout`,user).toPromise();
    return response.data;
  }

}
