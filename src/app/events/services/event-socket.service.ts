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

@Injectable({
  providedIn: 'root',
})
export class EventSocketService extends Socket {
  img_icon: string = '';
  img_iconSize: any;
  img_iconAnchor: any;
  count: string = '0';
  user_id: any;
  data_debug!: any;

  private sendEventSuject = new Subject<any>();
  public sendEventObservable = this.sendEventSuject.asObservable();
  public eventPopup: EventEmitter<any> = new EventEmitter<any>(undefined);
  constructor(
    public eventService: EventService,
    public vehicleService: VehicleService,
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
  public debug(imei: string) {
    // console.log("desde event socket | debug imei:",imei);
    let data = {
      imei: imei
    };
    this.ioSocket.emit('status-imei',data);

  }
  public listen() {
    console.log("listen ...");

    this.AlertService.getAll();
    console.log('Is Listening', this.vehicleService.vehicles);
    //console.log(this.user_id);
    // this.filterImei(this.vehicleService.vehicles);
    this.ioSocket.on('res', (info: any) => {
      console.log("res",info);
      // this.data_debug = info.data;
      this.eventService.debugEventStream.emit(info);
    });
    this.ioSocket.on('events', (event: any, users: any) => {
      // console.log("users",users); // filtrar por usuario cuando este listo el modulo
      // console.log("recibiendo evento........",this.vehicleService.vehicles);
      // return;
      // let even = JSON.parse(event);
      console.log("Nuevo evento llegado: ", event);
      
      let even = event;

      // console.log(' getAlertById =====> ', this.AlertService.getAlertById(even.id), this.user_id, even.usuario_id);
      // console.log("this.vehicleService.vehicles,even.tracker_imei ========> ", this.vehicleService.vehicles,even.tracker_imei);
      console.log("EVENT User ID",this.user_id);
      console.log("users.indexOf(parseInt(this.user_id))",users.indexOf(parseInt(this.user_id)));
      if(users.indexOf(parseInt(this.user_id))>=0){
        //this.count = this.count + 1;
        let data = this.filterImei(this.vehicleService.vehicles, even.tracker_imei);
        // console.log("this.vehicleService.vehicles ----->", this.vehicleService.getVehicle(even.tracker_imei));
        // if(this.filterImei(this.vehicleService.vehicles,even.tracker_imei)){
        console.log("----data",data);
        if (data != undefined) {
          // console.log("name ====",data.name);
          even.nombre_objeto = data.name;
          // if(this.eventService.events.findIndex(event => event.event_id == even.event_id) == -1 &&
          //   this.eventService.socketEvents.findIndex(event => event.event_id == even.event_id) == -1){
          //Si el evento no existe previamente
          even.evento = even.descripcion_evento;
          even.tipo = even.descripcion_evento;
          if (event.descripcion_evento != 'infraccion' || event.descripcion_evento != 'infracción') {
            even.fecha_tracker = moment(even.fecha_tracker).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
            even.fecha_minuto = moment(even.fecha_minuto).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
            even.fecha_servidor = moment(even.fecha_servidor).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
          }

          even.imei = even.tracker_imei;
          console.log("----even",even);
          console.log("----this.AlertService.alertsForEventSocket.length",this.AlertService.alertsForEventSocket.length);

          //Si las alertas ya cargaron
          if (this.AlertService.alertsForEventSocket.length > 0) {
            //console.log(this.AlertService.alertsForEventSocket);
            let alert_data = this.AlertService.alertsForEventSocket.find(alert => alert.evento_id == even.evento_id);
            if (typeof alert_data != 'undefined') {
              even['sonido_sistema_bol'] = alert_data.sonido_sistema_bol;
              even['ruta_sonido'] = alert_data.ruta_sonido;
            } else {
              //Sonido por defecto de evento que no corresponde a una alerta
              even['sonido_sistema_bol'] = true;
              even['ruta_sonido'] = 'WhatsappSound9.mp3';
            }
          }
          
          let newEvent = this.setLayer(even);
          console.log("----newEvent",newEvent);
          this.eventService.addNewEvent(newEvent);

          this.eventService.new_notif_stack.push(even.evento_id);
          this.eventService.sortEventsTableData();

          let alert = this.AlertService.getAlertById(even.evento_id);
          console.log("----alert",alert);

          if (alert) {
            console.log("----alert.ventana_emergente",alert.ventana_emergente);
            if (alert.ventana_emergente) {
              this.eventPopup.emit({event: {...newEvent}, tracker: {...this.vehicleService.getVehicle(even.tracker_imei)}})
              //this.popupService.createPopup(newEvent, this.vehicleService.getVehicle(even.tracker_imei));
            }
          }
        } else {
          //console.log('Evento duplicado ' + new Date() + ': ', even);
        }

        // this.eventService.checkDuplicates(); // deprecado se controla desde el server
      }else{
        console.log("evento no pertenece al usuario ...");
        //console.log("event-->",event);
        //console.log("users-->",users);
      }
    });
  }

  private filterImei(data: any, imei: any) {
    // console.log("imei",imei);
    for (const index in data) {
      // console.log("IMEI",data[index].IMEI);
      if (String(data[index].IMEI) == String(imei)) {

        console.log("return true");
        return data[index];
      }
    }
    console.log("return false");
    return undefined;

  }
  public getIcon() {
    // this.img_icon = 'assets/images/eventos/pin_point.svg';
    // this.img_iconSize = [30, 30];
    // this.img_iconAnchor = [0, 30];
  }

  setLayer(event: any) {
    let icon = L.icon({
      iconUrl: 'assets/images/eventos/pin_point.svg',
      iconSize: [30, 30], // size of the icon
      iconAnchor: [0, 30], //[20, 40], // point of the icon which will correspond to marker's location
    });
    event.layer = L.marker([event.latitud, event.longitud], {
      icon: icon,
    });
    event.layer._myType = 'evento';
    event.layer._myId = event.id;
    return event;
  }

}
