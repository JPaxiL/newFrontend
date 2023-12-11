

import { EventEmitter, Injectable, Output } from '@angular/core';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';

declare let L: any;
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.es';
import { MapService } from 'src/app/vehicles/services/map.service';

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class ToolbarMapService {
  map!: L.Map; //guardara el mapa
  toolbar: any;
  showDialog:boolean = false;

  showDistance:boolean = false;

  measureControl = new L.control.measure(
    { position: 'topright',
      primaryLengthUnit: 'kilometers',
      secondaryLengthUnit: 'feet',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      localization: 'es',
      activeColor: 'blue',
      completedColor: '#9900ff',
      captureZIndex: 10000
   });


  container = L.DomUtil.create(
    'div',
    'leaflet-bar leaflet-control leaflet-control-custom'
  );

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() searchClick: EventEmitter<boolean> = new EventEmitter();

  constructor(private mapService: MapService) {}

  createToolbar(map: L.Map) {
    this.map = map;
    this.toolbar = {
      options: {
        position: 'topright',
      },

      onAdd: (map: any) => {
        this.createGroupAndUngroup();
        this.createLocation();
        this.createCoordinate();
        this.createDistance();
        this.createSearchItems();
        return this.container;
      },
    };

    const toolbar = L.Control.extend(this.toolbar);
    return new toolbar()
  }

  createGroupAndUngroup() {
    var group = L.DomUtil.create('a', 'leaflet-link', this.container);

    group.title = "Agrupar / Desagrupar";

    var iGroup = L.DomUtil.create('i', 'fa fa-crosshairs', group);

    group.onclick = () => {

      if(this.mapService.getClustering){

        this.mapService.markerClusterGroup.disableClustering();
      }else{
        this.mapService.markerClusterGroup.enableClustering();
      }

      this.mapService.changeClusteringVisibility(!this.mapService.getClustering);


    };
  }

  createLocation() {
    var location = L.DomUtil.create('a', 'leaflet-link', this.container);

    location.title = "Mi ubicación";

    var iLocation = L.DomUtil.create('i', 'fa fa-map-marker btn1', location);

    location.onclick = () => {
      var marker: any, circle: any, lat, long, accuracy;

      if (!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!");
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          lat = position.coords.latitude;
          long = position.coords.longitude;
          accuracy = position.coords.accuracy;

          marker = L.marker([lat, long], {
            icon: L.icon({
              iconUrl: '/assets/images/realestate.png',
              iconAnchor: [16, 37],
            }),
          });

          let popup = L.popup({ offset: new L.Point(0, -20) })
            .setLatLng([lat, long])
            .setContent(
              '<span>Usted está a ' +
                position.coords.accuracy +
                ' metros ala <br>redonda aproximadamente.</span>'
            )
            .addTo(this.map);

          circle = L.circle([lat, long], accuracy, {
            radius: accuracy,
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.1,
            opacity: 0.3,
            weight: 1,
          });

          var featureGroup = L.featureGroup([marker, circle]).addTo(this.map);

          popup.on('remove', () => {
            this.map.removeLayer(featureGroup);
          });

          this.map.setZoom(15);
          this.map.panTo([lat, long]);
        });
      }
    };
  }

  createCoordinate(){
    var coordinate = L.DomUtil.create('a', 'leaflet-link', this.container);

    coordinate.title = "Coordenadas";

    var iCoordinate = L.DomUtil.create('i', 'fa fa-arrows', coordinate);

    coordinate.onclick = () => {
      //metodo
      this.change.emit(true);
    };
  }

  createSearchItems(){
    var coordinate = L.DomUtil.create('a', 'leaflet-link', this.container);

    coordinate.title = "Búsqueda";

    L.DomUtil.create('i', 'fa fa-search', coordinate);

    coordinate.onclick = () => {
      this.searchClick.emit(true);
    };
  }

  createDistance(){

    var distance = L.DomUtil.create('a', 'leaflet-link', this.container);

    distance.title = "Distancia";

    var iDistance = L.DomUtil.create('i', 'fa fa-road', distance);

    distance.onclick = () => {

       if(this.showDistance == false){
          this.measureControl.addTo(this.map);
          $('.leaflet-control-measure').css("max-width", "400px");
          this.showDistance = true;
       }else {
          this.map.removeControl(this.measureControl);
          this.showDistance = false;
       }
    };
  }
}
