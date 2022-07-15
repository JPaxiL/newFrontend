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
  public loadingEvents: boolean = true;
  public loadingEventFilters: boolean = true;

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

}
