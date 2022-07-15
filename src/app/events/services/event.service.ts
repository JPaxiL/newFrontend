import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { MapServicesService } from '../../map/services/map-services.service';
import { getContentPopup } from '../helpers/event-helper';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public events: any[] = [];
  public nombreComponente: string = 'EVENT-USER';
  public img_icon: string = 'assets/images/eventos/pin_point.svg';
  public img_iconSize: any = [30, 30];
  public img_iconAnchor: any = [0, 30];
  public eventsLayers = new L.LayerGroup();

  //Para animación de carga
  public loadingEvents: boolean = true;
  public loadingEventFilters: boolean = true;

  public eventsHistorial: any = []; //==> Usado en el modulo historial

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
    await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user`)
      .toPromise()
      .then((response) => {
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

          return event;
        });
        
        console.log('Eventos cargados');
        this.loadingEvents = false;
        this.hideLoadingSpinner();
      });
  }

  public getData() {
    return this.events;
  }

  public addNewEvent(event:any){
    this.events.unshift(event);
  }

  public async getAllEventsForTheFilter() {
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/events`).toPromise();
    let events = response.data;

    this.loadingEventFilters = false;
    console.log('Filtros cargados');
    this.hideLoadingSpinner();

    return events.map( (event:any) => ({
      id:event.id,
      option:event.name,
      tipo:event.name
    }));
  }

  private hideLoadingSpinner(){
    if(!this.loadingEvents && !this.loadingEventFilters){
      console.log('Panel Notif cargado totalmente');
      this.spinner.hide('loadingEventList');
    }
  }


    //== Para el uso del modulo historial


    eventPopupClass = [
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
      { tipo: 'Posible Fatiga', clase: 'posible-fatiga' },
      { tipo: 'Fatiga Extrema', clase: 'fatiga-extrema' },
    ];


    public async ShowAllHistorial(param : any,
    ) {
      await this.http.post(`${environment.apiUrl}/api/dataEventUserHistorial`,param)
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
            var eventClass:any = this.eventPopupClass.filter((eventClass:any) => eventClass.tipo == event.tipo);
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

    public async LocalizarEventoHistorial(id : any) {

    }




}
