import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventSocketService } from './../../services/event-socket.service';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { EventService } from '../../services/event.service';
import { getContentPopup } from '../../helpers/event-helper';
import { forEachChild } from 'typescript';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {

  tipoEvento: any = [];
  selectedEvent: any = {};
  eventPopupClass: any ={};
  activeEventLayer: any = false;

  public events:any[] = [];
  public placa:string = '';

  constructor(
    public eventService: EventService,
    public mapService: MapServicesService,
    public ess:EventSocketService,
    private spinner: NgxSpinnerService
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

      this.eventPopupClass = [
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

      this.selectedEvent = 0;

    }

  ngOnInit(): void {
    this.spinner.show('loadingEventList');
    this.eventService.loadingEvents = true;
    this.eventService.loadingEventFilters = true;

    this.events = this.eventService.getData();
    this.loadData()
  }

  async loadData(){
    this.tipoEvento = await this.eventService.getAllEventsForTheFilter();
    /* this.tipoEvento.unshift({ id: 0, option: 'Todos los Eventos', tipo: '' }); */

    //Trigger reload of event table
    this.selectedEvent = null;
    this.changeTypeEvent();
  }

  public showEvent(event:any){
    if(this.activeEventLayer) {
      this.hideEvent(this.activeEventLayer);
    }
    var eventClass:any = this.eventPopupClass.filter((eventClass:any) => eventClass.tipo == event.tipo);
    eventClass = (eventClass.length > 0? eventClass[0].clase: 'default-event');

    this.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
    event.layer.bindPopup(getContentPopup(event), {
      className: eventClass,
      minWidth: 250,
      maxWidth: 350,
    } );
    this.activeEventLayer = event;
    event.layer.addTo(this.mapService.map).openPopup();
  }

  public hideEvent(event:any){
    this.mapService.map.removeLayer(event.layer);
    this.activeEventLayer = false;
  }

  public switchEventOnMap(event: any, currentRow: HTMLElement){
    if(currentRow.classList.contains('tr-selected')){
      currentRow.classList.remove('tr-selected');
      this.hideEvent(event);
    } else {
      for(let i = 0; i < document.querySelectorAll('tr.tr-selected').length; i++){
        document.querySelectorAll('tr.tr-selected')[i].classList.remove('tr-selected');
      }
      currentRow.classList.add('tr-selected');
      this.showEvent(event); 
    }
  }

  public checkPopupExist(){
    return document.querySelectorAll('.leaflet-popup').length > 0;
  }

  public changeTypeEvent(){
    /* if(this.selectedEvent == ''){ */
    if(this.selectedEvent === null){
      this.events = this.eventService.getData();
    }else{
      this.events = this.eventService.getData().filter( (event:any)  => {
        return event.tipo == this.selectedEvent
      });
    }
  }

  public searchByPlate(){
    if(this.placa == ''){
      this.events = this.eventService.getData();
    }else {
      this.events =  this.eventService.getData().filter( (event:any)  => {
        return event.nombre_objeto.toLowerCase().match(this.placa.toLowerCase())
      });
    }
  }
}
