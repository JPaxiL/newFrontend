import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import { OverlayPanel } from 'primeng-lts/overlaypanel';
import { getContentPopup } from 'src/app/events/helpers/event-helper';
//import { MinimapService } from '../services/minimap.service';
import { Event, GridItem, MinimapContent, TableRowSelectEvent, UnitItem, UserTracker } from '../models/interfaces';
import { CircularGeofencesMinimapService } from '../services/circular-geofences-minimap.service';
import { GeofencesMinimapService } from '../services/geofences-minimap.service';
import { GeopointsMinimapService } from '../services/geopoints-minimap.service';

import { LayersService } from '../services/layers.service';
import { MiniMap } from '../models/mini-map';
import { MinimapService } from '../services/minimap.service';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: [
    './minimap.component.scss'
  ],
  //providers: [CircularGeofencesMinimapService,GeofencesMinimapService,GeopointsMinimapService]
})
export class MinimapComponent implements OnInit, AfterViewInit  {
  @Input() configuration!: GridItem;
  @Input() title!: string;
  @Input() idContainer!: string;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  miniMap!: MinimapContent;
  mapItem!: MiniMap;

  events:Event[] = [];
  eventSelected!: Event;
  @ViewChildren(OverlayPanel) overlayPanels!: QueryList<OverlayPanel>;

  
  mapLayers: L.LayerGroup[] = [];
  constructor(
    public minimapService: MinimapService,
    public layersService: LayersService,
    public geofencesService: GeofencesMinimapService,
    public circularGeofences: CircularGeofencesMinimapService,
    public geopointsService: GeopointsMinimapService
  ) {
   
  }

  ngOnInit(): void {
    //Si es GridItem se debe convertir en tipo MinimapContent
    console.log("configuration: ", this.configuration);
    this.miniMap = {
      imeis: this.configuration.content!.imeis,
      title: this.configuration.label!.toUpperCase(),
      nEvents: 0,
      events:[],
      mapConf: {containerId: 'map-container-'+this.idContainer!}

    }
    console.log("miniMap: ", this.miniMap);
    this.events = [
      {
        id: '1',
        evento: 'exceso velocidad1',
        nombre: 'Exceso de Velocidad1',
        clase: 'Clase1',
        viewed: false,
        nombre_objeto: "Gltracker",
        fecha_tracker: "24/07/2023 19:45:23"
      },
      {
        id: '2',
        evento: 'exceso velocidad2',
        nombre: 'Exceso de Velocidad2',
        clase: 'Clase2',
        viewed: false,
        nombre_objeto: "Gltracker",
        fecha_tracker: "24/07/2023 20:45:23"
      },
      {
        id: '3',
        evento: 'exceso velocidad3',
        nombre: 'Exceso de Velocidad3',
        clase: 'Clase3',
        viewed: false,
        nombre_objeto: "Gltracker",
        fecha_tracker: "24/07/2023 21:45:23"
      },
      {
        id: '4',
        evento: 'exceso velocidad4',
        nombre: 'Exceso de Velocidad4',
        clase: 'Clase4',
        viewed: false,
        nombre_objeto: "Gltracker",
        fecha_tracker: "24/07/2023 22:45:23"
      },
      {
        id: '5',
        evento: 'exceso velocidad5',
        nombre: 'Exceso de Velocidad5',
        clase: 'Clase5',
        viewed: false,
        nombre_objeto: "Gltracker",
        fecha_tracker: "24/07/2023 23:45:23"
      }
    ]
   
  }
  ngOnDestroy() {
    // Destruye el mapa al salir del componente para evitar el error
    if (this.mapItem) {
      this.mapItem.map!.remove();
    }
  }

  ngAfterViewInit() {

    

    if(this.minimapService.vehicleServiceIsReady){
      this.miniMap.vehicles = this.minimapService.getVehicles().filter((vh:UserTracker) => this.configuration.content?.imeis.includes(vh.IMEI!.toString()));
      this.createMap();
    }else{
      this.minimapService.vehicleServiceReady.subscribe(data => {
        this.miniMap.vehicles = data.filter((vh:UserTracker) => this.configuration.content?.imeis.includes(vh.IMEI!.toString()));
        this.createMap();
      })
    }

  }

