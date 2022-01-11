import { Component, OnInit } from '@angular/core';
// import {latLng, MapOptions, tileLayer, Map, Marker, icon} from 'leaflet';
import * as L from 'leaflet';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  mapOptions!: L.MapOptions;
  map!: L.Map;
  // markerClusterGroup!: L.MarkerClusterGroup;
  markerClusterData! : any;
  private centroid: L.LatLngExpression = [-11.107323, -75.523437];
  generateLat() { return Math.random() * 360 - 180; }
	generateLon() { return Math.random() * 180 - 90; }

  constructor(private vehicleService:VehicleService) {
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.dataLoading();
    });
  }

  ngOnInit(): void {
     this.initializeMapOptions();
     // this.markerClusterGroup = L.markerClusterGroup({removeOutsideVisibleBounds: true});


     // this.map = map;
     // this.addSampleMarker();
  }
  dataLoading(){

    // this.markerClusterData = this.generateData(1000);
    this.markerClusterData = this.addVehiclesMarker(this.vehicleService.vehicles);
    let vehicles = this.vehicleService.vehicles;
    console.log('vehicles',vehicles);

    console.log('markerClusterData',this.markerClusterData[0]);
    console.log('markerClusterData',this.markerClusterData[0]['_latlng']['lat']);
    console.log('markerClusterData',this.markerClusterData[0]['_latlng']['lng']);

  }

  addVehiclesMarker(vehicles : any) : L.Marker[]{
    const data: L.Marker[] = [];

    for (let i = 0; i < vehicles.length; i++) {

      const icon = L.icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: '2b3e1faf89f94a4835397e7a43b4f77d.png',
        iconRetinaUrl: '680f69f3c2e6b90c1812a813edf67fd7.png',
        shadowUrl: 'a0c6cc1401c107b501efee6477816891.png'
      });

      data.push(L.marker([ vehicles[i].longitud, vehicles[i].latitud ], { icon }));
    }

    return data;
  }
  onMapReady(map: L.Map) {
    this.map = map;
    console.log('this.map',this.map);
    // this.addSampleMarker();
    // this.markerClusterData = this.generateData(1000);


  }
  //
  // private addSampleMarker() {
  //   for(let i=0;i<10;i++){
  //
  //     let marker = new L.Marker([51.51+(i*10), 0+(i*10)])
  //     .setIcon(
  //       L.icon({
  //         iconSize: [25, 41],
  //         iconAnchor: [13, 41],
  //         iconUrl: 'assets/marker_icon.png'
  //       }));
  //       this.markerClusterGroup.addLayer(marker);
  //       // marker.addTo(this.map)
  //   }
  //   this.markerClusterGroup.addTo(this.map);
  // }
  //
  private initializeMapOptions() {
    this.mapOptions = {
      center: L.latLng(51.505, 0),
      zoom: 12,
      layers: [
        L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    };
  }
  generateData(count: number): L.Marker[] {

		const data: L.Marker[] = [];

		for (let i = 0; i < count; i++) {

			const icon = L.icon({
				iconSize: [ 25, 41 ],
				iconAnchor: [ 13, 41 ],
				iconUrl: '2b3e1faf89f94a4835397e7a43b4f77d.png',
				iconRetinaUrl: '680f69f3c2e6b90c1812a813edf67fd7.png',
				shadowUrl: 'a0c6cc1401c107b501efee6477816891.png'
			});

			data.push(L.marker([ this.generateLon(), this.generateLat() ], { icon }));
		}

		return data;

	}
}

// import { Component, AfterViewInit, OnInit } from '@angular/core';
// import * as L from 'leaflet';
//
// import { MapService } from '../../services/map.service';
//
//
// @Component({
//   selector: 'app-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss']
// })
// export class MapComponent implements OnInit {
//
//   private map!: L.Map;
//   private centroid: L.LatLngExpression = [-11.107323, -75.523437];
//
//
//   constructor(private mapService: MapService) { }
//
//   ngOnInit(): void {
//     this.initMap();
//     this.mapService.sendData.subscribe(e => {
//       const data: [number, number][] = [];
//       for (const property in e){
//         if (e.hasOwnProperty(property)) {
//           const aux2: [number, number] = [e[property].latitud, e[property].longitud];
//           data.push(aux2);
//           this.drawIcon(e[property].latitud, e[property].longitud);
//         }
//       }
//
//       this.map.fitBounds(data);
//     });
//   }
//
//   private drawIcon(lat: number, lng: number): void{
//
//     const iconMarker = L.icon({
//       iconUrl: './marker-icon.png',
//       iconSize: [30, 50],
//       iconAnchor: [15, 50]
//     });
//     L.marker([lat, lng], {icon: iconMarker}).addTo(this.map);
//   }
//
//   private initMap(): void {
//       this.map = L.map('map', {
//         center: this.centroid,
//         zoom: 7
//       });
//
//       const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 18,
//         minZoom: 4,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//       });
//
//       tiles.addTo(this.map);
//       const iconMarker = L.icon({
//         iconUrl: './marker-icon.png',
//         iconSize: [30, 50],
//         iconAnchor: [15, 50]
//       });
//
//       // let marker = L.marker([-11.107323,-75.523437],{icon:iconMarker}).addTo(this.map);
//
//       this.map.doubleClickZoom.disable();
//
//       // this.map.on('dblclick',(e)=>{
//       //   console.log(Object.values(e)[3].lat);
//       //   console.log(Object.values(e)[3].lng);
//       //   L.marker([Object.values(e)[3].lat,Object.values(e)[3].lng],{icon:iconMarker}).addTo(this.map);
//       //
//       // });
//
//   }
//
// }
