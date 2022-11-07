

import { EventEmitter, Injectable, Output } from '@angular/core';
import * as L from 'leaflet';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class ToolbarMapService {
  map!: L.Map; //guardara el mapa
  toolbar: any;
  showDialog:boolean = false;

  container = L.DomUtil.create(
    'div',
    'leaflet-bar leaflet-control leaflet-control-custom'
  );

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private vehicleService: VehicleService) {}

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
        return this.container;
      },
    };

    const toolbar = L.Control.extend(this.toolbar);
    return new toolbar()
  }

  createGroupAndUngroup() {
    var group = L.DomUtil.create('a', 'leaflet-link', this.container);

    var iGroup = L.DomUtil.create('i', 'fa fa-crosshairs', group);

    group.onclick = () => {
      //metodo
    };
  }

  createLocation() {
    var location = L.DomUtil.create('a', 'leaflet-link', this.container);

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

          popup.on('remove', (e) => {
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

    var iCoordinate = L.DomUtil.create('i', 'fa fa-arrows', coordinate);

    coordinate.onclick = () => {
      //metodo
      this.change.emit(true);
    };
  }
}