  openOverlay(event: any, id:string){
    this.overlayPanels.find(item => item.el.nativeElement.id == id)!.show(event);
  }

  onEventSelect(event: TableRowSelectEvent, op_id: string) {
    //event.data
    this.overlayPanels.find(item => item.el.nativeElement.id == op_id)!.hide();
  }
  public async switchEventOnMap(event: any, currentRow: HTMLElement, op_id:string){
    this.overlayPanels.find(item => item.el.nativeElement.id == op_id)!.hide();
    console.log("click event....",event.evento_id);
    currentRow.classList.add('watched-event');
    console.log('Mostrando evento con ID: ', event.evento_id);
    let reference = await this.minimapService.eventService.getReference(event.latitud, event.longitud);
    event.referencia = reference.referencia;
    this.showEvent(event);
  }

  public showEvent(event:any){
    if(this.minimapService.eventService.activeEvent) {
      console.log("hide event");
      this.hideEvent(this.minimapService.eventService.activeEvent);
      //console.log('Ocultar evento previo');
    }

    if(!event.viewed){
      event.viewed = true;
      this.markAsRead(event.evento_id);
      this.mapItem.minimapConf!.nEvents = this.mapItem.minimapConf!.events?.filter(ev => ev.viewed == false).length;
    }

    let eventClass:any = this.minimapService.eventService.eventsClassList.filter((eventClass:any) => eventClass.tipo == event.tipo);
    eventClass = (eventClass.length > 0? eventClass[0].clase: 'default-event');

    this.mapItem.map!.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
    event.layer.bindPopup(getContentPopup(event), {
      className: eventClass,
      minWidth: 250,
      maxWidth: 350,
    });
    this.minimapService.eventService.activeEvent = event;
    event.layer.addTo(this.mapItem.map).openPopup();
  }

  private markAsRead(event_id: any){
    console.log('Marking ' + event_id + ' as read...');
    //this.eventService.decreaseUnreadCounter();
    this.minimapService.eventService.updateUnreadCounter();
    this.minimapService.eventService.markAsRead(event_id);
  }

  public hideEvent(event:any){
    this.mapItem.map!.removeLayer(event.layer);
    this.minimapService.eventService.activeEvent = false;
  }

  deleteMap(){
    //Eliminamos la instancia en minimap service
    this.minimapService.maps = this.minimapService.maps.filter(map => map.containerId !== this.mapItem.containerId);
    this.onDelete.emit(this.idContainer);
    setTimeout(() => {
      this.minimapService.resizeMaps();
    }, 300);
  }

  createMap() {
    console.log("CREATE MAPPPPPPPPPP");
    const containerId = 'map-container-'+this.idContainer.toString();
    const mapContainer = document.getElementById(containerId);
    console.log("no llego aca", mapContainer);
    if (mapContainer) {
      this.mapItem = new MiniMap(this.miniMap as MinimapContent);
      this.mapItem.createMap();
      this.setLayers();
      this.loadMinimapService();
      //this.minimapService.addMap(this.mapItem);
    }
  }

