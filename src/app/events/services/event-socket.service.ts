import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import * as L from 'leaflet';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EventService } from './event.service';
import { UsersService } from 'src/app/dashboard/service/users.service';
import { AlertService } from 'src/app/alerts/service/alert.service';
@Injectable({
  providedIn: 'root',
})
export class EventSocketService extends Socket {
  img_icon: string = '';
  img_iconSize: any;
  img_iconAnchor: any;
  count : string = '0';
  user_id: any;

  private sendEventSuject = new Subject<any>();
  public sendEventObservable = this.sendEventSuject.asObservable();

  constructor(
    public eventService : EventService,
    private userService : UsersService,
    private AlertService: AlertService,) {
    super({
      url: 'https://socketprueba.glmonitoreo.com/',
      //url: 'http://23.29.124.173',

      // options: {
      //   transports: ["websocket"]
      // }
    });

    this.user_id = localStorage.getItem('user_id');

    //console.log('Panel notif first key on service', this.eventService.panelNotifKey);
  }

  public listen() {
    this.AlertService.getAll();
    console.log('Is Listening');
    //console.log(this.user_id);

    this.ioSocket.on('events', (event: any) => {
      let even = JSON.parse(event);
      if(this.user_id == even.usuario_id){
        //this.count = this.count + 1;

        if(this.eventService.events.findIndex(event => event.id == even.id) == -1 &&
          this.eventService.socketEvents.findIndex(event => event.id == even.id) == -1){
          //Si el evento no existe previamente
          even.evento = even.descripcion_evento;
          even.tipo = even.descripcion_evento;
          if( event.descripcion_evento !='Infraccion' || event.descripcion_evento != 'Infracción'){
            even.fecha_tracker = moment(even.fecha_tracker).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
            even.fecha_minuto = moment(even.fecha_minuto).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
            even.fecha_servidor = moment(even.fecha_servidor).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
          }

          even.imei = even.tracker_imei;

          //Si las alertas ya cargaron
          if(this.AlertService.alertsForEventSocket.length > 0){
            //console.log(this.AlertService.alertsForEventSocket);
            let alert_data = this.AlertService.alertsForEventSocket.find(alert => alert.evento_id == even.evento_id);
            if(typeof alert_data != 'undefined'){
              even['sonido_sistema_bol'] = alert_data.sonido_sistema_bol;
              even['ruta_sonido'] = alert_data.ruta_sonido;
            } else {
              //Sonido por defecto de evento que no corresponde a una alerta
              even['sonido_sistema_bol'] = true;
              even['ruta_sonido'] = 'WhatsappSound9.mp3';
            }
          }

          let newEvent = this.setLayer(even);
          this.eventService.addNewEvent(newEvent);

          this.eventService.new_notif_stack.push(even.id);
          console.log('Nuevo evento ' + new Date() + ': ', even);
          this.eventService.sortEventsTableData();
        } else {
          console.log('Evento duplicado ' + new Date() + ': ', even);
        }

        this.eventService.checkDuplicates();

        //console.log('new notification stack', this.new_notif_stack);
        //console.log('new notification stack counter', this.new_notif_stack.length);
        //console.log('new notification Event Content en Socket', even);
        //console.log('new notification time', new Date());
      }
    });
  }

  public getIcon() {
    // this.img_icon = 'assets/images/eventos/pin_point.svg';
    // this.img_iconSize = [30, 30];
    // this.img_iconAnchor = [0, 30];
  }

  setLayer(event:any){
    let icon = L.icon({
      iconUrl: 'assets/images/eventos/pin_point.svg',
      iconSize: [30,30], // size of the icon
      iconAnchor: [0,30], //[20, 40], // point of the icon which will correspond to marker's location
    });
    event.layer = L.marker([event.latitud, event.longitud], {
      icon: icon,
    });
    event.layer._myType = 'evento';
    event.layer._myId = event.id;
    return event;
  }

}
