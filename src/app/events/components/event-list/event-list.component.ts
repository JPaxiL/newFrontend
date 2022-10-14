import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventSocketService } from './../../services/event-socket.service';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { EventService } from '../../services/event.service';
import { getContentPopup } from '../../helpers/event-helper';
import { forEachChild } from 'typescript';
import { NgxSpinnerService } from 'ngx-spinner';
import { PanelService } from 'src/app/panel/services/panel.service';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {

  tipoEvento: any = [];
  selectedEvent: any = {};
  activeEvent: any = false;

  noResults: boolean = false;

  public events:any[] = [];
  public placa:string = '';

  constructor(
    public eventService: EventService,
    public mapService: MapServicesService,
    public ess:EventSocketService,
    private spinner: NgxSpinnerService,
    private http:HttpClient,
    ) {
      // this.tipoEvento = [
      //   { id: 0, option: 'Todos los Eventos', tipo: '' },
      //   { id: 1, option: 'Alcoholemia', tipo: '' },
      //   { id: 2, option: 'Somnolencia', tipo: 'Somnolencia', clase: 'somnolencia' },
      //   { id: 3, option: 'Distracción', tipo: 'Distraccion', clase: 'distraccion' },
      //   { id: 4, option: 'Batería Desconectada', tipo: 'Bateria desconectada', clase: 'bateria-desconectada' },
      //   { id: 5, option: 'Aceleración Brusca', tipo: 'Aceleracion brusca', clase: 'aceleracion-brusca' },
      //   { id: 6, option: 'Frenada Brusca', tipo: 'Frenada brusca', clase: 'frenada-brusca' },
      //   { id: 7, option: 'S.O.S.', tipo: 'SOS', clase: 'sos-event' },
      //   { id: 8, option: 'Zona de Entrada', tipo: 'Zona de entrada', clase: 'zona-entrada' },
      //   { id: 9, option: 'Zona de Salida', tipo: 'Zona de salida', clase: 'zona-salida' },
      //   { id: 10, option: 'Tiempo de estadía en zona', tipo: 'Tiempo de estadia en zona', clase: 'tiempo-estadia-zona' },
      //   { id: 11, option: 'Parada en zona no autorizada', tipo: 'Parada en zona no autorizada', clase: 'parada-zona-no-autorizada' },
      //   { id: 12, option: 'Exceso de velocidad', tipo: 'Exceso de Velocidad', clase: 'exceso-velocidad' },
      //   { id: 13, option: 'Transgresión', tipo: '' },
      //   { id: 14, option: 'Infracción', tipo: 'Infraccion', clase: 'infraccion' },
      //   { id: 15, option: 'Vehículo sin programación', tipo: 'Vehiculo sin programacion', clase: 'vehiculo-sin-programacion' },
      //   { id: 16, option: 'Mantenimiento preventivo', tipo: 'Mantenimiento preventivo', clase: 'mantenimiento-preventivo' },
      //   { id: 16, option: 'Mantenimiento preventivo realizado', tipo: 'Mantenimiento preventivo realizado', clase: 'mantenimiento-preventivo-realizado' },
      //   { id: 17, option: 'Mantenimiento correctivo', tipo: 'Mantenimiento correctivo', clase: 'mantenimiento-correctivo' },
      //   { id: 18, option: 'Mantenimiento correctivo realizado', tipo: 'Mantenimiento correctivo realizado', clase: 'mantenimiento-correctivo-realizado' },
      //   { id: 19, option: 'Motor apagado', tipo: 'Motor apagado', clase: 'motor-apagado' },
      //   { id: 20, option: 'Motor encendido', tipo: 'Motor encendido', clase: 'motor-encendido' },

      //   { id: 21, option: 'Fatiga', tipo: 'Fatiga', clase: 'fatiga' },
      //   { id: 22, option: 'Posible Fatiga', tipo: 'Posible Fatiga', clase: 'posible-fatiga' },
      //   { id: 23, option: 'Fatiga Extrema', tipo: 'Fatiga Extrema', clase: 'fatiga-extrema' },
      //   { id: 24, option: 'Desvío de carril hacia la izquierda', tipo: 'Desvío de carril hacia la izquierda', clase: 'desvio-carril-izq' },
      //   { id: 25, option: 'Desvío de carril hacia la derecha', tipo: 'Desvío de carril hacia la derecha', clase: 'desvio-carril-der' },
      //   { id: 26, option: 'Bloqueo de visión del Mobileye', tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
      //   { id: 27, option: 'Colisión con peatones', tipo: 'Colisión con peatones', clase: 'colision-peatones' },
      //   { id: 28, option: 'Colisión con delantera', tipo: 'Colisión delantera', clase: 'colision-delantera' },
      //   { id: 29, option: 'Bloqueo de visión del mobileye', tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
      // ];
    }

  ngOnInit(): void {
    this.selectedEvent = null;
    if(!this.eventService.eventsLoaded || !this.eventService.filterLoaded){
      this.spinner.show('loadingEventList');
    }
    this.loadFilterData();
  }

  ngOnDestroy(){
    if(this.eventService.activeEvent){
      this.hideEvent(this.eventService.activeEvent);
    }
  }

  async loadFilterData(){
    if(!this.eventService.hasEventPanelBeenOpened){
      this.eventService.hasEventPanelBeenOpened = true;
      console.log('Cargando Filtros...');
      //this.tipoEvento = await this.eventService.getAllEventsForTheFilter();
      await this.eventService.getAllEventsForTheFilter();
      this.eventService.filterLoaded = true;
      console.log('Filtros cargados');
    }
    this.tipoEvento = this.eventService.getFilters();
    this.eventService.showEventPanel();
    
    /* this.tipoEvento.unshift({ id: 0, option: 'Todos los Eventos', tipo: '' }); */
  }

  public showEvent(event:any){
    if(this.eventService.activeEvent) {
      this.hideEvent(this.eventService.activeEvent);
      //console.log('Ocultar evento previo');
    }

    if(!event.viewed){
      event.viewed = true;
      this.markAsRead(event.id);
    }

    var eventClass:any = this.eventService.eventsClassList.filter((eventClass:any) => eventClass.tipo == event.tipo);
    eventClass = (eventClass.length > 0? eventClass[0].clase: 'default-event');

    this.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
    event.layer.bindPopup(getContentPopup(event), {
      className: eventClass,
      minWidth: 250,
      maxWidth: 350,
    } );
    this.eventService.activeEvent = event;
    event.layer.addTo(this.mapService.map).openPopup();
  }

  public hideEvent(event:any){
    this.mapService.map.removeLayer(event.layer);
    this.eventService.activeEvent = false;
  }

  private markAsRead(event_id: any){
    console.log('Marking ' + event_id + ' as read...');
    //this.eventService.decreaseUnreadCounter();
    this.eventService.updateUnreadCounter();
    this.http.get<any>(environment.apiUrl + '/api/event-user/mark-as-viewed/' + event_id).subscribe({
      next: data => {
        console.log('Mark ' + event_id + ' as read Success? : ', data.success);
      },
      error: () => {
        console.log(event_id + ': Hubo un error al marcar como leído');
      }
    });
  }

  public switchEventOnMap(event: any, currentRow: HTMLElement){
    if(event.id == this.eventService.activeEvent.id){
      this.hideEvent(this.eventService.activeEvent);
    } else {
      currentRow.classList.add('watched-event');
      //console.log('Mostrando evento con ID: ', event.id);
      this.showEvent(event); 
    }
  }

  public checkPopupExist(){
    return document.querySelectorAll('.leaflet-popup').length > 0;
  }

  public changeTypeEvent(){
    /* if(this.selectedEvent == ''){ */
    if(this.selectedEvent === null){
      this.eventService.eventsFiltered = this.eventService.getData();
      this.noResults = false;
    }else{
      this.eventService.eventsFiltered = this.eventService.getData().filter( (event:any)  => {
        return event.tipo == this.selectedEvent
      });
      this.noResults = this.eventService.eventsFiltered.length == 0;
    }
  }

  public searchByPlate(){
    if(this.placa == ''){
      this.eventService.eventsFiltered = this.eventService.getData();
      this.noResults = false;
    }else {
      this.eventService.eventsFiltered =  this.eventService.getData().filter( (event:any)  => {
        return event.nombre_objeto.toLowerCase().match(this.placa.toLowerCase())
      });
      this.noResults = this.eventService.eventsFiltered.length == 0;
    }
    //console.log(this.eventService.eventsFiltered);
    //console.log(this.noResults);
  }

}