  setLayers() {
    this.layersService.servicesReady$.subscribe((ready: boolean) => {
      if (ready) {
        // Todos los servicios están listos, puedes ejecutar tu código aquí.
        console.log('¡Todos los servicios están listos!');
        const circular_geofences = this.circularGeofences.getData();
        const geofences = this.geofencesService.getData();
        const geopoints = this.geopointsService.getData();

        const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; GL Tracker',
          minZoom: 4,
          maxZoom: 18,
	        crossOrigin: true
          // Otras opciones de configuración de la capa
        });
    
        mainLayer.addTo(this.mapItem.map!);
        // Google Map Layer
    
        const googleTerrain = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          {
            minZoom: 4,
            maxZoom: 18,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
    
        const googleHybrid = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          {
            minZoom: 4,
            maxZoom: 18,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
    
        const googleStreets = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          {
            minZoom: 4,
            maxZoom: 18,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
    
        // Satelite Layer
        const googleSat = L.tileLayer(
          'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          {
            minZoom: 4,
            maxZoom: 18,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
    
        var baseLayers = {
          OpenStreetMap: mainLayer,
          'Google Terrain': googleTerrain,
          'Google Hybrid': googleHybrid,
          'Google Streets': googleStreets,
          'Google Satellite': googleSat,
        };
    
        const geos = L.layerGroup(geofences.map( (geo:any) => { return geo.geo_elemento}));
        const geoPoints =  L.layerGroup(geopoints.map( (point:any) => { return point.geo_elemento}));
        const circular_geos = L.layerGroup(circular_geofences.map( (circular_geo:any) => { return circular_geo.geo_elemento}));
    
        const overlays = {
          "Geopuntos": geoPoints,
          "Geocercas circulares": circular_geos,
          "Geocercas poligonales": geos,
        }

        // Crear el control de capas
        L.control.layers(baseLayers,overlays).addTo(this.mapItem.map!);
        
        this.mapItem.map!.zoomControl.setPosition('topright');
    
        //this.mapItem.map!.addControl(this.minimapToolbar.createToolbar(this.mapItem.map!));
        this.addGeofencesToMap(circular_geofences);
        this.addGeofencesToMap(geofences);
        this.addGeofencesToMap(geopoints,false);
        //this.mapItem.map!.addLayer(this.mapLayers[0]);
      } else {
        // Al menos uno de los servicios aún no está listo, puedes mostrar un mensaje de carga o realizar otras acciones según tus necesidades.
        console.log('Esperando a que todos los servicios estén listos...');
      }

    });
  }

  private addGeofencesToMap(geofences: any[], mouseEvents = true){
    for(const geofence of geofences){
      //console.log("adding geofence ",geofence);
      if (geofence.zone_visible == "true") {
        geofence.geo_elemento.addTo(this.mapItem.map!);
      }
      if (geofence.zone_name_visible == "true") {
        geofence.marker_name.addTo(this.mapItem.map);
      }
    }
  }
  /*
      if(mouseEvents){
        geofence.geo_elemento.on('mouseover', () => {
          //this.sortGeofencesBySize(this.geofences);
          //console.log(`Mouseover event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
          if(geofence.zone_name_visible != 'true'){
            //console.log('Mostrar tooltip');
            geofence.marker_name.addTo(this.mapItem.map!);
          }
          //console.log(geofence.geo_elemento.getLatLngs());
          //console.log(L.GeometryUtil.geodesicArea((geofence.geo_elemento.getLatLngs()[0])));
        });
        geofence.geo_elemento.on('mouseout', () => {
          //console.log(`MouseOUT event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
          if(geofence.zone_name_visible != 'true'){
            //console.log('Eliminar tooltip');
            this.mapItem.map!.removeLayer(geofence.marker_name);
          }
        });
      }*/

  loadMinimapService(){
    this.minimapService.addMap(this.mapItem);
    this.mapItem.map!.on('moveend', (ev) => {
      var lvlzoom = this.mapItem.map!.getZoom();
      console.log("sobre Mapa: ", this.mapItem.containerId);
      console.log("Zoom level: ", lvlzoom);
      var nivel = 1000; // todo
      var ccont = 0;
      switch (lvlzoom) {
        case 12:
          nivel = 1000; //todo
          console.log("-------12 - 1000");
          break;
        case 13:
          nivel = 600; //todo
          console.log("-------13 - 600");
          break;
        case 14:
          nivel = 400; //todo
          console.log("-------14 - 400");
          break;
        case 15:
          nivel = 300; //todo
          console.log("-------15 - 200");
          break;
        case 16:
          nivel = 200; //todo
          console.log("-------16 - 100");
          break;
        case 17:
          nivel = 100; //todo
          console.log("-------17 - 50");
          break;
        case 18:
          nivel = 1; //todo
          console.log("-----a--18 - 1");
          break;
        default:
          nivel = 1000; // todo
          console.log("-------default");
          break;
      }

    });
  }
}
