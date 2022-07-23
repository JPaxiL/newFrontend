import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import * as L from 'leaflet';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EventService } from './event.service';
import { UsersService } from 'src/app/dashboard/service/users.service';
@Injectable({
  providedIn: 'root',
})
export class EventSocketService extends Socket {
  img_icon: string = '';
  img_iconSize: any;
  img_iconAnchor: any;
  count : string = '0';
  new_notif_stack: number[] = [];
  user_id: any;

  private sendEventSuject = new Subject<any>();
  public sendEventObservable = this.sendEventSuject.asObservable();

  constructor(public eventService : EventService, private userService : UsersService) {
    super({
      url: 'https://socketprueba.glmonitoreo.com/',
      // options: {
      //   transports: ["websocket"]
      // }
    });

    this.user_id = localStorage.getItem('user_id');

    this.eventService.panelNotifKey = + new Date();
    console.log('Panel notif first key on service', this.eventService.panelNotifKey); 
    console.log('Panel notif first key on service', new Date ( + this.eventService.panelNotifKey)); 
  }

  public listen() {

    this.ioSocket.on('events', (event: any) => {
      let even = JSON.parse(event);
      if(this.user_id == even.usuario_id){
        //this.count = this.count + 1;

        even.evento = even.descripcion_evento;
        even.tipo = even.descripcion_evento;
        if( event.descripcion_evento !='Infraccion' || event.descripcion_evento != 'Infracción'){
          even.fecha_tracker = moment(even.fecha_tracker).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
          even.fecha_minuto = moment(even.fecha_minuto).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
          even.fecha_servidor = moment(even.fecha_servidor).subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
        }

        even.imei = even.tracker_imei;

        let newEvent = this.setLayer(even);
        this.eventService.addNewEvent(newEvent);

        //console.log('new notification counter', this.count);
        this.new_notif_stack.push(even.id);
        this.updateNotifCounter();
        console.log('new notification stack', this.new_notif_stack);
        //console.log('new notification stack counter', this.new_notif_stack.length);
        console.log('new notification Event Content en Socket', even);
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

  updateNotifCounter(){
    this.count = this.new_notif_stack.length > 99? '99+': this.new_notif_stack.length.toString();
  }

}
