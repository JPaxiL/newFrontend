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
    { id:'ALERTS-GPS', name:"Alertas GPS Tracker"},
    { id:'ALERTS-GPS-CREATE', name:"Alertas GPS Tracker"},
    { id:'ALERTS-PLATFORMS', name:"Alertas Plataforma"},
    { id:'ALERTS-PLATFORM-CREATE', name:"Alertas Plataforma"},
    { id:'ALERTS-ACCESSORIES', name:"Alertas 360"},
    { id:'ALERTS-ACCESSORIE-CREATE', name:"Alertas 360"},
    { id:'ALERTS-SECURITY', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-SECURITY-CREATE', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-SECURITY-EDIT', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-MOBILE', name:"Alertas Soluciones Móviles"},
    { id:'ALERTS-MOBILE-CREATE', name:"Alertas Soluciones Móviles"},
    { id:'ALERTS-MOBILE-EDIT', name:"Alertas Soluciones Móviles"},
    { id:'ALERTS-360', name:"Alertas Fatiga 360"},
    { id:'ALERTS-360-CREATE', name:"Alertas Fatiga 360"},
    { id:'ALERTS-360-EDIT', name:"Alertas Fatiga 360"},
    { id:'GEOFENCES', name:"Geocercas"},
    { id:'CIRCULAR-GEOFENCE', name:"Circular Geofences"},
    { id:'POLYLINE-GEOFENCE', name:"Polyline Geofences"},
    { id:'EVENT-USER', name:'Eventos'},
    { id:'USER-CONFIG', name:'Configuración del Usuario'},
    { id:'DASHBOARD', name: 'Dashboard'},
    { id:'AUDITORIA', name: 'Auditoría'},
    { id:'SUBCUENTAS', name: 'Relación de Subcuentas'},
    { id:'DRIVERS', name: 'Relación de Conductores'},
    { id:'MULTIVIEW', name: 'Multiples pantallas'},

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

      //console.log(nomComponent);
      //console.log(this.nombreComponente );

      $("#panelMonitoreo").hide( "slow" );
      this.nombreComponente = '';
    } else {
      $("#panelMonitoreo").show( "slow" );
      this.nombreComponente = nomComponent;
      this.clasePanelActivo = this.activePanelClass();
      //console.log(this.nombreComponente);

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
      case "ALERTS-SECURITY":
      case "ALERTS-MOBILE":
      case "ALERTS-360":
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
      case "MULTIVIEW":
        return 'multiview';
      default:
        return '';
    }
  }

  getComponentNameFromPanelName(panelActive:string){
    switch(panelActive){
      case "vehiculos":
        return 'VEHICLES';
      case "alertas":
        return 'ALERTS';
      case "geocercas":
        return 'GEOFENCES';
      case "circular-geofences":
        return 'CIRCULAR-GEOFENCE';
      case "polyline-geofences":
        return 'POLYLINE-GEOFENCE';
      case "geopuntos":
        return 'GEOPOINTS';
      case "historial":
        return 'HISTORIAL';
      case "notificaciones":
        return 'EVENT-USER';
      case "configuracion":
        return 'USER-CONFIG';
      case "dashboard":
        return 'DASHBOARD';
      case "auditoria":
        return 'AUDITORIA';
      case "subcuentas":
        return 'SUBCUENTAS';
      case "drivers":
        return 'DRIVERS';
      case "multiview":
        return 'MULTIVIEW';
      default:
        return '';
    }
  }

  public async activity_logout(user: any){
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/logout`,user).toPromise();
    return response.data;
  }

}
