import * as L from 'leaflet';
import { HistorialService } from 'src/app/historial/services/historial.service';
import { UserTracker } from '../models/interfaces';
import { Map } from '../models/map';
import { CircularGeofencesMinimapService } from './circular-geofences-minimap.service';
import { GeofencesMinimapService } from './geofences-minimap.service';
import { GeopointsMinimapService } from './geopoints-minimap.service';
import { LayersService } from './layers.service';
import { MinimapToolbarService } from './minimap-toolbar.service';
import { MinimapService } from './minimap.service';

export class MinimapServiceService {
  mapItem!: Map;
  circular_geofences!: any[]
  geofences!: any[]
  geopoints!: any[]
  constructor(
    private minimapService: MinimapService,
    private historialService: HistorialService,
    private circularGeofences: CircularGeofencesMinimapService,
    private geofencesService: GeofencesMinimapService,
    private geopointsService: GeopointsMinimapService,
    private layersService: LayersService
    ) {
    }

  minimapToolbar = new MinimapToolbarService();

  createMap(containerId: string, configuration: UserTracker) {
    
    this.mapItem = new Map(configuration.numero_placa);
    this.mapItem.createMap(containerId,configuration);

    this.setLayers();
    this.loadMinimapService();
  }

  setLayers() {
    this.layersService.servicesReady$.subscribe((ready: boolean) => {
      if (ready) {
        // Todos los servicios están listos, puedes ejecutar tu código aquí.
        console.log('¡Todos los servicios están listos!');
        this.circular_geofences = this.circularGeofences.getData().slice();
        this.geofences = this.geofencesService.getData().slice();
        this.geopoints = this.geopointsService.getData().slice();

        this.addGeofencesToMap(this.circular_geofences);
        this.addGeofencesToMap(this.geofences);
        this.addGeofencesToMap(this.geopoints,false);

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
    
        var geos = L.layerGroup(this.geofences.map( (geo:any) => { return geo.geo_elemento}));
    
        var geoPoints =  L.layerGroup(this.geopoints.map( (point:any) => { return point.geo_elemento}));
    
        var circular_geos = L.layerGroup(this.circular_geofences.map( (circular_geo:any) => { return circular_geo.geo_elemento}));
    
        const overlays = {
          "Geocercas poligonales": geos,
          "Geopuntos": geoPoints,
          "Geocercas circulares": circular_geos,
          // " Geocercas circulares":
        }
    
        L.control.layers(baseLayers,overlays).addTo(this.mapItem.map!);
        this.mapItem.map!.zoomControl.setPosition('topright');
    
        this.mapItem.map!.addControl(this.minimapToolbar.createToolbar(this.mapItem.map!));

      } else {
        // Al menos uno de los servicios aún no está listo, puedes mostrar un mensaje de carga o realizar otras acciones según tus necesidades.
        console.log('Esperando a que todos los servicios estén listos...');
      }
    });
  }

  public addGeofencesToMap(geofences: any[], mouseEvents = true){
    geofences.forEach((geofence:any) => {
      if (geofence.zone_visible == "true") {
        geofence.geo_elemento.addTo(this.mapItem.map);
      }
  
      if (geofence.zone_name_visible == "true") {
        geofence.marker_name.addTo(this.mapItem.map);
      }
      if(mouseEvents){
        geofence.geo_elemento.on('mouseover', () => {
          //this.sortGeofencesBySize(this.geofences);
          //console.log(`Mouseover event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
          if(geofence.zone_name_visible != 'true'){
            //console.log('Mostrar tooltip');
            geofence.marker_name.addTo(this.mapItem.map);
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
      }
    });
  }

  loadMinimapService(){
    
    this.minimapService.addMap(this.mapItem);
    this.mapItem.map!.on('moveend', (ev) => {
      console.log("sobre Mapa: ", this.mapItem.id);
      var lvlzoom = this.minimapService.maps.find(item=>item.id == this.mapItem.id)!.map!.getZoom();
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
  

      var acum1 = 0.000000;
      var acum2 = nivel;

      var chckTrama = this.historialService.dataFormulario.chckTrama;
      var chckTramaFechaVelocidad = this.historialService.dataFormulario.chckTramaFechaVelocidad;

      
      console.log('check trama = '+chckTrama);
      
      var allH = this.historialService.arrayRecorridos;
      for (let j = 0; j < allH.length; j++) {
        var dH       = allH[j].recorrido;
        var mostrarR = allH[j].mostrarRuta;

        for (let i = 0; i < dH.length; i++) {
          this.minimapService.maps.find(item=>item.id == this.mapItem.id)!.map!.removeLayer(dH[i]._trama);
          this.minimapService.maps.find(item=>item.id == this.mapItem.id)!.map!.removeLayer(dH[i]._trama_fecha_velocidad);

        }

        if (lvlzoom >= 12) {
            if (chckTrama && mostrarR) {
              for (let i = 0; i < dH.length; i++) {
                if (isNaN(parseFloat(dH[i].distancia))) {
                  // console.log("----------DAA---------");
                } else {
                  acum1 = acum1 + parseFloat(dH[i].distancia);
                  // console.log(acum1 +"  -  "+acum2+"  -  "+parseFloat(dH[i].distancia));
                }
                dH[i]._trama.addTo(this.minimapService.maps.find(item=>item.id == this.mapItem.id)!.map);
                if ( acum1 > acum2 ) {
                  acum1 = 0;
                  // console.log(acum1 +"  -  "+ acum2);
                  if ( chckTramaFechaVelocidad  ) {
                    if(this.minimapService.maps.find(item=>item.id == this.mapItem.id)!.map!.getBounds().contains(dH[i]._trama.getLatLng())){
                      dH[i]._trama_fecha_velocidad.addTo(this.minimapService.maps.find(item=>item.id == this.mapItem.id)!.map!);
                    } 
                  }
                }
              }
            } 
        }

      }

    });
  }

}
