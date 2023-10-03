import { Injectable, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
// import { Component, OnInit, OnDestroy } from '@angular/core';

import { Vehicle } from '../models/vehicle';
import RefData from '../data/refData';
import * as L from 'leaflet';
import * as moment from 'moment';
import 'leaflet.markercluster';
import 'leaflet.markercluster.freezable';

import { SocketWebService } from './socket-web.service';
import { VehicleService } from './vehicle.service';
import { FollowService } from './follow.service';
import { TabService } from 'src/app/panel/services/tab.service';
import { UserTracker } from 'src/app/multiview/models/interfaces';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/takeWhile';
// import 'rxjs/add/observable/timer'

@Injectable({
  providedIn: 'root'
})
export class MapService {
  @ViewChild('popupText') popupText!: ElementRef;

  public map!: L.Map;
  public respuesta: any = [];
  // public markerClusterGroup!: L.MarkerClusterGroup;
  public markerClusterGroup!: any;
  public markerClusterData!: any;

  public leafletEvent!: L.LeafletEvent;
  private dataFitBounds: [string, string][] = [];
  private marker: any = [];
  private statusMap: boolean = false;
  private statusIcon: boolean = false;
  private interval!: any;
  private time: any = 1000;
  private time_stop = "Calculando ...";
  private count= 0;
  private intervalStatus: boolean = false;
  private imeiPopup = "ninguno";

  private clustering = true;

  private coords_vehicle: any[] = [];

  dif_mayor = 0.00;
  dif_divide = 0.00;
  dif_X = 0.00;
  dif_Y = 0.00;
  direction = '';
  final_direction = '';
  direction_X = '';
  direction_Y = '';
  // public mensaje: any = function(){
  //   console.log("lalalalal");
  // }
  // setInvterval = setInterval;

  @Output() sendData = new EventEmitter<any>();
  @Output() changeEye = new EventEmitter<any>();

  constructor(
    private vehicleService:VehicleService,
    private followService:FollowService,
    private socketWebService: SocketWebService,
    private tabService: TabService,
  ) {
    // this.interval = setInterval(function(this){
    //   // this.localStorage
    //   this.mensaje();
    //   console.log("calculando ..",this);
    // },6000);
    this.markerClusterGroup = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      zoomToBoundsOnClick: false
    });

    this.vehicleService.drawIconMap.subscribe(e=>{
      this.onDrawIcon(this.map);
    });
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      if(this.tabService.currentTab == 'main-panel'){
        this.onDrawIcon(this.map);
      }
    });
    this.socketWebService.callback.subscribe(res =>{
      this.monitor(res, this.map);
    });
    this.followService.callback.subscribe(res =>{
      // //console.log("desde map service");
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
    this.vehicleService.clickTag.subscribe(res=>{
      this.tagClick(res);
    });
    this.vehicleService.calcTimeStop.subscribe(data=>{
      // console.log("event time stop res = ",data);

      let tiempoParada = "";
      //
      let aux_vehicle = this.vehicleService.getVehicle(data.imei);
      //
      let a = moment(new Date(data.dt_tracker));
      let b = moment(new Date());
      let d = moment(new Date(aux_vehicle.dt_tracker));

      /*
      c es el tiempo que demora en retornar la info desde backend (latencia)
      e corresponde a la ultima transmision???
      */
      let c = b.diff(a, 'seconds');//retorno
      let e = d.diff(a, 'seconds');//diff fecha
      // let c = 100;
      //dt_tracker es fecha tracker
      // console.log("speed  = ",data.speed);
      // console.log("calc c = ",c);
      // console.log("calc e = ",e);
      if(e==0){
        if ( data.speed > 3 && c > 60 ) {
              // console.log("se cumplio condicion : item.speed > 3 km/h && c > 60 seg ");
              tiempoParada = "0 s";

          } else if ( parseInt(data.res) == -1) {
              tiempoParada = "Apagado mas de un día";//"No se encontro Datos";
          } else if (parseInt(data.res) == -2) {
              tiempoParada = "Duración mayor a 1 Dia";
          } else if (parseInt(data.res) == -3) {
              tiempoParada = "En movimiento...";
          } else if (parseInt(data.res) == -5) {
              //inicio de parada
              tiempoParada = "0 s";
          } else if (parseInt(data.res) == -6) {
              //inicio de parada
              tiempoParada = "...Avise a soporte";
          } else if (parseInt(data.res) == -4) {

              // var tiempoParada = "En movimiento...";
              // item.paradaDesde  = item.paradaDesde;

              //var f_now = new Date( item.dt_tracker.replace(/-/g, "/") );
              let f_now = new Date();
              let f_past = new Date( data.paradaDesde);
              // var anios=f_now.diff(f_past,"seconds");
              let duracion= this.string_diffechas(f_past,f_now)
              //var tiempoParada = item.paradaDesde  + " - " +item.dt_tracker+ " - " +duracion;
              tiempoParada = duracion;

          } else {

              data.paradaDesde = data.res;

              //var f_now = new Date( item.dt_tracker.replace(/-/g, "/") );
              // let aux = moment(data.paradaDesde).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
              let f_now = new Date();
              // let f_past = new Date( aux );
              let f_past = new Date( data.paradaDesde );
              // let anios=f_now.diff(f_past,"seconds");
              let duracion= this.string_diffechas(f_past,f_now)
              // let tiempoParada = responseP[0] + " - " +item.dt_tracker+ " - " +duracion;
              tiempoParada = duracion;

          }
          // console.log("tiempoParada = ",tiempoParada);
          let aux = {
            imei: data.imei,
            name: data.name,
            dt_tracker: data.dt_tracker,
            convoy: data.convoy,
            longitud: data.longitud,
            latitud: data.latitud,
            speed:data.speed,
            ref:data.direction,
            tiempoParada: tiempoParada,
          };
          this.imeiPopup = data.imei;
          this.time_stop = tiempoParada;
          this.printPopup(aux);
      }



    });


  }
  printPopup(data: any): void{


    // console.log("data final",data);

    let object = this.markerClusterGroup.getLayers();
    //   let cont = 0;
      for (const key in object) {

        if(object[key]['_tooltip']['_content']==this.marker[data.imei]._tooltip._content){
          // console.log("this.markerClusterGroup.getLayers()[key]",this.markerClusterGroup.getLayers()[key]);

            this.markerClusterGroup.getLayers()[key]['_popup'].setContent('<div class="row"><div class="col-6" align="left"><strong>'+data.name+'</strong></div><div class="col-6" align="right"><strong>'+data.speed+' km/h</strong></div></div>'+
            '<aside class="">'+
            '<small>CONVOY: '+data.convoy+'</small><br>'+
            '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
            '<small>REFERENCIA: '+data.ref+'</small><br>'+
            '<small>FECHA DE TRANSMISION: '+data.dt_tracker+'</small><br>'+
            '<small>TIEMPO DE PARADA: '+data.tiempoParada+'</small>'+
            '</aside>');
        }


      }
  }
  string_diffechas(a: any, b: any): any{
          let c = (Math.floor((b - a) / 1000)) % 60;
          let d = (Math.floor((b - a) / 60000)) % 60;
          let e = (Math.floor((b - a) / 3600000)) % 24;
          let f = Math.floor((b - a) / 86400000);
          let g = "";
          if (f > 0) {
              g = '' + f + ' d ' + e + ' h ' + d + ' min ' + c + ' s'
          } else if (e > 0) {
              g = '' + e + ' h ' + d + ' min ' + c + ' s'
          } else if (d > 0) {
              g = '' + d + ' min ' + c + ' s'
          } else if (c >= 0) {
              g = '' + c + ' s'
          }
          return g
  }
  callMethod(){
    console.log('Call Function Every Five Seconds.', new Date());
  }
  eyeClick(map: any, IMEI: string){
    //console.log('click eye IMEI = ',IMEI);
    const vehicles = this.vehicleService.vehicles;
    let vehicle = undefined;
    for (const i in vehicles){
      if(vehicles[i].IMEI==IMEI){
        vehicles[i].eye=!vehicles[i].eye;
        vehicle = vehicles[i];
      }
    }
    this.vehicleService.vehicles = vehicles;

    //
    //console.log(this.marker[IMEI]);
    if(vehicle!.eye==true){
      // this.map.addLayer(this.marker[IMEI]);
      this.markerClusterGroup.addLayer(this.marker[IMEI]);
      this.tagClick(vehicle!.IMEI!, false);
      this.vehicleService.countOpenEyes++;
    }else{
      //console.log('quitar vehiculo del mapa ...',vehicle);
      // this.map.removeLayer(this.marker[IMEI]);
      this.markerClusterGroup.removeLayer(this.marker[IMEI]);
      this.vehicleService.countOpenEyes--;
    }
    this.vehicleService.allEyes.state = this.vehicleService.countOpenEyes > 0;
  }
  eyeClickAll(){
    const vehicles = this.vehicleService.vehicles;
    for (const i in vehicles){
      // if(vehicles[i].IMEI==IMEI){
        vehicles[i].eye=!vehicles[i].eye;
      //   vehicle = vehicles[i];
      // }
      if(vehicles[i].eye==true){
        this.markerClusterGroup.addLayer(this.marker[vehicles[i].IMEI!]);
        this.tagClick(vehicles[i].IMEI!, false);
      }else{
        this.markerClusterGroup.removeLayer(this.marker[vehicles[i].IMEI!]);
      }
    }
    this.vehicleService.vehicles = vehicles;
  }

  tagClick(IMEI: string, comesFromCheckbox?: boolean){
    let vehicle = undefined;
    for (const i in this.vehicleService.vehicles){
      if(this.vehicleService.vehicles[i].IMEI==IMEI){
        if(comesFromCheckbox != false){
          this.vehicleService.vehicles[i].tag=!this.vehicleService.vehicles[i].tag;
        }
        vehicle = this.vehicleService.vehicles[i];
      }
    }
    if(vehicle!.tag!){
      this.marker[IMEI].openTooltip();
    } else {
      this.marker[IMEI].closeTooltip();
    }
  }

  followClickIcon(map: any, IMEI: string){
    const vehicles = this.vehicleService.vehicles;
    this.dataFitBounds = [];
    //
    for (const i in vehicles){
      if(vehicles[i].IMEI==IMEI){
        const aux2: [string, string] = [vehicles[i].latitud!, vehicles[i].longitud!];
        this.dataFitBounds.push(aux2);
        //console.log('coordenadas',aux2);
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
        const aux2: [string, string] = [vehicles[i].latitud!, vehicles[i].longitud!];
        this.dataFitBounds.push(aux2);
      }
    }

    if(this.dataFitBounds.length>0){
      map.fitBounds(this.dataFitBounds);
    }


  }
  // timeStopexample(): void{
  //   console.log("hola ",localStorage.getItem("dateItem"));
  //   this.time_stop = "recalculandoXD";
  //   let object = this.markerClusterGroup.getLayers();
  //   let cont = 0;
  //   for (const key in object) {
  //     // console.log(object[key]['_popup']['_content']);
  //     let content = object[key]['_popup']['_content'];
  //     content = content.split(' ');
  //     content[20]="nuevo";
  //     content = content.join(" ");
  //     console.log("content",content);
  //     object[key]['_popup']['_content'] = content;
  //   }
  // }
  monitor(data: any, map: any): void{
    if(this.vehicleService.statusDataVehicle){
      // //console.log(data);
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
      // //console.log("vehicles socket",vehicles);

      const resultado = vehicles.find( (vehi: any) => vehi.IMEI == data.IMEI.toString() );
      if(resultado){



        // update dataCompleted
        // //console.log("update data");
        const index = vehicles.indexOf( resultado);
        // //console.log("index ",index);


        vehicles[index].latitud = data.Latitud.toString();
        vehicles[index].longitud = data.Longitud.toString();
        vehicles[index].speed = data.Velocidad;

        vehicles[index].dt_server = data.fecha_server;
        // vehicles[index].dt_tracker = data.fecha_tracker;
        vehicles[index].dt_tracker = moment(data.fecha_tracker).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
        vehicles[index].altitud = data.Altitud;
        vehicles[index].señal_gps = data.señal_gps;
        vehicles[index].señal_gsm = data.señal_gsm;
        vehicles[index].parametros = data.Parametros;

        // const date = moment(vehicles[index].dt_tracker).subtract(5, 'hours');


        vehicles[index] = this.vehicleService.formatVehicle(vehicles[index]);


        if(this.imeiPopup==data.IMEI.toString()){
          let options = {
            imei: data.IMEI,
            name: vehicles[index].name,
            convoy: vehicles[index].convoy,
            longitud: data.Longitud,
            latitud: data.Latitud,
            speed: data.Velocidad,
            dt_tracker: vehicles[index].dt_tracker,//luego de pasar por filtro
            paradaDesde: "",
            vehicleService : this.vehicleService
          };
          // console.log("data enviada a function timeStopAux",options);
          this.timeStopAux(options);
        }

        // vehicles[index].
        this.vehicleService.vehicles = vehicles;
                // //console.log('listable =====',this.vehicleService.listTable);
        if(this.vehicleService.listTable==0){
          this.vehicleService.reloadTable.emit();
        }else if(this.vehicleService.listTable==1){
          //add register to treetable;
          const tree = this.vehicleService.vehiclesTree;
          // //console.log('groups',this.vehicleService.groups);
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
          // //console.log('index grupo = ',index_group);
          // //console.log('index convoy = ',index_convoy);
          // //console.log('index vehicle = ',index_vehicle);
          // //console.log('placa ->'+vehicles[index]['name']+'grupo'+vehicles[index]['grupo']+'convoy'+vehicles[index]['convoy']);
          // //console.log('aux_vehicles',aux_vehicles);
          // //console.log('tree',tree); //ok

          if(index_group>=0&&index_convoy>=0&&index_vehicle>=0){
            // //console.log('registro entrante ',vehicles[index]);
            // //console.log('registro a actualizar',tree[index_group]['children']![index_convoy]["children"]![index_vehicle]['data']);

            tree[index_group]['children']![index_convoy]["children"]![index_vehicle]['data'] = vehicles[index];
            this.vehicleService.vehiclesTree = tree;
          }

          // if(tree[index_group]['children'][index_convoy]["children"]){
          //
          //   let aux_reg = tree[index_group]['children'][index_convoy]["children"];
          //   //console.log('aux reg == ',aux_reg);
          // }
          // this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles); -->obsoleto
          this.vehicleService.reloadTableTree.emit();
        }

        // this.map.removeLayer(this.marker[data.IMEI]);
        // this.markerClusterGroup.removeLayer(this.marker[data.IMEI]);
        if(vehicles[index].eye){
          // console.log('data.longitud', data);
          // console.log('socket vehicles[index].name',vehicles[index].name);
          // console.log('socket vehicles[index]',vehicles[index]);
          // //console.log()
          //buscando layer
          // console.log('buscando layer');
          let cont = 0;
          let object = this.markerClusterGroup.getLayers();
          for (const key in object) {
            // console.log("object[key]['_tooltip']['_content']==vehicles[index].name==>"+object[key]['_tooltip']['_content']+"=="+vehicles[index].name)
            if (object[key]['_tooltip']['_content']=="<span>"+vehicles[index].name+"</span>") {
              cont++;
              let oldCoords = this.markerClusterGroup.getLayers()[key].getLatLng();
              
              let coord = {
                lat : vehicles[index].latitud,
                lng : vehicles[index].longitud
              };

              
              // //console.log('coord',coord);
              // //console.log('aux = ', aux['_latlng']);
              //_popup
              let iconUrl = './assets/images/objects/nuevo/'+vehicles[index].icon;
              this.markerClusterGroup.getLayers()[key]['_popup']['_content'] = '<div class="row"><div class="col-6" align="left"><strong>'+vehicles[index].name+'</strong></div><div class="col-6" align="right"><strong>'+vehicles[index].speed+' km/h</strong></div></div>'+
                '<aside class="">'+
                  '<small>CONVOY: '+vehicles[index].convoy+'</small><br>'+
                  '<small>UBICACION: '+vehicles[index].latitud+', '+vehicles[index].longitud+'</small><br>'+
                  '<small>REFERENCIA: '+'Calculando ...'+'</small><br>'+
                  '<small>FECHA DE TRANSMISION: '+vehicles[index].dt_tracker+'</small><br>'+
                  '<small>TIEMPO DE PARADA: Calculando ...</small>'+
                '</aside>';
              // this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['iconUrl']='./assets/images/accbrusca.png';
              this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['iconUrl']=iconUrl;
              
              this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowSize']=[30,30];
              
              // if(vehicles[index].speed != 0){

              //   let prueba = this.coords_vehicle.find(term => term.name == vehicles[index].name);

              //   let prueba2 = {...prueba};

              //   if(prueba){

              //     prueba.moreOldCoords = {...prueba.oldCoord};
              //     prueba.oldCoord = {...prueba.coords};
              //     prueba.coords = {
              //       lat : vehicles[index].latitud,
              //       lng : vehicles[index].longitud
              //     };

              //   }else{

              //     this.coords_vehicle.push({
              //       name: vehicles[index].name,
              //       coords: {
              //         lat : vehicles[index].latitud,
              //         lng : vehicles[index].longitud
              //       },
              //       oldCoord: this.markerClusterGroup.getLayers()[key].getLatLng(),
              //       moreOldCoords: this.markerClusterGroup.getLayers()[key].getLatLng(),
              //     })
              //   }
                
                

              //   this.dif_mayor = 0.00;
              //   this.dif_divide = 0.00;
              //   this.dif_X = 0.00;
              //   this.dif_Y = 0.00;
              //   this.direction = '';
              //   this.final_direction = '';
              //   this.direction_X = '';
              //   this.direction_Y = '';

              //   if(coord.lat != oldCoords.lat && coord.lng != oldCoords.lng)
              //   {
              //     if(coord.lat > oldCoords.lat){
              //       //arriba
              //       this.direction_Y = 'up';
              //       this.dif_Y = coord.lat-oldCoords.lat;  
              //       if(this.dif_Y >= this.dif_mayor){
              //         this.dif_mayor = this.dif_Y; 
              //         this.direction = 'up';
              //         this.dif_divide = this.dif_Y/2; 
              //       }
              //     }else{
              //       //abajo
              //       this.direction_Y = 'down';
              //       this.dif_Y = oldCoords.lat-coord.lat;
              //       if(this.dif_Y >= this.dif_mayor){
              //         this.dif_mayor = this.dif_Y;
              //         this.direction = 'down';
              //         this.dif_divide = this.dif_Y/2;
                      
              //       }
              //     }
  
              //     if(coord.lng > oldCoords.lng){
              //       //derecha
              //       this.direction_X = 'right';
              //       this.dif_X = coord.lng-oldCoords.lng; 
              //       if(this.dif_X >= this.dif_mayor){
              //         this.dif_mayor = this.dif_X;
              //         this.direction = 'right';
              //         this.dif_divide = this.dif_X/2;
              //       }
              //     }else{
              //       //izquierda
              //       this.direction_X = 'left';
              //       this.dif_X = oldCoords.lng-coord.lng;
              //       if(this.dif_X >= this.dif_mayor){
              //         this.dif_mayor = this.dif_X;
              //         this.direction = 'left';
              //         this.dif_divide = this.dif_X/2;
              //       }
              //     }
                  
              //     if(this.direction == 'up' || this.direction == 'down'){
  
              //       if(this.dif_X >= this.dif_divide){ 
  
              //         this.final_direction = `${this.direction}-${this.direction_X}`;
  
              //       }else{
  
              //         this.final_direction = `${this.direction}`;
                      
              //       }
  
              //     }else{
  
              //       if(this.dif_Y >= this.dif_divide){
  
              //         this.final_direction = `${this.direction_Y}-${this.direction}`;
              //       }else{
  
              //         this.final_direction = `${this.direction}`;
                      
              //       }
              //     }

              //     this.changePositionArrow(this.final_direction,key);

              //     this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${this.final_direction}.svg`;

              //   }
              //   else{

              //     if(prueba2.moreOldCoords){

              //       if(coord.lat != prueba2.moreOldCoords.lat && coord.lng != prueba2.moreOldCoords.lng)
              //       {
              //         if(coord.lat > prueba2.moreOldCoords.lat){
              //           //arriba
              //           this.direction_Y = 'up';
              //           this.dif_Y = coord.lat-prueba2.moreOldCoords.lat;  
              //           if(this.dif_Y >= this.dif_mayor){
              //             this.dif_mayor = this.dif_Y; 
              //             this.direction = 'up';
              //             this.dif_divide = this.dif_Y/2; 
              //           }
              //         }else{
              //           //abajo
              //           this.direction_Y = 'down';
              //           this.dif_Y = prueba2.moreOldCoords.lat-coord.lat;
              //           if(this.dif_Y >= this.dif_mayor){
              //             this.dif_mayor = this.dif_Y;
              //             this.direction = 'down';
              //             this.dif_divide = this.dif_Y/2;
                          
              //           }
              //         }
      
              //         if(coord.lng > prueba2.moreOldCoords.lng){
              //           //derecha
              //           this.direction_X = 'right';
              //           this.dif_X = coord.lng-prueba2.moreOldCoords.lng; 
              //           if(this.dif_X >= this.dif_mayor){
              //             this.dif_mayor = this.dif_X;
              //             this.direction = 'right';
              //             this.dif_divide = this.dif_X/2;
              //           }
              //         }else{
              //           //izquierda
              //           this.direction_X = 'left';
              //           this.dif_X = prueba2.moreOldCoords.lng-coord.lng;
              //           if(this.dif_X >= this.dif_mayor){
              //             this.dif_mayor = this.dif_X;
              //             this.direction = 'left';
              //             this.dif_divide = this.dif_X/2;
              //           }
              //         }
                      
              //         if(this.direction == 'up' || this.direction == 'down'){
      
              //           if(this.dif_X >= this.dif_divide){ 
      
              //             this.final_direction = `${this.direction}-${this.direction_X}`;
      
              //           }else{
      
              //             this.final_direction = `${this.direction}`;
                          
              //           }
      
              //         }else{
      
              //           if(this.dif_Y >= this.dif_divide){
      
              //             this.final_direction = `${this.direction_Y}-${this.direction}`;
              //           }else{
      
              //             this.final_direction = `${this.direction}`;
                          
              //           }
              //         }
  
              //         this.changePositionArrow(this.final_direction,key);
  
              //         this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${this.final_direction}.svg`;
  
              //       }
              //       else{
              //         if(this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']){
  
              //           let old_direction = this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl'].split('_');
                        
              //           this.changePositionArrow(old_direction[1],key);
  
              //           this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${old_direction[1]}`;
                        
              //         }
              //         else{
  
              //           this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
              //           console.log('sin flecha',vehicles[index].name,prueba2);
              //           //console.log(vehicles[index].name);
  
              //         }
  
              //       }
              //     }else{
              //       console.log('no tiene modeCoordsData', vehicles[index].name,prueba2)
              //     }


              //   }

              // }else{
              //   this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
              //   console.log('sin velocidad', vehicles[index].name);
                
              // }

              if(vehicles[index].speed != 0){

                this.dif_mayor = 0.00;
                this.dif_divide = 0.00;
                this.dif_X = 0.00;
                this.dif_Y = 0.00;
                this.direction = '';
                this.final_direction = '';
                this.direction_X = '';
                this.direction_Y = '';

                if(coord.lat != oldCoords.lat && coord.lng != oldCoords.lng)
                {
                  if(coord.lat! > oldCoords.lat){
                    //arriba
                    this.direction_Y = 'up';
                    this.dif_Y = parseFloat(coord.lat!)-oldCoords.lat;  
                    if(this.dif_Y >= this.dif_mayor){
                      this.dif_mayor = this.dif_Y; 
                      this.direction = 'up';
                      this.dif_divide = this.dif_Y/2; 
                    }
                  }else{
                    //abajo
                    this.direction_Y = 'down';
                    this.dif_Y = oldCoords.lat-parseFloat(coord.lat!);
                    if(this.dif_Y >= this.dif_mayor){
                      this.dif_mayor = this.dif_Y;
                      this.direction = 'down';
                      this.dif_divide = this.dif_Y/2;
                      
                    }
                  }
  
                  if(coord.lng! > oldCoords.lng){
                    //derecha
                    this.direction_X = 'right';
                    this.dif_X = parseFloat(coord.lng!)-oldCoords.lng; 
                    if(this.dif_X >= this.dif_mayor){
                      this.dif_mayor = this.dif_X;
                      this.direction = 'right';
                      this.dif_divide = this.dif_X/2;
                    }
                  }else{
                    //izquierda
                    this.direction_X = 'left';
                    this.dif_X = oldCoords.lng-parseFloat(coord.lng!);
                    if(this.dif_X >= this.dif_mayor){
                      this.dif_mayor = this.dif_X;
                      this.direction = 'left';
                      this.dif_divide = this.dif_X/2;
                    }
                  }
                  
                  if(this.direction == 'up' || this.direction == 'down'){
  
                    if(this.dif_X >= this.dif_divide){ 
  
                      this.final_direction = `${this.direction}-${this.direction_X}`;
  
                    }else{
  
                      this.final_direction = `${this.direction}`;
                      
                    }
  
                  }else{
  
                    if(this.dif_Y >= this.dif_divide){
  
                      this.final_direction = `${this.direction_Y}-${this.direction}`;
                    }else{
  
                      this.final_direction = `${this.direction}`;
                      
                    }
                  }

                  //this.changePositionArrow(this.final_direction,key);

                  this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${this.final_direction}.svg`;
                  this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[14,60]; 
                }
                else{
                  if(this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']){

                    let old_direction = this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl'].split('_');
                    //this.changePositionArrow(old_direction[1],key);

                    this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${old_direction[1]}`;
                    this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[14,60]; 
                  }
                  else{

                    this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
                    console.log('se borra la flecha', vehicles[index].name);
                    //console.log(vehicles[index].name);

                  }

                }

              }else{
                this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
                
              }
              
              this.markerClusterGroup.getLayers()[key].setLatLng(coord);
              let aux = this.markerClusterGroup.getLayers()[key];
              // console.log('despues content popup',this.markerClusterGroup.getLayers()[key]['_popup']['_content']);
              //follow true
              this.dataFitBounds = [];
              for (const i in vehicles){

                if(vehicles[i].follow){
                  const aux2: [string, string] = [vehicles[i].latitud!, vehicles[i].longitud!];
                  this.dataFitBounds.push(aux2);
                }
              }

              if(this.dataFitBounds.length>0){
                map.fitBounds(this.dataFitBounds);
              }
            }
          }
          //console.log('se econtraron '+cont+' resultados');
          // //console.log('aux = ', aux.getLatLng());

          // iconUrl = './assets/images/accbrusca.png';

          // //console.log('markerClusterGroup',this.markerClusterGroup);
        }

      } //end if index vehicle


    }
  }

  changeStatusEye(id: number): void {
    this.changeEye.emit(id);
  }

  sendDataMap(data: Vehicle[]): void{
    this.sendData.emit(data);
  }

  loadMap(map: any): void{
    // //console.log("loadMap");
    this.map = map;
  }

  changePositionArrow(direction: string, key: any){
    switch(direction){
      case 'up':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[14,60]; 
        break;
      case 'up-left':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[50,60];
        break;
      case 'up-right':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[-20,60];
        break;
      case 'down':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[13,0];
        break;
      case 'down-left':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[13,30];
        break;
      case 'down-right':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[13,30];
        break;
      case 'left':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[50,30];
        break;
      case 'right':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[-20,30]; 
        break;
    }
  }

  // deleteMarker(IMEI: string):void{
  //   this.map.removeLayer(this.marker[IMEI]);
  // }

  onDrawIcon(map: any): void{
    //console.log("onDrawIcon");
    this.map = map;
    let group : any[]= [];
    const e = this.vehicleService.vehicles;
    let aux_cont = 0;

    const transmissionStatusColor: any = {
      10:"green",
      20:"blue",
      30:"purple",
      40:"black",
      50:"orange",
      60:"red",
      100:"transm-color-not-defined"
    }

    this.markerClusterGroup.clearLayers();

    for (const property in e){
        if (e.hasOwnProperty(property)&&e[property].eye == true) {
          if(this.statusMap==false){
            const aux2: [string, string] = [e[property].latitud!, e[property].longitud!];
            this.dataFitBounds.push(aux2);
          }
          // this.map.removeLayer(this.demo);
          // this.drawIcon(e[property], map, Number(e[property].latitud), Number(e[property].longitud));
          this.drawIcon(e[property], map);
        }
    }


    if(this.dataFitBounds.length>0){
      // //console.log("dataFitBounds map",this.dataFitBounds);
      map.fitBounds(this.dataFitBounds);
    }
    this.statusMap=true;
    this.dataFitBounds = [];
    //EVENTO cluster lista
    this.markerClusterGroup.on('clusterclick',function(a : any){
      //console.log('click cluster...........');
      var coords = a.layer.getLatLng();
                      //console.log(a.layer.getAllChildMarkers());
                      var lista = '<table class="infovehiculos"><tbody>';
                      var array = a.layer.getAllChildMarkers();
                      //console.log('array'+array);
                      for (const i in array) {
                        var aaa = array[i]['_tooltip']['_content'];
                        //console.log(aaa.replace(/<\/?[^>]+(>|$)/g, ""));
                        var vehicleData = e.find((vehicle:UserTracker) => vehicle.name == aaa.replace(/<\/?[^>]+(>|$)/g, ""));
                        var transmissionColorClass = typeof vehicleData != 'undefined'? transmissionStatusColor[vehicleData.point_color!]: 'transm-color-not-defined'
                        lista = lista + '<tr><td><div class="dot-vehicle ' + transmissionColorClass + '"></div></td><td>' + aaa + '</td></tr>';
                      }
                      // for (var i=0; i<array.length; i++){
                      //     var aaa = array[i].label._content.split(' <');
                      //     // //console.log(aaa[0]);
                      //     var bbb = array[i].label._content.split('color:');
                      //     var ccc = bbb[1].split(';');
                      //     //console.log(aaa[0]+" - color css : "+ccc[0]);
                      //     lista = lista + '<tr style="margin:10px;"><td><div style="border-radius: 50%; width: 10px; height: 10px; background-color:' + ccc[0] + ';"></div></td><td style="font-size: 14px;">' + aaa[0] + '</td></tr>';
                      // }

                      lista = lista + '</tbody></table>';

                      var popupMarker = L.popup({maxHeight: 400, closeButton: false, closeOnClick: true, autoClose: true, className: 'popupList'})
                          .setLatLng([coords.lat, coords.lng])
                          .setContent(lista)
                          .openOn(map);
    });
  }
  // private
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
      let x = Math.trunc(parseInt(e[i].longitud!)/d) * d + d;
      // //console.log('longitud vehicle ',e[i].longitud);
      // //console.log('longitud x', x);
      let y = Math.trunc(parseInt(e[i].latitud!)/d) * d + d;
      // //console.log('latitud vehicle ',e[i].latitud);
      // //console.log('latitud y', y);

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
        //console.log('create new group',i_group);
        i_group++;
      }

    }
    return group;
  }

  // private drawIconUpdate(data : any, map : any){
  //   let iconUrl = './assets/images/objects/nuevo/'+data.icon;
  //   // if(data.speed>0){
  //   //   iconUrl = './assets/images/accbrusca.png';
  //   // }
  //   const iconMarker = L.icon({
  //     iconUrl: iconUrl,
  //     iconSize: [30, 30],
  //     iconAnchor: [15, 30],
  //     popupAnchor:  [-3, -40]
  //   });
  //
  //   const popupText = '<div class="row"><div class="col-6" align="left"><strong>'+data.name+'</strong></div><div class="col-6" align="right"><strong>'+data.speed+' km/h</strong></div></div>'+
  //     '<aside class="">'+
  //       '<small>CONVOY: '+data.convoy+'</small><br>'+
  //       '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
  //       '<small>REFERENCIA: '+'NN'+'</small><br>'+
  //       '<small>FECHA DE TRANSMISION: '+data.dt_tracker+'</small><br>'+
  //       '<small>TIEMPO DE PARADA: </small>'+
  //     '</aside>';
  //
  //   // const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker});//.addTo(map).bindPopup(popupText);
  //   const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker}).bindPopup(popupText);
  //   // tempMarker.bindLabel("My Label");
  //   // tempMarker.bindTooltip("text here", { permanent: true, offset: [0, 12] });
  //   // // this
  //
  //   this.markerClusterGroup.addLayer(tempMarker);
  //   // this.markerClusterGroup.addTo(this.map);
  //   this.marker[data.IMEI]=tempMarker;
  // }
  private mensaje(){
    console.log("mensaje");
  }
  public timeStopAux(data: any): void{

    // console.log("calculando time stop aux ...");

    let ar_vel = data.speed;
    if (data.speed > 3) {
        ar_vel = data.speed;
        data.paradaDesde = false;
    } else {
        if (data.paradaDesde == false) {
            ar_vel = data.speed;
        } else {
            ar_vel = -1; // velocidad mayor a 6 para que no traiga historial
        }
    }

        let f_ini = moment( new Date() ).add(-1, 'days').add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
        let f_fin = moment( new Date() ).add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');

    let params = {
      imei: data.imei,
      name: data.name,
      convoy: data.convoy,
      longitud: data.longitud,
      latitud: data.latitud,
      speed: data.speed,
      dt_tracker: data.dt_tracker,
      paradaDesde: data.paradaDesde,
      fecha_i: f_ini,
      fecha_f: f_fin,
      vel: ar_vel
    };

    this.vehicleService.postTimeStop(params);
  }
  public timeStop(this: any): void{
    // console.log("this",this);
    // consultar data actual
    let vehicle = this.vehicleService.getVehicle(this.imei);

    this.speed = vehicle.speed;
    this.dt_tracker = vehicle.dt_tracker;

    // console.log("calculando time stop ...");

    let ar_vel = this.speed;
    if (this.speed > 3) {
        ar_vel = this.speed;
        this.paradaDesde = false;
    } else {
        if (this.paradaDesde == false) {
            ar_vel = this.speed;
        } else {
            ar_vel = -1; // velocidad mayor a 6 para que no traiga historial
        }
    }

        let f_ini = moment( new Date() ).add(-1, 'days').add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
        let f_fin = moment( new Date() ).add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');

    let params = {
      imei: this.imei,
      name: this.name,
      convoy: this.convoy,
      longitud: this.longitud,
      latitud: this.latitud,
      speed: this.speed,
      dt_tracker: this.dt_tracker,
      paradaDesde: this.paradaDesde,
      fecha_i: f_ini,
      fecha_f: f_fin,
      vel: ar_vel
    };

    this.vehicleService.postTimeStop(params);
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
    //console.log('data.name',data.name);
    const popupText = '<div class="row"><div class="col-6" align="left"><strong>'+data.name+'</strong></div><div class="col-6" align="right"><strong>'+data.speed+' km/h</strong></div></div>'+
      '<aside #popupText class="">'+
        '<small>CONVOY: '+data.convoy+'</small><br>'+
        '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
        '<small>REFERENCIA: '+'NN'+'</small><br>'+
        '<small>FECHA DE TRANSMISION: '+data.dt_tracker+'</small><br>'+
        '<small>TIEMPO DE PARADA: '+this.time_stop+'</small>'+
      '</aside>';

    // const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker});//.addTo(map).bindPopup(popupText);
    const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker}).bindPopup(popupText);
    // tempMarker.imei = data.IMEI;
    // tempMarker.bindLabel("My Label");
    tempMarker.bindTooltip(`<span>${data.name}</span>`, { 
      permanent: true, 
      offset: [0, 12],
      className: 'vehicle-tooltip', });
    let options = {
      imei: data.IMEI,
      name: data.name,
      convoy: data.convoy,
      longitud: data.longitud,
      latitud: data.latitud,
      speed: data.speed,
      dt_tracker: data.dt_tracker,
      paradaDesde: "",
      vehicleService : this.vehicleService
    };
    // console.log('envia cero data',data.speed);
    // console.log('envia cero XD',options.speed);
    tempMarker.on('click',this.timeStop,options);
    // tempMarker.on('click',this.timeStop,options);
    // // this
    this.marker[data.IMEI]=tempMarker;

    this.markerClusterGroup.addLayer(tempMarker);
    // //console.log('this.markerClusterGroup',this.markerClusterGroup);
    let object = this.markerClusterGroup.getLayers();
    let cont = 0;
    for (const key in object) {
      if (object[key]['_tooltip']['_content']==data.name) {
        //console.log('dato encontrado'+object[key]['_tooltip']['_content']+'=='+data.name);
        //console.log('key = ',key);
        //console.log('content popup',this.markerClusterGroup.getLayers()[key]['_popup']['_content']);
        cont++;
      }
    }
    //console.log('registros encontrados ---> '+cont);
    this.markerClusterGroup.addTo(this.map);
    //console.log('marker placa '+data.name+' IMEI = ',this.marker[data.IMEI]);
    // //console.log('length = ',this.markerClusterGroup.getLayers().length-1);

    // //console.log('getlayer '+(this.markerClusterGroup.getLayers().length-1)+' -->',this.markerClusterGroup.getLayers()[this.markerClusterGroup.getLayers().length-1]);//ok
    // let layer = this.markerClusterGroup.hasLayer(tempMarker);
    // //console.log('haslayer',layer); true si existe el layer
    //console.log('this.markerClusterGroup',this.markerClusterGroup);
    let layers = this.markerClusterGroup.getLayers();
    //console.log('layers',layers);


    // //console.log('maker',this.marker);
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

  public changeClusteringVisibility(visibility: boolean){
    
    this.clustering = visibility;
  }

  public get getClustering(): boolean{

    return this.clustering;
  }

}
