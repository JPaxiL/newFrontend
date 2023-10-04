import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';

//import { MinimapService } from '../services/minimap.service';
import { GridItem, MinimapContent, UnitItem, UserTracker } from '../models/interfaces';
import { CircularGeofencesMinimapService } from '../services/circular-geofences-minimap.service';
import { GeofencesMinimapService } from '../services/geofences-minimap.service';
import { GeopointsMinimapService } from '../services/geopoints-minimap.service';

import { LayersService } from '../services/layers.service';
import { Map } from '../models/map';
import { MinimapService } from '../services/minimap.service';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: [
    './minimap.component.scss'
  ],
  //providers: [CircularGeofencesMinimapService,GeofencesMinimapService,GeopointsMinimapService]
})
export class MinimapComponent implements OnInit, AfterViewInit {
  @Input() configuration!: GridItem;
  @Input() title!: string;
  @Input() idContainer!: string;
  miniMap!: MinimapContent;
  mapItem!: Map;

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
    this.miniMap = {
      imeis: this.configuration.content!.imeis,
      title: this.configuration.label!.toUpperCase(),
      events: 0,
      id_container: this.idContainer!
    }
    console.log("miniMap: ", this.miniMap);
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
    console.log("minimap: ", this.miniMap);
    
  }

  createMap() {
    console.log("CREATE MAPPPPPPPPPP");
    const containerId = 'map-container-'+this.idContainer.toString();
    const mapContainer = document.getElementById(containerId);
    console.log("no llego aca", mapContainer);
    if (mapContainer) {
      this.mapItem = new Map(this.miniMap.id_container!);
      this.mapItem.createMap(containerId,this.miniMap as MinimapContent);
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

        const mainLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            minZoom: 4,
            maxZoom: 18,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        );
    
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
      console.log("sobre Mapa: ", this.mapItem.id);
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
