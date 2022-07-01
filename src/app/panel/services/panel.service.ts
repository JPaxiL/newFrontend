import { Injectable } from '@angular/core';

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
    { id:'ALERTS-ACCESSORIES', name:"Alertas Accesorios"},
    { id:'ALERTS-ACCESSORIE-CREATE', name:"Alertas Accesorios"},
    { id:'GEOFENCES', name:"Geocercas"},
    { id:'EVENT-USER', name:'Eventos'},
    { id:'USER-PREFERENCES', name:'Preferencias'},
    { id:'CRED-CONFIG', name:'Configuración de Perfil'},
  );

  nombreComponente: string = '';
  nombreCabecera: string = '';

  constructor() { }

  clickShowPanel( nomComponent:string ){
    if(this.nombreComponente == nomComponent || this.nombreComponente.includes(nomComponent)){
      $("#panelMonitoreo").hide( "slow" );
      this.nombreComponente = '';
    } else {
      $("#panelMonitoreo").show( "slow" );
      this.nombreComponente = nomComponent;
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
}
