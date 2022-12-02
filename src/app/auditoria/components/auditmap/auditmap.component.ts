import { Component, AfterViewInit,Input } from '@angular/core';
import * as L from 'leaflet';
import { CircularGeofencesService } from 'src/app/geofences/services/circular-geofences.service';
import { MapService } from '../../services/map.service';

interface Data {
  ip_address: string;
  properties: string;
  subject_type: string;
}

@Component({
  selector: 'app-auditmap',
  templateUrl: './auditmap.component.html',
  styleUrls: ['./auditmap.component.scss']
})
export class AuditmapComponent implements AfterViewInit {

  constructor(private mapService:MapService,
              private circularGeofencesService: CircularGeofencesService) { }

  private map :any;
  @Input() ip: string = "";
  dataResponse:any;

  properties: any = {};

  layerGroup: any;

  latlngs: [number, number][] = [];

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

  private Marker_old = L.icon({
    iconUrl: '/assets/images/marker_old.png',

    iconSize:     [18, 23], 
    iconAnchor:   [18, 23], 
  });

  private Marker_new = L.icon({
    iconUrl: '/assets/images/marker_new.png',

    iconSize:     [18, 23], 
    iconAnchor:   [18, 23], 
  });

  ngAfterViewInit(): void {
    this.initMap();

    this.layerGroup = L.layerGroup().addTo(this.map);
  }

  getDataActivity(data:Data){

    this.layerGroup.clearLayers();
    
    if(data.ip_address != null && data.ip_address != '127.0.0.1' && data.ip_address != ''){

      this.mapService.getInfoFromIp(data.ip_address)
          .subscribe(response => {
  
            this.dataResponse = response;
            L.marker([this.dataResponse.latitude, this.dataResponse.longitude], {icon: this.Icon}).addTo(this.layerGroup);
          });
      
    }

    if(data.subject_type == 'Point' ){

      if(data.properties){
  
        this.properties = JSON.parse(data.properties);
    
        if(this.properties.attributes.coordenadas_punto){
    
          let coordenadas_punto = this.properties.attributes.coordenadas_punto.replace(/[&\/\\#+()$~%'":*?<>{}]/g,'');
          coordenadas_punto = coordenadas_punto.split(',');
          L.marker([parseFloat(coordenadas_punto[0]),parseFloat(coordenadas_punto[1])], {icon: this.Marker_new}).addTo(this.layerGroup);
        }
    
        if(this.properties.old.coordenadas_punto){
          let coordenadas_punto = this.properties.old.coordenadas_punto.replace(/[&\/\\#+()$~%'":*?<>{}]/g,'');
          coordenadas_punto = coordenadas_punto.split(',');
          L.marker([parseFloat(coordenadas_punto[0]),parseFloat(coordenadas_punto[1])], {icon: this.Marker_old}).addTo(this.layerGroup);
        }
      }
    }

    this.map.panTo(new L.LatLng(-12.105777,-76.4436729));

    if(data.subject_type == 'Zone'){

      this.latlngs = [];
      
      if(data.properties){
        this.properties = JSON.parse(data.properties);
        //console.log(this.properties);

        if(this.properties.old){

          let vertices_zona = this.properties.old.vertices_zona.replace(/[()]/g,'').trim().split(',');
  
          for (let i = 0; i < vertices_zona.length; i++) {
            
            let vertices = vertices_zona[i].trim().split(' ');
            this.latlngs.push([parseFloat(vertices[1]),parseFloat(vertices[0])]);
            
          }
  
          var polygon = L.polygon(this.latlngs, {color: 'red'}).addTo(this.layerGroup);
        }

        this.latlngs = [];

        if(this.properties.attributes){

          let vertices_zona = this.properties.attributes.vertices_zona.replace(/[()]/g,'').trim().split(',');
  
          for (let i = 0; i < vertices_zona.length; i++) {
            
            let vertices = vertices_zona[i].trim().split(' ');
            this.latlngs.push([parseFloat(vertices[1]),parseFloat(vertices[0])]);
            
          }
  
          var polygon = L.polygon(this.latlngs, {color: 'green'}).addTo(this.layerGroup);
          this.map.fitBounds(polygon.getBounds());

        }

      }
    
    }

    if(data.subject_type == 'CircularZone'){

      this.latlngs = [];
      
      if(data.properties){
        this.properties = JSON.parse(data.properties);

        console.log(this.properties);

        if(this.properties.old){

          var circle = new L.Circle( this.circularGeofencesService.getCoordenadas(this.properties.old.geo_coordenadas), {
            radius: this.circularGeofencesService.getRadius(this.properties.old.geo_coordenadas),
            weight: 3,
            fill: this.properties.old.bol_sin_relleno,
            color: 'red',
          }).addTo(this.layerGroup);
        }

        this.latlngs = [];

        if(this.properties.attributes){

          var circle = new L.Circle( this.circularGeofencesService.getCoordenadas(this.properties.attributes.geo_coordenadas), {
            radius: this.circularGeofencesService.getRadius(this.properties.attributes.geo_coordenadas),
            weight: 3,
            fill: this.properties.attributes.bol_sin_relleno,
            color: 'green',
          }).addTo(this.layerGroup);

          this.map.panTo(new L.LatLng(circle.getLatLng().lat,circle.getLatLng().lng));
          
        }

      
      }
    
    }
  }

}
