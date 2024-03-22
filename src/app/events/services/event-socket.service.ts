import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import * as L from 'leaflet';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EventService } from './event.service';
import { VehicleService } from '../../vehicles/services/vehicle.service';
import { UsersService } from 'src/app/dashboard/service/users.service';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { PopupService } from './popup.service';
import { DriversService } from 'src/app/drivers/services/drivers.service';
import { getIconUrlHistory } from '../helpers/event-helper';
import { Evaluation } from 'src/app/alerts/models/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class EventSocketService extends Socket {
  img_icon: string = '';
  img_iconSize: any ;
  img_iconAnchor: any = [14, 0];
  count: string = '0';
  user_id: any;
  data_debug!: any;

  private sendEventSuject = new Subject<any>();
  public sendEventObservable = this.sendEventSuject.asObservable();
  public eventPopup: EventEmitter<any> = new EventEmitter<any>(undefined);
  constructor(
    public eventService: EventService,
    public vehicleService: VehicleService,
    public driverService: DriversService,
    private AlertService: AlertService) {
    super({
      url: environment.socketEvent,
      //url: 'http://23.29.124.173',
      options: {
        query: {
          userId: localStorage.getItem('user_id'),
          secret: environment.secretClient,
        },
      },
    });

    // this.ioSocket.on('res', (info: any) => {
    //   console.log("info XD");
    //   // console.log("res ....",info);
    // });

    this.user_id = localStorage.getItem('user_id');

    //console.log('Panel notif first key on service', this.eventService.panelNotifKey);
  }
  initializeSocket(userId: string): void {
    if (this.ioSocket.connected) {
      this.ioSocket.disconnect();
    }
    this.user_id = userId;
    this.ioSocket.io.opts.query.userId = userId;
    this.ioSocket.connect();
  }
  public debug(imei: string) {
    // console.log("desde event socket | debug imei:",imei);
    let data = {
      imei: imei
    };
    this.ioSocket.emit('status-imei',data);

  }
  public evaluationEmit (info: any){
    this.ioSocket.emit('event-evaluation',info);
  }
  public listen() {
    this.AlertService.getAll();

    this.socketOnRes();
    this.socketOnEvents();
    this.socketOnEvaluation();

  }

  public socketOnEvaluation () {
    this.ioSocket.on('event-evaluation', (info: any) => {
      // console.log("info evaluation -----> ", info);
      this.eventService.evaluationEventStream.emit(info);
    })
  }
  public socketOnEvents () {
    this.ioSocket.on('events', (event: any, users: any) => {

      console.log("Nuevo evento llegado: ", event);

      console.log("EVENT User ID",this.user_id);
      console.log("users",users)
      if(users.indexOf(parseInt(this.user_id))>=0){
        let vehicle = this.vehicleService.getVehicleStatus(event.tracker_imei);
        // console.log("vehicle",vehicle);
        if (vehicle.status) {
          event = this.formatEvent(event, vehicle.data);

          this.eventService.addNewEvent(event);

          this.eventService.new_notif_stack.push(event.evento_id);
          this.eventService.sortEventsTableData();


        } else {
          console.log("vehiculo no existe para este usuario");
          // vehiculo no existe para el usuario
        }

        // this.eventService.checkDuplicates(); // deprecado se controla desde el server
      }else{
        console.log("evento no pertenece al usuario ...");
        //console.log("event-->",event);
        //console.log("users-->",users);
      }
    });
  }
  public formatEvent (event: any, vehicle: any): any {
    console.log("format vehicle:",vehicle.name );
    event.imei = event.tracker_imei;
    event.nombre_objeto = vehicle.name; // add code vehicle to events
    event.namedriver = this.driverService.getDriverById(event.driver_id);// <------- MODIFICAR CUANDO CONDUCTORES SERVICE EXISTA
    event.evento = event.descripcion_evento;
    event.tipo = event.descripcion_evento;

    if (event.descripcion_evento != 'infraccion' || event.descripcion_evento != 'infracción') {
      event.fecha_tracker = moment(event.fecha_tracker).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
      event.fecha_minuto = moment(event.fecha_minuto).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
      event.fecha_servidor = moment(event.fecha_servidor).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
    }

    //Si las alertas ya cargaron
    if (this.AlertService.alertsForEventSocket.length > 0) event = this.setAlert(event, vehicle);

    event = this.setLayer(event);

    if (event.bol_evaluation) {
      event.evaluations = [
        {
          event_id: event.evento_id,
          usuario_id: event.usuario_id,
          imei: event.imei,
          fecha: event.fecha_tracker,
          nombre: event.nombre_objeto,
          tipo_evento: event.name,
          uuid_event: event.uuid_event,
          criterio_evaluacion: '',
          identificacion_video: '',
          valoracion_evento: '0',
          observacion_evaluacion: '',
          senales_posible_fatiga: false,
          operador_monitoreo: '',
        } as Evaluation,
      ];
    }

    return event;
  }
  public socketOnRes(){
    this.ioSocket.on('res', (info: any) => {
      console.log("res",info);
      // this.data_debug = info.data;
      this.eventService.debugEventStream.emit(info);
    });
  }
  // public socketOnEventEvaluation(){
  //   this.ioSocket.on('event-evaluation', (uuid: any) => {
  //     /*
  //       espero recibir
  //       {
  //         event_id: 123,
  //         value: 1;
  //       }
  //     */
  //     console.log("event-evaluation",uuid);
  //     this.eventService.evaluationEventStream.emit(uuid);
  //   })
  // }
  private setAlert(event: any, vehicle: any) {


    let alert_data = this.AlertService.alertsForEventSocket.find(alert => alert.evento_id == event.evento_id);
    console.log("ALERTA CORRESPONDIENTE::::", alert_data);

    if (typeof alert_data != 'undefined') {
      event['sonido_sistema_bol'] = alert_data.sonido_sistema_bol;
      event['ruta_sonido'] = alert_data.ruta_sonido;
    } else {
      //Sonido por defecto de evento que no corresponde a una alerta
      event['sonido_sistema_bol'] = true;
      event['ruta_sonido'] = 'WhatsappSound9.mp3';
    }

    let alert = this.AlertService.getAlertById(event.evento_id);

    if (alert) {
      if (alert.ventana_emergente?.toLowerCase() == 'true') {
        this.eventPopup.emit({event: {...event}, tracker: {...vehicle.data}})
      }
    }

    return event;
  }

  private setLayer(event: any) {
    const iconUrl = getIconUrlHistory(event);
    let icon = L.icon({
      iconUrl: iconUrl,
      iconSize: [30, 30], // size of the icon
      iconAnchor: [14, 0], //[20, 40], // point of the icon which will correspond to marker's location
    });
    event.layer = L.marker([event.latitud, event.longitud], {
      icon: icon,
    });
    event.layer._myType = 'evento';
    event.layer._myId = event.id;
    return event;
  }

}
