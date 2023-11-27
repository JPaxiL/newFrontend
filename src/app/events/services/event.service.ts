import { EventEmitter, Injectable, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as moment from 'moment';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { MapServicesService } from '../../map/services/map-services.service';
import { getContentPopup } from '../helpers/event-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VehicleService } from '../../vehicles/services/vehicle.service';
import { MultimediaService } from '../../multiview/services/multimedia.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private URL_NAME = environment.apiUrl+'/api/event-name';
  @Output() newEventStream: EventEmitter<any> = new EventEmitter<any>();
  @Output() debugEventStream: EventEmitter<any> = new EventEmitter<any>();
  @Output() pinPopupStream: EventEmitter<any> = new EventEmitter<any>();
  componentKey = new Subject<Number>();
  public eventDeveloperCount = 0;
  public eventDeveloperStatus = false;
  public events: any[] = [];
  public events_names: any[] = [];
  public eventsFiltered: any[] = [];
  public nombreComponente: string = 'EVENT-USER';
  public img_icon: string = 'assets/images/eventos/pin_point.svg';
  public img_iconSize: any = [30, 30];
  public img_iconAnchor: any = [0, 30];
  public eventsLayers = new L.LayerGroup();
  public eventsCommon: any[] = [
    "sos",
    "aceleracion-brusca",
    "distraccion",
    "fatiga-extrema",
    "somnolencia",
    "no-rostro",
    "colision-peatones",
    "motor-encendido",
    "motor-apagado",
    "bloqueo-vision-mobileye",
    "manipulacion-360",
    "desvio-de-carril-derecha",
    "desvio-de-carril-izquierda",
    "frenada-brusca",
    "conductor-adormitado",
    "conductor-fumando",
    "cinturon-de-seguridad-desabrochado",
    "uso-del-celular",
    ];

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
    public vehicleService: VehicleService,
    private multimediaService:MultimediaService
    ) {
      this.vehicleService.dataCompleted.subscribe(vehicles=>{
        console.log("evento cargo antes que vehicles ...");
        this.getVehiclesPlate();
      });
      // if(false){
      // if(this.eventsLoaded){
      //   this.vehicleService.dataCompleted.subscribe(vehicles=>{
      //     // console.log("me entero que la data de vehiculos ya se completo. Aqui desde eventos :D");
      //     // for (const index in this.events) {
      //     //   console.log(this.events[index]);
      //     //   this.events[index].nombre_objeto = this.vehicleService.getVehicle(this.events[index].imei).name;
      //     // }
      //     this.getVehiclesPlate();
      //   });
      //   console.log("el modulo vehiculos a demorado mas que event");
      // }else{
      //   this.getVehiclesPlate();
      //   console.log("el modulo event a demorado mas que vehiculos");
      // }
    }


  initialize(): void {
    // console.log("inicializando service events ....");
    this.getAll();
  }

  public getVehiclesPlate(): void {
    for (const index in this.events) {
      // console.log(this.events[index].imei);
      this.events[index].nombre_objeto = this.vehicleService.getVehicle(this.events[index].imei).name;
      // if('860640057334650'==this.events[index].imei)console.log("vehicle retornado",this.vehicleService.getVehicle(this.events[index].imei));
    }
  }

  public getEventName(): Observable<any>{
    return this.http.get(this.URL_NAME);
  }
  public loadNameEvent(event: any){
    // console.log("buscando evento "+event.tipo,this.eventsCommon.indexOf(event.tipo));
    if(this.eventsCommon.indexOf(event.tipo)<0){
      // console.log("evento personalizado");
      return this.eventPersonalice(event.event_user_id);
    }else{
      // console.log("evento comun");
      return this.eventCommon(event.tipo);
    }
    // this.getEventName().subscribe(name=>{
    //   console.log("consiguiendo los nombres de los eventos",name);
    //   this.events_names = name.data;
    // });
    return "---";
  }

  public eventCommon(slug: any): any{
    for (const index in this.events_names) {
      // console.log(this.events_names[index].slug+"=="+slug);
      if(this.events_names[index].slug==slug){
        return this.events_names[index].nombre;
      }
    }
    return "--";
  }
  public eventPersonalice(event_user_id: any): any{
    for (const index in this.events_names) {
      if(this.events_names[index].event_user_id==event_user_id){
        return this.events_names[index].nombre;
      }
    }
    return "--";
  }
  public async getAll(
    key: string = '',
    show_in_page: number = 15,
    page: number = 1
  ) {
    // console.log('Cargando eventos...');
    await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user`)
      .toPromise()
      .then((response) => {
        // console.log("eventos cargados === -------------->",response.data);
        this.getEventName().subscribe(name=>{
          // console.log("consiguiendo los nombres de los eventos",name.data);
          this.events_names = name.data;
          for (const index in this.events) {
            this.events[index].nombre=this.loadNameEvent(this.events[index]);
          }
          console.log("vehicles cargo antes que eventos ...");
          this.getVehiclesPlate();
        });
        this.events = response.data.map((event: any) => {

          //event.nombre=this.loadNameEvent(event); //conseguir el nombre que el usuario le puso
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
          // console.log("view",event.viewed)
          if(!event.viewed){
            this.unreadCount++;
          }
          
          return event;
        });
        // return;
        this.strUnreadCount = this.unreadCount > 99? '+99': this.unreadCount.toString();
        this.eventsLoaded = true;
        while(this.socketEvents.length > 0){
          let last_event = this.socketEvents.pop();
          if(this.events.findIndex(event => event.id == last_event.id) == -1){
            // this.events.nombre="XDDD";
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
    console.log("get data desde eventService",this.events);
    return this.events;
  }

  public getFilters() {
    return this.classFilterArray;
  }

  public addNewEvent(event:any){
    console.log("addNewEvent ........... ",event);
//     evento: "motor-encendido"
// evento_id: 19
    event.event_user_id = event.evento_id;
    event.nombre=this.loadNameEvent(event);
    if(!this.eventsLoaded || this.enableSocketEvents){
      // console.log("event socket");
      this.socketEvents.unshift(event);
    } else {
      // console.log("event ---XD");
      this.events.unshift(event);
      this.updateUnreadCounter();
      if(typeof event.sonido_sistema_bol != 'undefined' && event.sonido_sistema_bol == true){
        this.playNotificationSound(event.ruta_sonido);
      }
      this.attachClassesToEvents();
    }

    this.newEventStream.emit(this.events);
    console.log("new Event added: ", event);
    // this.eventService.sortEventsTableData();
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
    // console.log("events en eventService",events);

    // events = events.filter(function( obj:any ) {
    //   return obj.id !== 23;  // id=23	name=Somnolencia	slug=somnolencia	type=accessories		 ==> 7.	Quitar los eventos de Somnolencia
    // });

    this.classFilterArray = events.map( (event:any) => ({
      id:event.id,
      option:this.toCamelCase(event.name),
      tipo:event.slug,
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

  toCamelCase(str:any){
    const palabras = str.split(" ");

    var palabraM = palabras.map((palabra:any) => {
      if (palabra=='de' || palabra=='en' || palabra=='con' || palabra=='de' || palabra=='la' ) {
        return palabra;
      } else {
        return palabra[0].toUpperCase() + palabra.substring(1);
      }
    }).join(" ");
    return palabraM;
  }


    //== Para el uso del modulo historial

    eventsClassList = [
      { tipo: 'zona-de-entrada', clase: 'zona-entrada' },
      { tipo: 'zona-de-salida', clase: 'zona-salida' },
      { tipo: 'tiempo-estadio-zona', clase: 'tiempo-estadia-zona' },
      { tipo: 'parada-en-zona-no-autorizada', clase: 'parada-zona-no-autorizada' },
      { tipo: 'mantenimiento-correctivo', clase: 'mantenimiento-correctivo' },
      { tipo: 'mantenimiento-preventivo', clase: 'mantenimiento-preventivo' },
      { tipo: 'mantenimiento-correctivo-realizado', clase: 'mantenimiento-correctivo-realizado' },
      { tipo: 'mantenimiento-preventivo-realizado', clase: 'mantenimiento-preventivo-realizado' },
      { tipo: 'sos', clase: 'sos-event' },
      { tipo: 'exceso-velocidad', clase: 'exceso-velocidad' },
      { tipo: 'infraccion', clase: 'infraccion' },
      { tipo: 'vehiculo-sin-programacion', clase: 'vehiculo-sin-programacion' },
      { tipo: 'frenada-brusca', clase: 'frenada-brusca' },
      { tipo: 'aceleracion-brusca', clase: 'aceleracion-brusca' },
      { tipo: 'bateria-desconectada', clase: 'bateria-desconectada' },
      { tipo: 'motor-encendido', clase: 'motor-encendido' },
      { tipo: 'motor-apagado', clase: 'motor-apagado' },
      { tipo: 'fatiga', clase: 'fatiga' },
      { tipo: 'somnolencia-360', clase: 'somnolencia' },
      { tipo: 'distraccion', clase: 'distraccion' },
      { tipo: 'distraccion', clase: 'distraccion' },
      { tipo: 'desvio-de-carril-izquierda', clase: 'desvio-carril-izq' },
      { tipo: 'desvio-de-carril-derecha', clase: 'desvio-carril-der' },
      { tipo: 'bloqueo-vision-mobileye', clase: 'bloqueo-vision-mobileye' },
      { tipo: 'anticolision-frontal', clase: 'colision-peatones' },
      { tipo: 'anticolision-frontal', clase: 'colision-delantera' },
      { tipo: 'posible-fatiga', clase: 'posible-fatiga' },
      { tipo: 'fatiga-extrema', clase: 'fatiga-extrema' },
      { tipo: 'no-rostro', clase: 'no-rostro' },
      { tipo: 'error-de-camara-360', clase: 'error-camara' },
      { tipo: 'cinturon-desabrochado-360', clase: 'cinturon-NoDetectado' },
      { tipo: 'conductor-distraido-360', clase: 'distraccion-detectada' },
      { tipo: 'conductor-fumando-360', clase: 'cigarro-detectado' },
      { tipo: 'ignicion-activada-360', clase: 'no-rostro' },
      { tipo: 'conductor-adormitado-360', clase: 'conductor-adormitado' },
      { tipo: 'conductor-somnoliento-360', clase: 'conductor-somnoliento' },
      { tipo: 'uso-del-celular-360', clase: 'celular-detectado' },
      { tipo: 'error-de-camara-360', clase: 'no-rostro' },
      { tipo: 'sistema-ok-360', clase: 'no-rostro' },
      { tipo: 'sistema-reseteado-360', clase: 'no-rostro' },
      { tipo: 'deteccion-manipulacion-360', clase: 'deteccion-manipulacion' },
      { tipo: 'conductor-no-identificado-360', clase: 'no-rostro' },
      { tipo: 'cambio-conductor-360', clase: 'no-rostro' },
      { tipo: 'conductor-identificado-360', clase: 'no-rostro' },
      { tipo: 'conductor-ausente-360', clase: 'no-rostro' },
      { tipo: 'ignicion-activada-360', clase: 'no-rostro' },
      { tipo: 'actualizacion-estado-gps-360', clase: 'no-rostro' }
    ];


    public async ShowAllHistorial(param : any) {
        // console.log("========= ShowAllHistorial ===========");

        await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/dataEventUserHistorial`,param)
          .toPromise().then((response:any) => {
            // console.log("=======================ShowAllHistorial event");
            // console.log("data show historial event",response.data);
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

              // // this.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
              // event.layer.bindPopup(getContentPopup(event), {
              //   className: eventClass,
              //   minWidth: 250,
              //   maxWidth: 350,
              // } );
              // // event.layer.addTo(this.mapService.map);//.openPopup();


              const objParams:any = {};
              if(event.parametros&&typeof(event.parametros)=='string'){
                event.parametros.split('|').forEach((item:any) => {
                  const [key, value] = item.split('=');
                  objParams[key] = value;
                });
                event.parametros = objParams;
              }
              //console.log("eventosssss");

              event.layer.bindPopup(getContentPopup(event), {
                className: eventClass,
                minWidth: 250,
                maxWidth: 350,
              });

              event.layer.on('click', () => {
                console.log("CLIIIIICK");
                this.pinPopupStream.emit(event);
              });
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
      console.log("contador de eventos = ",counter);
      this.unreadCount = counter;
      this.strUnreadCount = this.unreadCount > 99? '+99': this.unreadCount.toString();
    }

    showEventPanel(){
      console.log("show event panel ....");
      if(this.filterLoaded && this.eventsLoaded){
        this.attachClassesToEvents();
        this.eventsFiltered = this.getData();
        console.log("EVENTS_FILTERED: ",this.eventsFiltered);
        
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

  markAsRead(event_id:string){
    console.log("desde event service ... ");
    this.http.get<any>(environment.apiUrl + '/api/event-user/mark-as-viewed/' + event_id).subscribe({
      next: data => {
        console.log(' desde event service Mark ' + event_id + ' as read Success? : ', data.success);
      },
      error: () => {
        console.log(event_id + ': Hubo un error al marcar como leído');
      }
    });
  }

  async getReference(lat: any, lng: any){
    const response:ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user/get-reference`, {
        params:
        {
          latitud:lat,
          longitud:lng
        }
      })
      .toPromise();

      return response.data;
  }

  /**
   * name
   */
  public getContentPopup(event:any) {
    return getContentPopup(event);
  }

}
