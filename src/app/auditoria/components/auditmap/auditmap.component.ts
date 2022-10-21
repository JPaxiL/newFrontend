import { Component, AfterViewInit,Input } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';

interface Data {
	latitude: string;
  longitude: string;
}

@Component({
  selector: 'app-auditmap',
  templateUrl: './auditmap.component.html',
  styleUrls: ['./auditmap.component.scss']
})
export class AuditmapComponent implements AfterViewInit {

  constructor(private mapService:MapService) { }

  private map :any;
  @Input() ip: string = "";
  dataResponse:any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ -10.730367, -75.691671 ],
      zoom: 5
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private Icon = L.icon({
    iconUrl: '/assets/images/icon.png',

    iconSize:     [18, 23], 
    iconAnchor:   [18, 23], 
});

  ngAfterViewInit(): void {
    this.initMap();

    
  }

  getIpForActivity(ip_address:string){

    var layerGroup = L.layerGroup().addTo(this.map);

    this.mapService.getInfoFromIp(ip_address)
        .subscribe(response => {

          this.dataResponse = response;
          L.marker([this.dataResponse.latitude, this.dataResponse.longitude], {icon: this.Icon}).addTo(layerGroup);
        });
    
        layerGroup.clearLayers();
  }

}
