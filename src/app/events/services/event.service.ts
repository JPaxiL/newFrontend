import { EventEmitter, Injectable, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as moment from 'moment';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { MapServicesService } from '../../map/services/map-services.service';
import { getContentPopup, getIconUrlHistory } from '../helpers/event-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VehicleService } from '../../vehicles/services/vehicle.service';
import { MultimediaService } from '../../multiview/services/multimedia.service';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { Evaluation } from 'src/app/alerts/models/alert.interface';
import { DriversService } from 'src/app/drivers/services/drivers.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private URL_NAME = environment.apiUrl + '/api/event-name';
  @Output() newEventStream: EventEmitter<any> = new EventEmitter<any>();
  @Output() debugEventStream: EventEmitter<any> = new EventEmitter<any>();
  @Output() evaluationEventStream: EventEmitter<any> = new EventEmitter<any>();
  @Output() pinPopupStream: EventEmitter<any> = new EventEmitter<any>();
  componentKey = new Subject<Number>();
  public eventDeveloperCount = 0;
  public eventDeveloperStatus = false;
  public events: any[] = [];
  public events_names: any[] = [];
  public eventsFiltered: any[] = [];
  public nombreComponente: string = 'EVENT-USER';
  /* public img_icon: string = 'assets/images/eventos/pin_point.svg'; */
  public img_iconSize: any = [30, 30];
  public img_iconAnchor: any = [14, 0];
  public eventsLayers = new L.LayerGroup();
  // public eventsCommon: any[] = [
  //   'sos',
  //   'aceleracion-brusca',
  //   'distraccion',
  //   'fatiga-extrema',
  //   'somnolencia',
  //   'no-rostro',
  //   'colision-peatones',
  //   'motor-encendido',
  //   'motor-apagado',
  //   'bloqueo-vision-mobileye',
  //   'manipulacion-360',
  //   'desvio-de-carril-derecha',
  //   'desvio-de-carril-izquierda',
  //   'frenada-brusca',
  //   'conductor-adormitado-360',
  //   'conductor-fumando',
  //   'cinturon-de-seguridad-desabrochado',
  //   'uso-del-celular',
  //   'exceso-velocidad',
  //   'desvio-de-carril-izquierda2',
  // ];

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
  public statusLoadPlate: boolean = false;
  audio = new Audio();

  new_notif_stack: number[] = [];

  public eventsUserLoaded: boolean = false;
  public eventsGroupedList: any = [];
  public eventsLength: any;

  public filterEventSelected: string[] = [];
  public filterEventRequest: string[] = ['posible-fatiga','conductor-adormitado-360'];
  public filterEventBackInTime: number = 48;
  public filterEventRequestLengh: number = 500;

  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,
    private spinner: NgxSpinnerService,
    public vehicleService: VehicleService,
    public driverService: DriversService
  ) {
    this.vehicleService.dataCompleted.subscribe((vehicles) => {
      this.getVehiclesPlate();
    });

  }

  async initialize() {
    this.getAll();
  }

  public getVehiclesPlate(data_events?: any): void {
    console.log("getVehicles plate ....");
    if (data_events) {
      for (const index in data_events) {
        data_events[index].nombre_objeto = this.vehicleService.getVehicle(
          data_events[index].imei
        ).name;
        data_events[index].namedriver = this.driverService.getDriverById(
          data_events[index].driver_id
        );
      }
    } else {
      for (const index in this.events) {
        this.events[index].nombre_objeto = this.vehicleService.getVehicle(
          this.events[index].imei
        ).name;
        this.events[index].namedriver = this.driverService.getDriverById(
          this.events[index].driver_id
        );
      }
    }
  }

  public getEventName(): Observable<any> {
    return this.http.get(this.URL_NAME);
  }

  // EVENTS for History

  public getEventsForUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/getPermissEvents`);
  }

  public async getEventFilter(selectedEvent: any){
    for (const index in selectedEvent) {
      let search_event_request = this.filterEventRequest.indexOf(selectedEvent[index].value);
      let search_event_selected = this.filterEventSelected.indexOf(selectedEvent[index].value);
      if(search_event_request >= 0 && search_event_selected < 0){
        this.filterEventSelected.push(selectedEvent[index].value);
        this.requestEventSlug(selectedEvent[index].value,this.filterEventBackInTime,this.filterEventRequestLengh);
      }
    }
  }

  public async requestEventSlug(event_slug: string, back_time: number, length: number){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alternative-event-user/`+event_slug+`?backtime=`+back_time+`&length=`+length)
    .toPromise()
    .then((res) =>{
      console.log("exito al buscar eventos con slug "+event_slug);
      console.log("eventos encontrados",res);
      if(res.data!=null) this.integrateEvent(res.data);
    });
  }

  public integrateEvent (data: any){
    console.log("integrando eventos nuevos a la lista general");
    console.log("this.events",this.events);
    for (const i in data) {
      // console.log("-->",data[i]);
      let status=true;
      for (const j in this.events) {

        if(this.events[j].uuid_event==data[i].uuid_event)status=false;
      }
      if(status){
        let event = this.formatEvent(data[i]);
        this.events.push(event);

      }
    }
    this.getVehiclesPlate();
    this.attachClassesToEvents();
    this.newEventStream.emit(data);
  }
  public integrateEvaluationEvent (info: any) {
    console.log("integrando evaluacion ...",info);
    let data = [];
    for (const key in this.events) {
      if(this.events[key].uuid_event == info.uuid){
        this.events[key].evaluated=1
        data.push(this.events[key]);
      }
    }
    console.log("enviando data:",data);
    this.getVehiclesPlate();
    this.attachClassesToEvents();
    this.newEventStream.emit(data);
  }

  public formatEvent(event: any){
    event = this.setLayer(event);
    // console.log('EVENTO ->',event);
    event.namedriver = this.driverService.getDriverById(event.driver_id); // <------- MODIFICAR CUANDO CONDUCTORES SERVICE EXISTA
    // event.namedriver = "NO IDENTIFICADO";
    // event.layer.addTo(this.eventsLayers);

    // Corrección horaria (GMT -5). Estaba presente en event-socket, pero no aquí.
    event.fecha_tracker = moment(
      event.fecha_tracker,
      'YYYY/MM/DD hh:mm:ss'
    )
      .subtract(5, 'hours')
      .format('YYYY/MM/DD HH:mm:ss');
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
    return event;
  }

  public setLayer (event: any){
    const iconUrl = getIconUrlHistory(event);
    let icon = L.icon({
      iconUrl: iconUrl,
      iconSize: this.img_iconSize, // size of the icon
      iconAnchor: this.img_iconAnchor, //[20, 40], // point of the icon which will correspond to marker's location
    });
    event.layer = L.marker([event.latitud, event.longitud], {
      icon: icon,
    });
    event.layer._myType = 'evento';
    event.layer._myId = event.id;
    return event;
  }
  public async getAll(
    key: string = '',
    show_in_page: number = 15,
    page: number = 1
  ) {
    // console.log('[event.service] getAll()');
    await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user`)
      .toPromise()
      .then((response) => {
        console.log(
          '########### [event.service] getAll(). Exito al cargar eventos ################',
          response.data
        );
        // return;
        this.events = response.data.map((event: any) => {
          return this.formatEvent(event);
        });
        // return;
        this.strUnreadCount =
          this.unreadCount > 99 ? '+99' : this.unreadCount.toString();
        this.eventsLoaded = true;
        while (this.socketEvents.length > 0) {
          let last_event = this.socketEvents.pop();
          // if (
          //   this.events.findIndex((event) => event.id == last_event.id) == -1
          // ) {
            // this.events.nombre="XDDD";
            if (last_event.bol_evaluation) {
              last_event.evaluations = [
                {
                  event_id: last_event.evento_id,
                  usuario_id: last_event.usuario_id,
                  imei: last_event.imei,
                  fecha: last_event.fecha_tracker,
                  nombre: last_event.nombre_objeto,
                  tipo_evento: last_event.name,
                  uuid_event: last_event.uuid_event,
                  criterio_evaluacion: '',
                  identificacion_video: '',
                  valoracion_evento: '0',
                  observacion_evaluacion: '',
                  senales_posible_fatiga: false,
                  operador_monitoreo: '',
                } as Evaluation,
              ];
            }
            this.events.unshift(last_event);
            //this.increaseUnreadCounter();
          // } else {
          //   // esto no existe el caso todo se trabaja en events_platform
          //   console.log('Evento duplicado: ', last_event);
          // }
        }
        this.updateUnreadCounter();
        this.enableSocketEvents = false;
        this.showEventPanel();
      });
    return this.events;
  }

  public getData() {
    if (!this.statusLoadPlate) {
      console.log("[getData] this.statusLoadPlate: ",this.statusLoadPlate);
      this.getVehiclesPlate();
      this.statusLoadPlate = true;
    }
    return this.events;
  }

  public getFilters() {
    return this.classFilterArray;
  }

  public addNewEvent(event: any) {
    console.log('addNewEvent ........... ', event);
    console.log("socketEvents: ",this.socketEvents);
    //     evento: "motor-encendido"
    // evento_id: 19
    event.event_user_id = event.evento_id;
    event.evaluated = 0;
    if (!this.eventsLoaded || this.enableSocketEvents) {
      console.log("event socket");
      this.socketEvents.unshift(event);
    } else {
      console.log("event ---XD");

      this.events.unshift(event);
      this.updateUnreadCounter();
      console.log('SONARAA?', event);
      if (
        typeof event.sonido_sistema_bol != 'undefined' &&
        event.sonido_sistema_bol == true
      ) {
        console.log('SI sonará');
        this.playNotificationSound(event.ruta_sonido);
      }
      this.attachClassesToEvents();
    }

    this.newEventStream.emit(this.events);
  }

  playNotificationSound(path: string) {
    if (typeof path != 'undefined' && path != '') {
      if (this.audio.currentSrc != '' && !this.audio.ended) {
        this.audio.pause();
      }
      this.audio = new Audio('assets/sonidos/' + path);
      let audioPromise = this.audio.play();

      if (audioPromise !== undefined) {
        audioPromise
          .then(() => {
            console.log('Playing notification sound');
          })
          .catch((error: any) => {
            //console.log(error);
            // Auto-play was prevented
          });
      }
    }
  }

  public async getAllEventsForTheFilter() {
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/events`)
      .toPromise();
    let events = response.data;
    console.log("[event.service] getAllEventsForTheFilter -> events en eventService",events);

    // events = events.filter(function( obj:any ) {
    //   return obj.id !== 23;  // id=23	name=Somnolencia	slug=somnolencia	type=accessories		 ==> 7.	Quitar los eventos de Somnolencia
    // });

    this.classFilterArray = events.map((event: any) => ({
      id: event.id,
      option: this.toCamelCase(event.name),
      tipo: event.slug,
      clase: event.slug,
    }));
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

  toCamelCase(str: any) {
    const palabras = str.split(' ');

    var palabraM = palabras
      .map((palabra: any) => {
        if (
          palabra == 'de' ||
          palabra == 'en' ||
          palabra == 'con' ||
          palabra == 'de' ||
          palabra == 'la'
        ) {
          return palabra;
        } else {
          return palabra[0].toUpperCase() + palabra.substring(1);
        }
      })
      .join(' ');
    return palabraM;
  }

  //== Para el uso del modulo historial

  eventsClassList = [
    { tipo: 'zona-de-entrada', clase: 'zona-entrada' },
    { tipo: 'zona-de-salida', clase: 'zona-salida' },
    { tipo: 'tiempo-estadio-zona', clase: 'tiempo-estadia-zona' },
    {
      tipo: 'parada-en-zona-no-autorizada',
      clase: 'parada-zona-no-autorizada',
    },
    { tipo: 'mantenimiento-correctivo', clase: 'mantenimiento-correctivo' },
    { tipo: 'mantenimiento-preventivo', clase: 'mantenimiento-preventivo' },
    {
      tipo: 'mantenimiento-correctivo-realizado',
      clase: 'mantenimiento-correctivo-realizado',
    },
    {
      tipo: 'mantenimiento-preventivo-realizado',
      clase: 'mantenimiento-preventivo-realizado',
    },
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
    { tipo: 'desvio-de-carril-izquierda', clase: 'desvio-carril-izq' },
    { tipo: 'desvio-de-carril-derecha', clase: 'desvio-carril-der' },
    { tipo: 'bloqueo-vision-mobileye', clase: 'bloqueo-vision-mobileye' },
    { tipo: 'colision-peatones', clase: 'colision-peatones' },
    { tipo: 'anticolision-frontal', clase: 'colision-delantera' },
    { tipo: 'posible-fatiga', clase: 'posible-fatiga' },
    { tipo: 'fatiga-extrema', clase: 'fatiga-extrema' },
    { tipo: 'no-rostro', clase: 'no-rostro' },
    { tipo: 'error-de-camara-360', clase: 'error-de-camara-360' },
    { tipo: 'cinturon-desabrochado-360', clase: 'cinturon-desabrochado-360' },
    { tipo: 'conductor-distraido-360', clase: 'conductor-distraido-360' },
    { tipo: 'conductor-fumando-360', clase: 'conductor-fumando-360' },
    { tipo: 'ignicion-activada-360', clase: 'ignicion-activada-360' },
    { tipo: 'conductor-adormitado-360', clase: 'conductor-adormitado-360' },
    { tipo: 'conductor-somnoliento-360', clase: 'conductor-somnoliento-360' },
    { tipo: 'uso-del-celular-360', clase: 'celular-detectado' },
    { tipo: 'sistema-ok-360', clase: 'sistema-ok-360' },
    { tipo: 'sistema-reseteado-360', clase: 'sistema-reseteado-360' },
    { tipo: 'deteccion-manipulacion-360', clase: 'deteccion-manipulacion-360' },
    {
      tipo: 'conductor-no-identificado-360',
      clase: 'conductor-no-identificado-360',
    },
    { tipo: 'cambio-conductor-360', clase: 'cambio-conductor-360' },
    { tipo: 'conductor-identificado-360', clase: 'conductor-identificado-360' },
    { tipo: 'conductor-ausente-360', clase: 'conductor-ausente-360' },
    {
      tipo: 'actualizacion-estado-gps-360',
      clase: 'actualizacion-estado-gps-360',
    },
    { tipo: 'conductor-no-identificado', clase: 'conductor-no-identificado' },
    { tipo: 'conductor-identificado', clase: 'conductor-identificado' },
    {
      tipo: 'manipulacion-de-dispositivo',
      clase: 'manipulacion-de-dispositivo',
    },
    { tipo: 'error-calibracion-360', clase: 'error-calibracion-360' },
    { tipo: 'uso-de-celular-360', clase: 'celular_detectado_360' },
    { tipo: 'error-sistema-360', clase: 'error-sistema-360' },
    { tipo: 'ignicion-desactivada-360', clase: 'ignicion-desactivada-360' },
    { tipo: 'inicio-sistema-ok-360', clase: 'inicio-sistema-ok-360' },
    { tipo: 'motor-encendido', clase: 'motor-encendido' },
    { tipo: 'motor-apagado', clase: 'motor-apagado' },
    { tipo: 'dvr-operativo', clase: 'dvr-operativo' },
    { tipo: 'dvr-inoperativo', clase: 'dvr-inoperativo' },
    { tipo: 'antena-gps-desconectada', clase: 'antena-gps-desconectada' },
  ];

  public async ShowAllHistorial(param: any) {
    // console.log("========= ShowAllHistorial ===========");

    await this.http
      .post<ResponseInterface>(
        `${environment.apiUrl}/api/dataEventUserHistorial`,
        param
      )
      .toPromise()
      .then((response: any) => {
        // console.log("=======================ShowAllHistorial event");
        // console.log("data show historial event",response.data);
        this.eventsHistorial = response.data;

        for (let index = 0; index < this.eventsHistorial.length; index++) {
          let data = this.filterImei(
            this.vehicleService.vehicles,
            this.eventsHistorial[index].imei
          );
          // console.log("this.vehicleService.vehicles ----->", this.vehicleService.getVehicle(even.tracker_imei));
          // if(this.filterImei(this.vehicleService.vehicles,even.tracker_imei)){
          if (data != undefined) {
            //console.log("name ====",data.name);
            this.eventsHistorial[index].nombre_objeto = data.name;
          }

          const event = this.eventsHistorial[index];

          const iconUrl = getIconUrlHistory(event);

          let icon = L.icon({
            iconUrl: iconUrl,
            iconSize: this.img_iconSize, // size of the icon
            iconAnchor: this.img_iconAnchor, //[20, 40], // point of the icon which will correspond to marker's location
          });
          this.getVehiclesPlate(this.eventsHistorial);

          event.layer = L.marker([event.latitud, event.longitud], {
            icon: icon,
          });
          event.layer._myType = 'eventoHistorial';
          event.layer._myId = event.id;
          //---------
          var eventClass: any = this.eventsClassList.filter(
            (eventClass: any) => eventClass.tipo == event.tipo
          );
          eventClass =
            eventClass.length > 0 ? eventClass[0].clase : 'default-event';

          //nombre_objeto
          // // this.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
          // event.layer.bindPopup(getContentPopup(event), {
          //   className: eventClass,
          //   minWidth: 250,
          //   maxWidth: 350,
          // } );
          // // event.layer.addTo(this.mapService.map);//.openPopup();

          const objParams: any = {};
          if (event.parametros && typeof event.parametros == 'string') {
            event.parametros.split('|').forEach((item: any) => {
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
            console.log('CLIIIIICK');
            this.pinPopupStream.emit(event);
          });
        }

        console.log(this.eventsHistorial);
      });
  }

  private filterImei(data: any, imei: any) {
    // console.log("imei",imei);
    for (const index in data) {
      // console.log("IMEI",data[index].IMEI);
      if (String(data[index].IMEI) == String(imei)) {
        console.log('return true');
        return data[index];
      }
    }
    console.log('return false');
    return undefined;
  }

  public attachClassesToEvents(single_event?: any) {
    let events =
      typeof single_event == 'undefined' ? this.events : single_event;
    events.forEach((event: any) => {
      //console.log(event.evento);
      //console.log(this.classFilterArray.find( (eachFilter: { tipo: string; }) => this.prepareStrings(eachFilter.tipo) === this.prepareStrings(event.evento) ));

      //Usar este IF en caso de querer usar las clases obtenidas en getAllEventsForTheFilter
      /* if(typeof event.clase == 'undefined' || event.clase == ''){
          const eventFilter = this.classFilterArray.find( (eachFilter: { tipo: string; }) => this.prepareStrings(eachFilter.tipo) === this.prepareStrings(event.evento) );
          event.clase = typeof eventFilter == 'undefined'? 'default-event': eventFilter.clase;
        } */

      //Usar este IF en caso de querer usar el objeto declarado localmente para obtener las clases
      if (typeof event.clase == 'undefined' || event.clase == '') {
        const eventFilter = this.eventsClassList.find(
          (eachFilter: { tipo: string }) =>
            this.prepareStrings(eachFilter.tipo) ===
            this.prepareStrings(event.evento)
        );
        event.clase =
          typeof eventFilter == 'undefined'
            ? 'default-event'
            : eventFilter.clase;
        if (typeof eventFilter == 'undefined') {
          console.log('No se pudo asignar clase a evento: ', event);
        }
      }
    });
  }

  private prepareStrings(str: string) {
    return str
      .normalize('NFKD')
      .replace(/[^\w ]/g, '')
      .toLowerCase();
  }

  async getEventsByImeis(imeis: any, to: any, from: any) {
    const response: ResponseInterface = await this.http
      .post<ResponseInterface>(
        `${environment.apiUrl}/api/event-user/get-by-imeis`,
        {
          imeis: imeis,
          to: to,
          from: from,
        }
      )
      .toPromise();
    return response.data;
  }

  async getEvaluations(uuid_event: string) {
    console.log("get evaluation uuid_event: ",uuid_event);
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(
        `${environment.apiUrl}/api/evaluations/event-user/${uuid_event}`
      )
      .toPromise();
    return response.data;
  }

  async saveEvaluations(evaluation: Evaluation) {
    console.log("save evaluation:",evaluation);
    const response: ResponseInterface = await this.http
      .post<ResponseInterface>(
        `${environment.apiUrl}/api/evaluation`,
        evaluation
      )
      .toPromise();
    return response.data;
  }

  async getEventsByImeisAndEventType(
    imeis: any,
    to: any,
    from: any,
    event_type: any
  ) {
    const response: ResponseInterface = await this.http
      .post<ResponseInterface>(
        `${environment.apiUrl}/api/event-user/get-by-imeis`,
        {
          imeis: imeis,
          to: to,
          from: from,
          event_type: event_type,
        }
      )
      .toPromise();

    return response.data;
  }

  increaseUnreadCounter() {
    this.unreadCount++;
    this.strUnreadCount =
      this.unreadCount > 99 ? '+99' : this.unreadCount.toString();
  }

  decreaseUnreadCounter() {
    this.unreadCount--;
    this.strUnreadCount =
      this.unreadCount > 99 ? '+99' : this.unreadCount.toString();
  }

  updateUnreadCounter() {
    let counter = 0;
    this.events.forEach((event) => {
      if (event.viewed == false) {
        counter++;
      }
    });
    console.log('contador de eventos = ', counter);
    this.unreadCount = counter;
    this.strUnreadCount =
      this.unreadCount > 99 ? '+99' : this.unreadCount.toString();
  }

  showEventPanel() {
    console.log('show event panel ....');
    if (this.filterLoaded && this.eventsLoaded) {
      this.attachClassesToEvents();
      this.eventsFiltered = this.getData();

      this.sortEventsTableData(); //Initial table sort
      this.spinner.hide('loadingEventList');
      console.log('Ocultar Spinner');
    } else {
      console.log('No se cargo filterLoad ni eventsloaded');
    }
  }

  //Sort called from event-list.component
  sortEventsTableData() {
    console.log("sort data table --> #3########## eventsFiltered: ",this.eventsFiltered);
    this.eventsFiltered.sort((a, b) => {
      if (a.fecha_tracker > b.fecha_tracker) {
        return -1;
      }
      if (a.fecha_tracker < b.fecha_tracker) {
        return 1;
      }
      if (this.new_notif_stack.indexOf(a.id) > -1) {
        if (this.new_notif_stack.indexOf(b.id) > -1) {
          if (
            this.new_notif_stack.indexOf(a.id) >
            this.new_notif_stack.indexOf(b.id)
          ) {
            return -1;
          }
          return 1;
        }
        return -1;
      } else {
        if (this.new_notif_stack.indexOf(b.id) > -1) {
          return 1;
        }
        return -1;
      }
    });
    //console.log('Data Sorted', this.events);
  }

  // checkDuplicates() {
  //   // no hay eventos duplicados todo se resuelve en events_plataform
  // }

  markAsRead(event_id: string) {
    console.log('desde event service ... ');
    this.http
      .get<any>(
        environment.apiUrl + '/api/event-user/mark-as-viewed/' + event_id
      )
      .subscribe({
        next: (data) => {
          console.log(
            ' desde event service Mark ' + event_id + ' as read Success? : ',
            data.success
          );
        },
        error: () => {
          console.log(event_id + ': Hubo un error al marcar como leído');
        },
      });
  }

  async getReference(lat: any, lng: any) {
    console.log("en camino a ser reemplazado get reference ....");
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(
        `${environment.apiUrl}/api/event-user/get-reference`,
        {
          params: {
            latitud: lat,
            longitud: lng,
          },
        }
      )
      .toPromise();

    // console.log("===============================");
    // console.log(response);

    return response.data;
  }

  /**
   * name
   */
  public getContentPopup(event: any) {
    return getContentPopup(event);
  }

  public changeNameEvent(name: string) {
    if (name == 'gps') {
      return 'EVENTOS GPS TRACKER';
    } else if (name == 'platform') {
      return 'EVENTOS PLATAFORMA';
      // }else if (name == 'accessories'){
    } else if (name == '360') {
      return 'EVENTOS FATIGA 360º';
    } else if (name == 'security') {
      return 'EVENTOS SEGURIDAD VEHICULAR';
    } else if (name == 'mobile') {
      return 'EVENTOS SOLUCIONES MÓVILES´';
    } else {
      return 'EVENTOS ' + name.toUpperCase();
    }
  }

  public createEventList(data: any): any[] {
    // console.log('[event.service] createEventList', data);
    // let status_event = false;
    let map: any = [];
    for (let event of data) {
      // console.log('event: ', event);
      // status_event= false;
      event.event_category = this.changeNameEvent(event.event_category);

      const existingTypeEvent = map.find(
        (item: { label: any; items: any[] }) =>
          item.label === event.event_category
      );
      // console.log('existingTypeEvent', existingTypeEvent);
      if (existingTypeEvent) {
        // El tipo de evento ya existe en el mapa
        // console.log('el tipo de evento existe en el mapa.....');
        const existingEvent = existingTypeEvent.items.find(
          (existingItem: { name: any; value: any }) =>
            existingItem.value === event.slug
        );

        if (!existingEvent) {
          // console.log(
          //   'El id_event no existe para este tipo de evento, lo agregamos'
          // );
          existingTypeEvent.items.push({
            name: event.name_event,
            value: event.slug,
          });
        } else {
          // console.log('no existe el evento ', existingEvent);
        }
      } else {
        // El tipo de evento no existe en el mapa, lo añadimos
        map.push({
          label: event.event_category,
          items: [
            {
              name: event.name_event,
              value: event.slug,
            },
          ],
        });
      }
    }
    this.eventsGroupedList = map;
    this.eventsLength = data.length;
    this.eventsUserLoaded = true;
    return map;
  }
}
