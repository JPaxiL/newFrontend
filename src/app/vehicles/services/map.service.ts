import { Injectable, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import RefData from '../data/refData';
import * as L from 'leaflet';

import { SocketWebService } from './socket-web.service';
import { VehicleService } from './vehicle.service';
import { FollowService } from './follow.service';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  public map!: L.Map;
  private dataFitBounds: [string, string][] = [];
  private marker: any = [];
  private statusMap: boolean = false;
  // private demo: any = [];

  @Output() sendData = new EventEmitter<any>();
  @Output() changeEye = new EventEmitter<any>();

  constructor(
    private vehicleService:VehicleService,
    private followService:FollowService,
    private socketWebService: SocketWebService
  ) {
    this.vehicleService.drawIconMap.subscribe(e=>{
      this.onDrawIcon(this.map);
    });
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.onDrawIcon(this.map);
    });
    this.socketWebService.callback.subscribe(res =>{
      this.monitor(res);
    });
    this.followService.callback.subscribe(res =>{
      // console.log("desde map service");
      this.followVehicle(res, this.map);
    });
    this.vehicleService.clickIcon.subscribe(res=>{
      this.followClickIcon(this.map, res);
    });
    this.vehicleService.clickEye.subscribe(res=>{

      this.eyeClick(this.map, res);
    });
  }
  eyeClick(map: any, IMEI: string){
    const vehicles = this.vehicleService.vehicles;
    for (const i in vehicles){
      if(vehicles[i].IMEI==IMEI){
        vehicles[i].eye=!vehicles[i].eye;
      }
    }
    this.vehicleService.vehicles = vehicles;
    this.onDrawIcon(map);
  }
  followClickIcon(map: any, IMEI: string){
    const vehicles = this.vehicleService.vehicles;
    this.dataFitBounds = [];
    //
    for (const i in vehicles){
      if(vehicles[i].IMEI==IMEI){
        const aux2: [string, string] = [vehicles[i].latitud, vehicles[i].longitud];
        this.dataFitBounds.push(aux2);
      }
    }
    //
    if(this.dataFitBounds.length>0){
      map.fitBounds(this.dataFitBounds);
    }
  }
  followVehicle(data: any, map: any): void{
    /*
      - aspecto grafico
      - interno

    */
    // update element
    const vehicles = this.vehicleService.vehicles;
    this.dataFitBounds = [];

    for (const i in vehicles){
      if(data.IMEI==vehicles[i].IMEI){
        vehicles[i].follow = !vehicles[i].follow;
      }
      if(vehicles[i].follow){
        const aux2: [string, string] = [vehicles[i].latitud, vehicles[i].longitud];
        this.dataFitBounds.push(aux2);
      }
    }

    if(this.dataFitBounds.length>0){
      map.fitBounds(this.dataFitBounds);
    }


  }
  monitor(data: any): void{
    if(this.vehicleService.statusDataVehicle){
      // console.log(data);
      /*
      data = {
        Altitud:
        Angulo:
        IMEI:
        Latitud: ok
        Longitud: ok
        Parametros:
        Velocidad:
        eventos: ""
        fecha_server:
        fecha_tracker:
        record:
        "señal_gps": 5
        "señal_gsm": 5
      }
      */
      const vehicles = this.vehicleService.vehicles;

      const resultado = vehicles.find( (vehi: any) => vehi.IMEI == data.IMEI.toString() );
      if(resultado){

        // update dataCompleted
        // console.log("update data");
        const index = vehicles.indexOf( resultado);
        // console.log("index ",index);

        vehicles[index].latitud = data.Latitud.toString();
        vehicles[index].longitud = data.Longitud.toString();
        vehicles[index].speed = data.Velocidad;

        vehicles[index].dt_server = data.fecha_server;
        vehicles[index].dt_tracker = data.fecha_tracker;
        vehicles[index].altitud = data.Altitud;
        vehicles[index].señal_gps = data.señal_gps;
        vehicles[index].señal_gsm = data.señal_gsm;
        vehicles[index].parametros = data.Parametros;

        vehicles[index] = this.vehicleService.formatVehicle(vehicles[index]);


        // vehicles[index].
        this.vehicleService.vehicles = vehicles;
        if(this.vehicleService.listTable==0){
          this.vehicleService.reloadTable.emit();
        }else{
          // this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
          this.vehicleService.reloadTableTree.emit(this.vehicleService.vehiclesTree);
        }
        this.map.removeLayer(this.marker[data.IMEI]);
        this.drawIconMov(vehicles[index], this.map, data.Latitud, data.Longitud);

      }


    }
  }
  changeStatusEye(id: number): void {
    this.changeEye.emit(id);
  }

  sendDataMap(data: Vehicle[]): void{
    this.sendData.emit(data);
  }

  loadMap(map: any): void{
    // console.log("loadMap");
    this.map = map;
  }

  // deleteMarker(IMEI: string):void{
  //   this.map.removeLayer(this.marker[IMEI]);
  // }

  onDrawIcon(map: any): void{
    // console.log("onDrawIcon");
    this.map = map;

    const e = this.vehicleService.vehicles;

    for (const layer in this.marker){
      this.map.removeLayer(this.marker[layer]);
    }

    for (const property in e){
        if (e.hasOwnProperty(property)&&e[property].eye == true) {
          if(this.statusMap==false){
            const aux2: [string, string] = [e[property].latitud, e[property].longitud];
            this.dataFitBounds.push(aux2);
          }
          // this.map.removeLayer(this.demo);
          this.drawIcon(e[property], map, Number(e[property].latitud), Number(e[property].longitud));
        }
    }

    if(this.dataFitBounds.length>0){
      // console.log("dataFitBounds map",this.dataFitBounds);
      map.fitBounds(this.dataFitBounds);
    }
    this.statusMap=true;
    this.dataFitBounds = [];
  }

  private drawIcon(data:any, map: any, lat: number, lng: number): void{
    const iconMarker = L.icon({
      iconUrl: './assets/images/batgps.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor:  [-3, -40]
    });

    const tempMarker = L.marker([lat, lng], {icon: iconMarker}).addTo(map).bindPopup("IMEI : "+data.IMEI+ "<br>"+"Placa: "+data.name);;
    // const tempMarker = L.marker([lat, lng], {icon: iconMarker}).addTo(map).bindPopup("IMEI : "+data.IMEI+ "<br>"+"Placa: "+data.name);
    this.marker[data.IMEI]=tempMarker;


  }
  private drawIconMov(data:any, map: any, lat: number, lng: number): void{
    const iconMarker = L.icon({
      iconUrl: './assets/images/accbrusca.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor:  [-3, -40]
    });

    const tempMarker = L.marker([lat, lng], {icon: iconMarker}).addTo(map).bindPopup("IMEI : "+data.IMEI+ "<br>"+"Placa: "+data.name);
    this.marker[data.IMEI]=tempMarker;

  }
}
