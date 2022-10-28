import { Component, Input, OnChanges } from '@angular/core';
import { InfoActivityService } from 'src/app/auditoria/services/info-activity.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-audit-info-activity',
  templateUrl: './audit-info-activity.component.html',
  styleUrls: ['./audit-info-activity.component.scss']
})
export class AuditInfoActivityComponent implements OnChanges {

  @Input() properties: any = {};
  @Input() subject_type: string = "";
  @Input() color: string = "";

  dataResponse_vehicle:any;
  dataResponse_zone:any;
  dataResponse_point:any;
  nombre_visible_punto: boolean = false;
  visible_punto: boolean = false;
  vel_act_zona: boolean = false;
  activo: boolean = false;
  notificacion_email: boolean = false;
  alerta_sistema: boolean = false;
  bol_fijar_tiempo: boolean = false;
  bol_fijar_velocidad: boolean = false;
  placas_vehiculos: string = '';
  nombres_geocercas: string = '';
  nombres_puntos:string = '';

  constructor(private activityService:InfoActivityService,
    private spinner: NgxSpinnerService) { 
      
    }

  ngOnChanges() {

    this.placas_vehiculos = '';
    this.nombres_geocercas = '';

    // this.spinner.show('loadingAlertData');

    let resultado:any = this.properties;

    console.log(resultado);

    if(resultado.visible_punto){

      this.visible_punto = (resultado.visible_punto.toString().trim() === 'true');
    }
    if(resultado.nombre_visible_punto){

      this.nombre_visible_punto = (resultado.nombre_visible_punto.toString().trim() === 'true');
    }
    if(resultado.vel_act_zona){

      this.vel_act_zona = (resultado.vel_act_zona.toString().trim() === 'true');
    }
    if(resultado.activo){

      this.activo = (resultado.activo === 'true');
    }
    if(resultado.notificacion_email){

      this.notificacion_email = (resultado.notificacion_email.toString().trim() === 'true');
    }
    if(resultado.sistema_notificacion){

      let sistema_notificacion_split = resultado.sistema_notificacion.split(',');
      this.alerta_sistema = (sistema_notificacion_split[sistema_notificacion_split.length - 2] === 'true');
    }
    if(resultado.bol_fijar_tiempo){

      this.bol_fijar_tiempo = (resultado.bol_fijar_tiempo.toString().trim() === 'true');
    }
    if(resultado.bol_fijar_velocidad){

      this.bol_fijar_velocidad = (resultado.bol_fijar_velocidad.toString().trim() === 'true');
    }
    if(resultado.imei || resultado.array_trackers){

      let vehiculos = [];

      if(resultado.imei){

        vehiculos = resultado.imei.split(',');
      }

      if(resultado.array_trackers){

        vehiculos = resultado.array_trackers.replace(/[&\/\\#+()$~%.'":*?<>{}]/g,'');
        vehiculos = vehiculos.split(',');
      }

      
      for (let i = 0; i < vehiculos.length; i++) {
        
        
        this.activityService.getDataVehicle(vehiculos[i]).subscribe(response => {

          this.dataResponse_vehicle = response;

          this.placas_vehiculos = this.placas_vehiculos + this.dataResponse_vehicle.data.nombre + ',';
        });
        
      }
    }
    
    if(resultado.array_geo || resultado.array_zonas){

      let geocercas = [];
      
      if(resultado.array_geo){

        geocercas = resultado.array_geo.split(',');
      }

      if(resultado.array_zonas){

        geocercas = resultado.array_zonas.replace(/[&\/\\#+()$~%.'":*?<>{}]/g,"");
        geocercas = geocercas.split(',');
      }

      
      for (let i = 0; i < geocercas.length; i++) {

        this.activityService.getDataZone(geocercas[i]).subscribe(response => {

          this.dataResponse_zone = response;

          this.nombres_geocercas = this.nombres_geocercas + this.dataResponse_zone.data.nombre_zona + ',';

        });
      }

    }

    if(resultado.array_puntos){

      let puntos = resultado.array_puntos.replace(/[&\/\\#+()$~%.'":*?<>{}]/g,"");
      puntos = puntos.split(',');
      
      for (let i = 0; i < puntos.length; i++) {

        this.activityService.getDataPoint(puntos[i]).subscribe(response => {

          this.dataResponse_point = response;

          this.nombres_puntos = this.nombres_puntos + this.dataResponse_point.data.nombre_punto + ',';

        });
      }

    }

  }


}
