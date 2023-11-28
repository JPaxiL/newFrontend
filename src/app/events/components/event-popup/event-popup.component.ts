import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output, ViewChild, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { PopupContent, UserTracker } from 'src/app/multiview/models/interfaces';
import { CircularGeofencesMinimapService } from 'src/app/multiview/services/circular-geofences-minimap.service';
import { GeofencesMinimapService } from 'src/app/multiview/services/geofences-minimap.service';
import { GeopointsMinimapService } from 'src/app/multiview/services/geopoints-minimap.service';
import { LayersService } from 'src/app/multiview/services/layers.service';
import { SliderMultimediaComponent } from 'src/app/shared/components/slider-multimedia/slider-multimedia.component';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { PopupMap } from '../../models/popup-map';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.scss']
})
export class EventPopupComponent implements OnInit, AfterViewInit {
  @Input() configuration!: PopupContent;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

  mapItem!: PopupMap;
  mapLayers: L.LayerGroup[] = [];

  @ViewChild('appSlider') appSlider!: SliderMultimediaComponent;
  responsiveOptions:any[] = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
    
  has_multimedia = false;

  constructor(
    public layersService: LayersService,
    public geofencesService: GeofencesMinimapService,
    public circularGeofences: CircularGeofencesMinimapService,
    public geopointsService: GeopointsMinimapService,
    public eventService: EventService,
    public mapService: MapServicesService,
    private resolver: ComponentFactoryResolver, 
    private container: ViewContainerRef,
    private vehicleService: VehicleService
  ) {
   
  }

  ngOnInit(): void {
    this.configuration.vehicles?.forEach(item => {
      item.latitud = this.configuration.event.latitud;
      item.longitud = this.configuration.event.longitud;
    })
    this.configuration.event.parametros = this.paramsToObject(this.configuration.event.parametros);
    console.log("CONFIGURATION############", this.configuration);
    this.has_multimedia = this.configuration.event.parametros && (this.configuration.event.parametros.has_video == "1" || this.configuration.event.parametros.has_image == "1")
  }

  ngOnDestroy() {
    // Destruye el mapa al salir del componente para evitar el error
    if (this.mapItem) {
      this.mapItem.map!.remove();
    }
  }

  ngAfterViewInit() {
    this.createMap();
  }

  createMap() {
    setTimeout(() => {
      const mapContainer = document.getElementById(this.configuration.mapConf?.containerId!);
      if (mapContainer) {
        this.mapItem = new PopupMap(this.configuration);
        this.mapItem.createMap();
        this.setLayers();
        this.mapItem.drawIcon(this.configuration.vehicles!,this.configuration.event);
      }
    }, 1000);
  }

  deletePopup(){
    console.log("delete Popup: ");
    this.onDelete.emit(this.configuration.mapConf?.containerId);
    this.ngOnDestroy();
  }

  setLayers() {
    if(this.layersService.isReady){
      this.loadLayers();
    }else{
      this.layersService.servicesReady$.subscribe((ready: boolean) => {
        if (ready) {
          // Todos los servicios están listos, puedes ejecutar tu código aquí.
          this.loadLayers();
          //this.mapItem.map!.addLayer(this.mapLayers[0]);
        } else {
          // Al menos uno de los servicios aún no está listo, puedes mostrar un mensaje de carga o realizar otras acciones según tus necesidades.
          console.log('Esperando a que todos los servicios estén listos...');
        }
      });
    }
  }

  private loadLayers(){
      //console.log('¡Todos los servicios están listos!');
      const circular_geofences = this.circularGeofences.getData();
      const geofences = this.geofencesService.getData();
      const geopoints = this.geopointsService.getData();

      const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; GL Tracker',
        minZoom: 14,
        maxZoom: 17,
        crossOrigin: true
        // Otras opciones de configuración de la capa
      });
  
      mainLayer.addTo(this.mapItem.map!);
  
      var baseLayers = {
        OpenStreetMap: mainLayer
      };

      this.mapItem.map!.zoomControl.remove();
      // Crear el control de capas
      L.control.layers(baseLayers).addTo(this.mapItem.map!).remove();
      
      //this.mapItem.map!.zoomControl.setPosition('topright');
  
      this.addGeofencesToMap(circular_geofences);
      this.addGeofencesToMap(geofences);
      this.addGeofencesToMap(geopoints);
  }

  private addGeofencesToMap(geofences: any[]){
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


  eventOnMainMap(){
    console.log("viendo en mapa principal: ",this.configuration.event);
    this.showEvent(this.configuration.event);
  }

  eventOnStreetView(){
    console.log("viendo en street view");
    const urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+this.configuration.event.latitud+","+this.configuration.event.longitud+"&cbp=0,"+this.configuration.event.angulo+",0,0,0";
    window.open(urlGS, '_blank');
  }

  

  paramsToObject(params:string):any{
    const objParams:any = {};
    params.split('|').forEach((item:any) => {
      const [key, value] = item.split('=');
      objParams[key] = value;
    });
    return objParams;
  }

  
  async showEvent(event:any){
    if (this.eventService.activeEvent) {
      if(this.eventService.activeEvent.id == event.id && event.layer.isPopupOpen()){
        console.log("no hacer nada");
        return;
      }
      this.eventService.activeEvent.layer.closePopup();
      this.eventService.activeEvent.layer.unbindPopup();
      this.eventService.activeEvent.layer.off()
      this.hideEvent(this.eventService.activeEvent);
    }
    let reference = await this.eventService.getReference(event.latitud, event.longitud);
    event.referencia = reference.referencia;

    if(!event.viewed){
      event.viewed = true;
      //this.eventService.markAsRead(event.evento_id);
    }
    this.eventService.activeEvent = event;

    var eventClass:any = this.eventService.eventsClassList.filter((eventClass:any) => eventClass.tipo == event.tipo);
    eventClass = (eventClass.length > 0? eventClass[0].clase: 'default-event');
    
    this.eventService.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
    //si el evento es de cipia y tiene video(s)
    event.layer.bindPopup(this.eventService.getContentPopup(event), {
      className: eventClass,
      minWidth: 250,
      maxWidth: 350,
    });
    event.layer.on('click', () => {
      console.log("CLIIIIICK");
      this.addMultimediaComponent(event);
    });
    event.layer.addTo(this.eventService.mapService.map).openPopup();
    
    this.addMultimediaComponent(event);
  }

  private hideEvent(event:any){
    this.eventService.mapService.map!.removeLayer(event.layer);
    this.eventService.activeEvent = false;
  }

  showMultimedia(){
    console.log("Mostrando multimedia:");
    this.appSlider.changeShowMultimedia();
  }

  addMultimediaComponent(event:any){
    if(event.parametros && event.parametros.gps == "cipia" && (event.parametros.has_video != "0" || event.parametros.has_image != "0")){
      console.log("adding multimedia: ", event);
      
      const factory = this.resolver.resolveComponentFactory(SliderMultimediaComponent);
      const componentRef: ComponentRef<any> = this.container.createComponent(factory);
      const params:any = {
        'event': event, 
        'driver': this.vehicleService.vehicles.find(vh => vh.IMEI == event.imei)?.nombre_conductor??'',
        'showMultimediaFirst': true,
        'hasMultimedia':true,
        'showTitle':false
      };
      // Asignar datos al componente si existen
      
      Object.keys(
        params
      ).forEach((key) => {
        componentRef.instance[key] = params[key];
      });
      // Agregar el componente directamente al contenedor del popup
      const divContainer = document.getElementById('multimedia-'+event.parametros.eventId)!;
      
      divContainer.appendChild(componentRef.location.nativeElement);
    }
  }
  
}
