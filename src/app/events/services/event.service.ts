import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as moment from 'moment';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { MapServicesService } from '../../map/services/map-services.service';
import { getContentPopup } from '../helpers/event-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventSocketService } from './event-socket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  componentKey = new Subject<Number>();
  public events: any[] = [];
  public eventsFiltered: any[] = [];
  public nombreComponente: string = 'EVENT-USER';
  public img_icon: string = 'assets/images/eventos/pin_point.svg';
  public img_iconSize: any = [30, 30];
  public img_iconAnchor: any = [0, 30];
  public eventsLayers = new L.LayerGroup();

  public eventsHistorial: any = []; //==> Usado en el modulo historial

  public hasEventPanelBeenOpened: boolean = false;
  public classFilterArray: any = [];
  public openEventIdOnMap: Number = 0;
  public activeEvent: any = false;

  public eventsLoaded: boolean = false;
  public filterLoaded: boolean = false;
  public unreadCount: number = 0;
  public strUnreadCount: string = '0';
  public socketEvents: any[] = [];
  public enableSocketEvents: boolean = true;

  audio = new Audio();

  new_notif_stack: number[] = [];

  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,
    private spinner: NgxSpinnerService,
    ) {}


  initialize(): void {
    this.getAll();
  }

  public async getAll(
    key: string = '',
    show_in_page: number = 15,
    page: number = 1
  ) {
    console.log('Cargando eventos...');
    await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user`)
      .toPromise()
      .then((response) => {
        console.log(response.data);
        this.events = response.data.map((event: any) => {
          let icon = L.icon({
            iconUrl: this.img_icon,
            iconSize: this.img_iconSize, // size of the icon
            iconAnchor: this.img_iconAnchor, //[20, 40], // point of the icon which will correspond to marker's location
          });
          event.layer = L.marker([event.latitud, event.longitud], {
            icon: icon,
          });
          event.layer._myType = 'evento';
          event.layer._myId = event.id;
          // event.layer.addTo(this.eventsLayers);

          // Corrección horaria (GMT -5). Estaba presente en event-socket, pero no aquí.
          event.fecha_tracker = moment(event.fecha_tracker, 'YYYY/MM/DD hh:mm:ss').subtract(5, 'hours').format("YYYY/MM/DD HH:mm:ss");
          //console.log('Evento de tabla: ', event);
          if(!event.viewed){
            this.unreadCount++;
          }
          return event;
        });
        this.strUnreadCount = this.unreadCount > 99? '+99': this.unreadCount.toString();
        this.eventsLoaded = true;
        while(this.socketEvents.length > 0){
          let last_event = this.socketEvents.pop();
          if(this.events.findIndex(event => event.id == last_event.id) == -1){
            this.events.unshift(last_event);
            //this.increaseUnreadCounter();
          } else {
            console.log('Evento duplicado: ', last_event);
          }
        }
        this.updateUnreadCounter();
        this.enableSocketEvents = false;
        this.showEventPanel();
      });
      return this.events;
  }

  public getData() {
    return this.events;
  }

  public getFilters() {
    return this.classFilterArray;
  }

  public addNewEvent(event:any){
    if(!this.eventsLoaded || this.enableSocketEvents){
      this.socketEvents.unshift(event);
    } else {
      this.events.unshift(event);
      this.updateUnreadCounter();
      if(typeof event.sonido_sistema_bol != 'undefined' && event.sonido_sistema_bol == true){
        this.playNotificationSound(event.ruta_sonido);
      }
      this.attachClassesToEvents();
    }
  }

  playNotificationSound(path: string){
    if(typeof path != 'undefined' && path != ''){
      if(this.audio.currentSrc != '' && !this.audio.ended){
        this.audio.pause();
      }
      this.audio = new Audio('assets/sonidos/' + path);
      let audioPromise = this.audio.play();

      if (audioPromise !== undefined) {
        audioPromise.then(() => {
          //console.log('Playing notification sound')
        })
        .catch((error: any) => {
          //console.log(error);
          // Auto-play was prevented
        });
      }
    }
  }

  public async getAllEventsForTheFilter() {
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/events`).toPromise();
    let events = response.data;

    this.classFilterArray = events.map( (event:any) => ({
      id:event.id,
      option:event.name,
      tipo:event.name,
      clase:event.slug
    }))
    this.classFilterArray.push({
      id: 999,
      option: 'Exceso de Velocidad',
      tipo: 'Exceso de Velocidad',
      clase: 'exceso-velocidad',
    });

    //console.log('Filtros cargados: ', this.classFilterArray);
    //console.log('Filtros de Eventos: ', events);
    return this.classFilterArray;
  }

    //== Para el uso del modulo historial

    eventsClassList = [
      { tipo: 'Zona de entrada', clase: 'zona-entrada' },
      { tipo: 'Zona de salida', clase: 'zona-salida' },
      { tipo: 'Tiempo de estadia en zona', clase: 'tiempo-estadia-zona' },
      { tipo: 'Parada en zona no autorizada', clase: 'parada-zona-no-autorizada' },
      { tipo: 'Mantenimiento correctivo', clase: 'mantenimiento-correctivo' },
      { tipo: 'Mantenimiento preventivo', clase: 'mantenimiento-preventivo' },
      { tipo: 'Mantenimiento correctivo realizado', clase: 'mantenimiento-correctivo-realizado' },
      { tipo: 'Mantenimiento preventivo realizado', clase: 'mantenimiento-preventivo-realizado' },
      { tipo: 'SOS', clase: 'sos-event' },
      { tipo: 'Exceso de Velocidad', clase: 'exceso-velocidad' },
      { tipo: 'Infraccion', clase: 'infraccion' },
      { tipo: 'Vehiculo sin programacion', clase: 'vehiculo-sin-programacion' },
      { tipo: 'Frenada brusca', clase: 'frenada-brusca' },
      { tipo: 'Aceleracion brusca', clase: 'aceleracion-brusca' },
      { tipo: 'Bateria desconectada', clase: 'bateria-desconectada' },
      { tipo: 'Motor encendido', clase: 'motor-encendido' },
      { tipo: 'Motor apagado', clase: 'motor-apagado' },
      { tipo: 'Fatiga', clase: 'fatiga' },
      { tipo: 'Somnolencia', clase: 'somnolencia' },
      { tipo: 'Distraccion', clase: 'distraccion' },
      { tipo: 'Distracción', clase: 'distraccion' },
      { tipo: 'Desvío de carril hacia la izquierda', clase: 'desvio-carril-izq' },
      { tipo: 'Desvío de carril hacia la derecha', clase: 'desvio-carril-der' },
      { tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
      { tipo: 'Colisión con peatones', clase: 'colision-peatones' },
      { tipo: 'Colisión delantera', clase: 'colision-delantera' },
      { tipo: 'Anticolisión frontal', clase: 'colision-delantera' },
      { tipo: 'Posible Fatiga', clase: 'posible-fatiga' },
      { tipo: 'Fatiga Extrema', clase: 'fatiga-extrema' },
      { tipo: 'No Rostro', clase: 'no-rostro' },
    ];


    public async ShowAllHistorial(param : any,
    ) {

      await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/dataEventUserHistorial`,param)
        .toPromise().then((response:any) => {
          // console.log("=======================");
          // console.log(response.data);
          this.eventsHistorial = response.data;

          for (let index = 0; index < this.eventsHistorial.length; index++) {

            let icon = L.icon({
              iconUrl: this.img_icon,
              iconSize: this.img_iconSize, // size of the icon
              iconAnchor: this.img_iconAnchor, //[20, 40], // point of the icon which will correspond to marker's location
            });

            const event = this.eventsHistorial[index];
            event.layer = L.marker([event.latitud, event.longitud], {
              icon: icon,
            });
            event.layer._myType = 'eventoHistorial';
            event.layer._myId = event.id;
            //---------
            var eventClass:any = this.eventsClassList.filter((eventClass:any) => eventClass.tipo == event.tipo);
            eventClass = (eventClass.length > 0? eventClass[0].clase: 'default-event');

            // this.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
            event.layer.bindPopup(getContentPopup(event), {
              className: eventClass,
              minWidth: 250,
              maxWidth: 350,
            } );
            // event.layer.addTo(this.mapService.map);//.openPopup();

          }

          console.log(this.eventsHistorial);

        });
    }

    public attachClassesToEvents(single_event?: any){
      let events = typeof single_event == 'undefined'? this.events: single_event;
      events.forEach((event: any) => {
        //console.log(event.evento);
        //console.log(this.classFilterArray.find( (eachFilter: { tipo: string; }) => this.prepareStrings(eachFilter.tipo) === this.prepareStrings(event.evento) ));

        //Usar este IF en caso de querer usar las clases obtenidas en getAllEventsForTheFilter
        /* if(typeof event.clase == 'undefined' || event.clase == ''){
          const eventFilter = this.classFilterArray.find( (eachFilter: { tipo: string; }) => this.prepareStrings(eachFilter.tipo) === this.prepareStrings(event.evento) );
          event.clase = typeof eventFilter == 'undefined'? 'default-event': eventFilter.clase;
        } */

        //Usar este IF en caso de querer usar el objeto declarado localmente para obtener las clases
        if(typeof event.clase == 'undefined' || event.clase == ''){
          const eventFilter = this.eventsClassList.find( (eachFilter: { tipo: string; }) => this.prepareStrings(eachFilter.tipo) === this.prepareStrings(event.evento) );
          event.clase = typeof eventFilter == 'undefined'? 'default-event': eventFilter.clase;
          if(typeof eventFilter == 'undefined'){
            console.log('No se pudo asignar clase a evento: ', event)
          }
        }
      });
    }

    private prepareStrings(str: string){
      return str.normalize('NFKD').replace(/[^\w ]/g, '').toLowerCase();
    }

    async getEventsByImeis(imeis:any,to:any,from:any){
      const response:ResponseInterface = await this.http
      .post<ResponseInterface>(`${environment.apiUrl}/api/event-user/get-by-imeis`, {
        imeis:imeis,
        to:to,
        from:from
      })
      .toPromise();

      return response.data;
    }

    async getEventsByImeisAndEventType(imeis:any,to:any,from:any, event_type:any){
      const response:ResponseInterface = await this.http
      .post<ResponseInterface>(`${environment.apiUrl}/api/event-user/get-by-imeis`, {
        imeis:imeis,
        to:to,
        from:from,
        event_type:event_type
      })
      .toPromise();

      return response.data;
    }

    increaseUnreadCounter(){
      this.unreadCount++;
      this.strUnreadCount = this.unreadCount > 99? '+99': this.unreadCount.toString();
    }

    decreaseUnreadCounter(){
      this.unreadCount--;
      this.strUnreadCount = this.unreadCount > 99? '+99': this.unreadCount.toString();
    }

    updateUnreadCounter(){
      let counter = 0;
      this.events.forEach(event => {
        if(event.viewed == false){
          counter++;
        }
      });
      this.unreadCount = counter;
      this.strUnreadCount = this.unreadCount > 99? '+99': this.unreadCount.toString();
    }

    showEventPanel(){
      if(this.filterLoaded && this.eventsLoaded){
        this.attachClassesToEvents();
        this.eventsFiltered = this.getData();
        this.sortEventsTableData(); //Initial table sort
        this.spinner.hide('loadingEventList');
        console.log('Ocultar Spinner');
      } else {
        console.log('Failed attempt');
      }
    }


  //Sort called from event-list.component
  sortEventsTableData(){
    this.eventsFiltered.sort((a,b) => {
      if(a.fecha_tracker > b.fecha_tracker){
        return -1;
      }
      if(a.fecha_tracker < b.fecha_tracker){
        return 1;
      }
      if(this.new_notif_stack.indexOf(a.id) > -1 ){
        if(this.new_notif_stack.indexOf(b.id) > -1){
          if(this.new_notif_stack.indexOf(a.id) > this.new_notif_stack.indexOf(b.id)) {
            return -1;
          }
          return 1;
        }
        return -1;
      } else {
        if(this.new_notif_stack.indexOf(b.id) > -1){
          return 1;
        }
        return -1;
      }
    });
    //console.log('Data Sorted', this.events);
  }

  checkDuplicates(){
    for(let i=0; i < this.events.length; i++){
      let currEvent = this.events[i];
      let auxArr = this.events.filter(event => {
        event.id == currEvent.id;
      });
      if(auxArr.length > 1){
        console.log('EVENTO DUPLICADO DETECTADO!', currEvent.id);
      }
    }
  }

}
