import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { MapServicesService } from '../../map/services/map-services.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: any[] = [];
  public nombreComponente: string = 'EVENT-USER';
  public img_icon: string = 'assets/images/eventos/pin_point.svg';
  public img_iconSize: any = [30, 30];
  public img_iconAnchor: any = [0, 30];
  public eventsLayers = new L.LayerGroup();

  constructor(private http: HttpClient,public mapService: MapServicesService) {}

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
          event.layer.bindPopup(this.getPopupContent(event));
          // event.layer.addTo(this.eventsLayers);

          return event;
        });
      });
  }

  public getData() {
    return this.events;
  }

  public addNewEvent(event:any){
    this.events.unshift(event);
  }

  public getPopupContent(event:any){
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
              <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/entrada_zona.png" style="max-width: 35px !Important; max-height: 40px;"/>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px;" >
                <b>EVENTO:</b>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
              <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: black">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
              <td style="font-size: 10px; width: 80%;" ></td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
            </tr>
          </table>`
  }

}
