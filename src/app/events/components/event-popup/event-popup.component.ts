import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import { PopupContent, UserTracker } from 'src/app/multiview/models/interfaces';
import { CircularGeofencesMinimapService } from 'src/app/multiview/services/circular-geofences-minimap.service';
import { GeofencesMinimapService } from 'src/app/multiview/services/geofences-minimap.service';
import { GeopointsMinimapService } from 'src/app/multiview/services/geopoints-minimap.service';
import { LayersService } from 'src/app/multiview/services/layers.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { PopupMap } from '../../models/popup-map';

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

  constructor(
    private vehicleService: VehicleService,
    public layersService: LayersService,
    public geofencesService: GeofencesMinimapService,
    public circularGeofences: CircularGeofencesMinimapService,
    public geopointsService: GeopointsMinimapService
  ) {
   
  }

  ngOnInit(): void {

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
      console.log("CREATE MAPPPPPPPPPP");
      console.log("ByID: ",this.configuration.mapConf?.containerId!);
      
      const mapContainer = document.getElementById(this.configuration.mapConf?.containerId!);
      console.log("no llego aca", mapContainer);
      if (mapContainer) {
        this.mapItem = new PopupMap(this.configuration);
        this.mapItem.createMap();
        this.setLayers();
        this.mapItem.drawIcon(this.configuration.vehicles!,this.configuration.event);
      }
    }, 5000);
  }

  deletePopup(){
    console.log("delete Popup: ");
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
}
