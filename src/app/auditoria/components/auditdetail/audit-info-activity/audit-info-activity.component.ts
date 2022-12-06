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

  TIMER: number = 3000;

  dataResponse_vehicle:any;
  dataResponse_zone:any;
  dataResponse_point:any;
  dataResponse_driver:any;
  nombre_visible_punto: boolean = false;
  visible_punto: boolean = false;
  vel_act_zona: boolean = false;
  // bol_limite_velocidad_activo: boolean = false;
  relleno: boolean = false;
  activo: boolean = false;
  notificacion_email: boolean = false;
  alerta_sistema: boolean = false;
  bol_fijar_tiempo: boolean = false;
  bol_fijar_velocidad: boolean = false;
  placas_vehiculos: string = '';
  nombres_geocercas: string = '';
  nombres_puntos:string = '';
  tipoVehiculo:any ;
  nombreConductor: string = '';

  types: any = [
    {id: '0', name: 'BUS'},
    {id: '1', name: 'MINIBUS'},
    {id: '2', name: 'VAN'},
    {id: '3', name: 'CAMIONETA'},
    {id: '4', name: 'CONCENTRADO'}
  ];

  constructor(private activityService:InfoActivityService,
    private spinner: NgxSpinnerService) { 
      
    }
  setValues() {

    this.nombre_visible_punto = false;
    this.visible_punto = false;
    this.vel_act_zona = false;
    // this.bol_limite_velocidad_activo = false;
    this.relleno = false;
    this.activo = false;
    this.notificacion_email = false;
    this.alerta_sistema = false;
    this.bol_fijar_tiempo = false;
    this.bol_fijar_velocidad = false;
    this.placas_vehiculos = '';
    this.nombres_geocercas = '';
    this.nombres_puntos = '';
    this.nombreConductor = '';
  }

  ngOnChanges() {

    this.setValues();

    this.placas_vehiculos = '';
    this.nombres_geocercas = '';
    this.TIMER = 3000;

    this.spinner.show('loadingAlertData');

    let resultado:any = this.properties;

    //console.log(resultado);

    if(resultado.visible_punto){

      this.visible_punto = (resultado.visible_punto.toString().trim() === 'true');
    }
    if(resultado.nombre_visible_punto){

      this.nombre_visible_punto = (resultado.nombre_visible_punto.toString().trim() === 'true');
    }
    if(resultado.vel_act_zona){

      this.vel_act_zona = (resultado.vel_act_zona.toString().trim() === 'true');
    }
    // if(resultado.bol_limite_velocidad_activo){

    //   this.bol_limite_velocidad_activo = (resultado.bol_limite_velocidad_activo.toString().trim() === 'true');
    // }
    if(resultado.bol_sin_relleno){

      this.relleno = (resultado.bol_sin_relleno.toString().trim() === 'true');
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

          this.placas_vehiculos = this.placas_vehiculos + this.dataResponse_vehicle.data.nombre + ', ';

        });
        
      }

      this.TIMER += 3000;
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

          this.nombres_geocercas = this.nombres_geocercas + this.dataResponse_zone.data.nombre_zona + ', ';

        });
      }

      this.TIMER += 3000;

    }

    if(resultado.array_puntos){

      let puntos = resultado.array_puntos.replace(/[&\/\\#+()$~%.'":*?<>{}]/g,"");
      puntos = puntos.split(',');
      
      for (let i = 0; i < puntos.length; i++) {

        this.activityService.getDataPoint(puntos[i]).subscribe(response => {

          this.dataResponse_point = response;

          this.nombres_puntos = this.nombres_puntos + this.dataResponse_point.data.nombre_punto + ', ';

        });
      }

      this.TIMER += 3000;

    }
    
    if(resultado.tipo){
      this.tipoVehiculo = this.types.find((obj: { id: number; }) => {
        return obj.id === resultado.tipo;
      });

      this.tipoVehiculo = Object.values(this.tipoVehiculo)[1];

    }

    if(resultado.id_conductor){

      this.activityService.getDataDriver(resultado.id_conductor).subscribe(response => {

        this.dataResponse_driver = response;

        this.nombreConductor = this.dataResponse_driver.data.nombre_conductor;

      });

      this.TIMER += 2000;
    }

    setTimeout(() => {
      this.spinner.hide('loadingAlertData');
    }, this.TIMER);
  }

  

}
