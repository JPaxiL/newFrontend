import { Injectable, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import RefData from '../data/refData';
import * as L from 'leaflet';
// import 'leaflet.markercluster';

import { SocketWebService } from './socket-web.service';
import { VehicleService } from './vehicle.service';
import { FollowService } from './follow.service';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  public map!: L.Map;
  public markerClusterGroup!: L.MarkerClusterGroup;
  public markerClusterData!: any;

  public leafletEvent!: L.LeafletEvent;
  private dataFitBounds: [string, string][] = [];
  private marker: any = [];
  private statusMap: boolean = false;

  @Output() sendData = new EventEmitter<any>();
  @Output() changeEye = new EventEmitter<any>();

  constructor(
    private vehicleService:VehicleService,
    private followService:FollowService,
    private socketWebService: SocketWebService
  ) {

    this.markerClusterGroup = L.markerClusterGroup({removeOutsideVisibleBounds: true});

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
    this.vehicleService.clickEyeAll.subscribe(res=>{
      this.eyeClickAll();
    });
  }
  eyeClick(map: any, IMEI: string){
    console.log('click eye IMEI = ',IMEI);
    const vehicles = this.vehicleService.vehicles;
    let vehicle = [];
    for (const i in vehicles){
      if(vehicles[i].IMEI==IMEI){
        vehicles[i].eye=!vehicles[i].eye;
        vehicle = vehicles[i];
      }
    }
    this.vehicleService.vehicles = vehicles;
    if(vehicle.eye==true){
      // this.map.addLayer(this.marker[IMEI]);
      this.markerClusterGroup.addLayer(this.marker[IMEI]);
    }else{
      console.log('quitar vehiculo del mapa ...',vehicle);
      // this.map.removeLayer(this.marker[IMEI]);
      this.markerClusterGroup.removeLayer(this.marker[IMEI]);
    }
  }
  eyeClickAll(){
    const vehicles = this.vehicleService.vehicles;
    for (const i in vehicles){
      // if(vehicles[i].IMEI==IMEI){
        vehicles[i].eye=!vehicles[i].eye;
      //   vehicle = vehicles[i];
      // }
      if(vehicles[i].eye==true){
        this.markerClusterGroup.addLayer(this.marker[vehicles[i].IMEI]);
      }else{
        this.markerClusterGroup.removeLayer(this.marker[vehicles[i].IMEI]);
      }
    }
    this.vehicleService.vehicles = vehicles;
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

        // this.map.removeLayer(this.marker[data.IMEI]);
        this.markerClusterGroup.removeLayer(this.marker[data.IMEI]);
        if(vehicles[index].eye){
          console.log('socket IMEI',data.IMEI);
          // console.log('markerClusterGroup',this.markerClusterGroup);
          // this.drawIconUpdate(vehicles[index], this.map);
          // this.drawIcon(vehicles[index], this.map);
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
    console.log("onDrawIcon");
    this.map = map;
    let group : any[]= [];
    const e = this.vehicleService.vehicles;
    let aux_cont = 0;
    for (const layer in this.marker){
      // this.map.removeLayer(this.marker[layer]);
      this.markerClusterGroup.removeLayer(this.marker[layer]);
      aux_cont++;
    }
    console.log('contador marker = ',aux_cont);
    console.log('marker',this.marker);
    // this.map.on("zoom", (e: any) => {
    //   console.log('zoom = ',e['target']['_zoom']);
    //   console.log('zoom en mapa ... zoom = ',this.map);
    //
    // });

    for (const property in e){
        if (e.hasOwnProperty(property)&&e[property].eye == true) {
          if(this.statusMap==false){
            const aux2: [string, string] = [e[property].latitud, e[property].longitud];
            this.dataFitBounds.push(aux2);
          }
          // this.map.removeLayer(this.demo);
          // this.drawIcon(e[property], map, Number(e[property].latitud), Number(e[property].longitud));
          this.drawIcon(e[property], map);
        }
    }
    // this.
    // this.markerClusterData = this.marker;
    // this.markerClusterGroup.addTo(this.map);
    // console.log('maker',this.marker);

    if(this.dataFitBounds.length>0){
      // console.log("dataFitBounds map",this.dataFitBounds);
      map.fitBounds(this.dataFitBounds);
    }
    this.statusMap=true;
    this.dataFitBounds = [];

  }
  private groupAllv2(distance : number): any{
    const e = this.vehicleService.vehicles;
    let group: any[] = [];
    let d = distance*(-1);

    let i_group = 0;
    for (const index in e){
      let i = parseInt(index);
      // group[i]={
      //   name:e[i].name,
      //   distance:0,
      //   data:[]
      // };
      // get x , y
      let x = Math.trunc(parseInt(e[i].longitud)/d) * d + d;
      // console.log('longitud vehicle ',e[i].longitud);
      // console.log('longitud x', x);
      let y = Math.trunc(parseInt(e[i].latitud)/d) * d + d;
      // console.log('latitud vehicle ',e[i].latitud);
      // console.log('latitud y', y);

      let status = true;
      for (const index2 in group) {
        let j = parseInt(index2);

        if(group[j]['long']==x&&group[j]['lat']){
          group[j]['data'].push(e[i]);
          status=false;
        }
      }

      if(status){
        //crate new group
        group[i_group]={
          name:i_group+1,
          long : x,
          lat : y,
          longitud : x + (d/2*-1),
          latitud : y + (d/2*-1),
          data:[]
        };
        group[i_group].data.push(e[i]);
        console.log('create new group',i_group);
        i_group++;
      }

    }
    return group;
  }

  private drawIconUpdate(data : any, map : any){
    let iconUrl = './assets/images/objects/nuevo/'+data.icon;
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
        '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
        '<small>REFERENCIA: '+'NN'+'</small><br>'+
        '<small>FECHA DE TRANSMISION: '+data.dt_tracker+'</small><br>'+
        '<small>TIEMPO DE PARADA: </small>'+
      '</aside>';

    // const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker});//.addTo(map).bindPopup(popupText);
    const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker}).bindPopup(popupText);
    // tempMarker.bindLabel("My Label");
    // tempMarker.bindTooltip("text here", { permanent: true, offset: [0, 12] });
    // // this

    this.markerClusterGroup.addLayer(tempMarker);
    // this.markerClusterGroup.addTo(this.map);
    this.marker[data.IMEI]=tempMarker;
  }
  private drawIcon(data:any, map: any): void{
    // assets/images/objects/nuevo/{{ rowData['icon']
    let iconUrl = './assets/images/objects/nuevo/'+data.icon;
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
        '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
        '<small>REFERENCIA: '+'NN'+'</small><br>'+
        '<small>FECHA DE TRANSMISION: '+data.dt_tracker+'</small><br>'+
        '<small>TIEMPO DE PARADA: </small>'+
      '</aside>';

    // const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker});//.addTo(map).bindPopup(popupText);
    const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker}).bindPopup(popupText);
    // tempMarker.bindLabel("My Label");
    // tempMarker.bindTooltip("text here", { permanent: true, offset: [0, 12] });
    // // this

    this.markerClusterGroup.addLayer(tempMarker);
    this.markerClusterGroup.addTo(this.map);
    this.marker[data.IMEI]=tempMarker;
    // this.marker[data.IMEI]=this.markerClusterGroup;
    // console.log('maker',this.marker);
    // var markers = L.markerClusterGroup({
    // 	iconCreateFunction: function(cluster) {
    //     return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
    // 	}
    // });

    // markers.addLayer(tempMarker);
    // this.map.addLayer(markers);
    // this.markerClusterGroup.addLayer(L.marker([lat, lng], {icon: iconMarker}));
    // map.addLayer(this.markerClusterGroup);
  }

}
