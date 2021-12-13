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
      const vehiclestree = this.vehicleService.vehiclesTree;
      // console.log("vehicles socket",vehicles);

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
        // console.log('listable =====',this.vehicleService.listTable);
        if(this.vehicleService.listTable==0){
          this.vehicleService.reloadTable.emit();
        }else if(this.vehicleService.listTable==1){
          //add register to treetable;
          const tree = this.vehicleService.vehiclesTree;
          // console.log('groups',this.vehicleService.groups);
          let index_group = -1;//this.vehicleService.groups.indexOf(vehicles[index]["grupo"]);
          for (const key in tree) {
            if (tree[key]['data']['name']==vehicles[index]["grupo"]) {
              index_group = parseInt(key);
            }
          }


          let e = tree[index_group]['children'];
          let index_convoy: number = -1;
          //buscando index convoy;
          for(const i in e){

            if(e[parseInt(i)]['data']['name']==vehicles[index]['convoy']){
              index_convoy = parseInt(i);
            }
          }
          // buscando index registro tree
          let aux_vehicles = tree[index_group]['children']![index_convoy]["children"];
          let index_vehicle = -1;
          for (const i in aux_vehicles) {
            if(aux_vehicles[parseInt(i)]['data']['id']==vehicles[index]['id']){
                index_vehicle = parseInt(i);
            }
          }
          // console.log('index grupo = ',index_group);
          // console.log('index convoy = ',index_convoy);
          // console.log('index vehicle = ',index_vehicle);
          // console.log('placa ->'+vehicles[index]['name']+'grupo'+vehicles[index]['grupo']+'convoy'+vehicles[index]['convoy']);
          // console.log('aux_vehicles',aux_vehicles);
          // console.log('tree',tree); //ok

          if(index_group>=0&&index_convoy>=0&&index_vehicle>=0){
            // console.log('registro entrante ',vehicles[index]);
            // console.log('registro a actualizar',tree[index_group]['children']![index_convoy]["children"]![index_vehicle]['data']);

            tree[index_group]['children']![index_convoy]["children"]![index_vehicle]['data'] = vehicles[index];
            this.vehicleService.vehiclesTree = tree;
          }

          // if(tree[index_group]['children'][index_convoy]["children"]){
          //
          //   let aux_reg = tree[index_group]['children'][index_convoy]["children"];
          //   console.log('aux reg == ',aux_reg);
          // }
          // this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles); -->obsoleto
          this.vehicleService.reloadTableTree.emit();
        }
        this.map.removeLayer(this.marker[data.IMEI]);
        if(vehicles[index].eye){
          this.drawIcon(vehicles[index], this.map, data.Latitud, data.Longitud);
        }

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
    let iconUrl = './assets/images/batgps.png';
    if(data.speed>0){
      iconUrl = './assets/images/accbrusca.png';
    }
    const iconMarker = L.icon({
      iconUrl: iconUrl,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor:  [-3, -40]
    });

    const popupText = '<div class="row"><div class="col-6" align="left"><strong>'+data.name+'</strong></div><div class="col-6" align="right"><strong>'+data.speed+' km/h</strong></div></div>'+
      '<aside class="">'+
        '<small>CONVOY: '+data.convoy+'</small><br>'+
        '<small>UBICACION: '+lat+', '+lng+'</small><br>'+
        '<small>REFERENCIA: '+'NN'+'</small><br>'+
        '<small>FECHA DE TRANSMISION: '+data.dt_tracker+'</small><br>'+
        '<small>TIEMPO DE PARADA: </small>'+
      '</aside>';

    const tempMarker = L.marker([lat, lng], {icon: iconMarker}).addTo(map).bindPopup(popupText);
    this.marker[data.IMEI]=tempMarker;


  }
  // private drawIconMov(data:any, map: any, lat: number, lng: number): void{
  //   const iconMarker = L.icon({
  //     iconUrl: './assets/images/accbrusca.png',
  //     iconSize: [30, 30],
  //     iconAnchor: [15, 30],
  //     popupAnchor:  [-3, -40]
  //   });
  //
  //   const tempMarker = L.marker([lat, lng], {icon: iconMarker}).addTo(map).bindPopup("IMEI : "+data.IMEI+ "<br>"+"Placa: "+data.name);
  //   this.marker[data.IMEI]=tempMarker;
  //
  // }
}
