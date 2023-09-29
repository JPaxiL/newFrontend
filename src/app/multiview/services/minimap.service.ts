import { Injectable, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Vehicle } from 'src/app/vehicles/models/vehicle';
import * as L from 'leaflet';
import * as moment from 'moment';
import 'leaflet.markercluster';
import 'leaflet.markercluster.freezable';

import { SocketWebService } from 'src/app/vehicles/services/socket-web.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { FollowService } from 'src/app/vehicles/services/follow.service';
import { MapItem } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MinimapService {
  
  @ViewChild('popupText') popupText!: ElementRef;

  public maps: MapItem[] = [];
  public respuesta: any = [];

  public markerClusterData!: any;

  public leafletEvent!: L.LeafletEvent;

  private marker: any = [];
  private statusMap: boolean = false;
  private time_stop = "Calculando ...";
  private imeiPopup = "ninguno";

  private clustering = true;

  dif_mayor = 0.00;
  dif_divide = 0.00;
  dif_X = 0.00;
  dif_Y = 0.00;
  direction = '';
  final_direction = '';
  direction_X = '';
  direction_Y = '';

  @Output() sendData = new EventEmitter<any>();
  @Output() changeEye = new EventEmitter<any>();

  constructor(
    private vehicleService:VehicleService,
    private followService:FollowService,
    private socketWebService: SocketWebService,
  ) {

    this.socketWebService.callback.subscribe(res =>{
      this.monitor(res);
    });
    this.followService.callback.subscribe(res =>{
      // //console.log("desde map service");
      this.followVehicle(res.data);
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
          //Una vez llegado el evento con la data de tiempo de parada de un vehiculo,
          //Buscamos a que mapas pertenece el vehiculo y actualizamos el valor de imeiPopu y time_stop
          // de cada mapa ya que seran tomados al llamar a printPopup con el mapa correspondiente
          this.maps.forEach(item => {
            item.vehicles?.forEach(element => {
              if(element.IMEI == data.imei){
                item.imeiPopup = data.imei;
                item.time_stop = tiempoParada;
                this.printPopup(aux,item.id!); //que actualice el popup en el mapa con tal id
              }
            });
          });
      }
    });

  }
  printPopup(data: any, id:string): void{
    // console.log("data final",data);
    let map = this.maps.find(item => item.id == id);
    if(map){
      let layers = map.markerClusterGroup.getLayers();

      for (const key in layers) {
  
        if(layers[key]['_tooltip']['_content']==this.marker[data.imei]._tooltip._content){
          // console.log("this.markerClusterGroup.getLayers()[key]",this.markerClusterGroup.getLayers()[key]);
  
            map.markerClusterGroup.getLayers()[key]['_popup'].setContent('<div class="row"><div class="col-6" align="left"><strong>'+data.name+'</strong></div><div class="col-6" align="right"><strong>'+data.speed+' km/h</strong></div></div>'+
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
  private followVehicle(data: any): void{
    this.maps.forEach(item => {
      item.dataFitBounds = [];
      for (let index = 0; index < item.vehicles!.length; index++) {
        if(data.IMEI==item.vehicles![index].IMEI){
          item.vehicles![index].follow = item.vehicles![index].follow;
        }
        if(item.vehicles![index].follow){
          const aux2: [number, number] = [item.vehicles![index].latitud, item.vehicles![index].longitud];
          item.dataFitBounds.push(aux2);
        } 
      }
      if(item.dataFitBounds.length>0){
        item.map!.fitBounds(item.dataFitBounds);
      }
    });
  }

  private monitor(data: any): void{
    
    //console.log("monitor: ", data);
    
    this.maps.forEach(item => {
      const resultado = item.vehicles!.find(vehi => vehi.IMEI == data.IMEI.toString());
      if(resultado){
        const index = item.vehicles!.indexOf(resultado);

        item.vehicles![index].latitud = data.Latitud.toString();
        item.vehicles![index].longitud = data.Longitud.toString();
        item.vehicles![index].speed = data.Velocidad;
        item.vehicles![index].dt_server = data.fecha_server;
        item.vehicles![index].dt_tracker = moment(data.fecha_tracker).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
        item.vehicles![index].altitud = data.Altitud;
        item.vehicles![index].señal_gps = data.señal_gps;
        item.vehicles![index].señal_gsm = data.señal_gsm;
        item.vehicles![index].parametros = data.Parametros;
        item.vehicles![index] = this.vehicleService.formatVehicle(item.vehicles![index]);

        if(item.imeiPopup==data.IMEI.toString()){
          let options = {
            imei: data.IMEI,
            name: item.vehicles![index].name,
            convoy: item.vehicles![index].convoy,
            longitud: data.Longitud,
            latitud: data.Latitud,
            speed: data.Velocidad,
            dt_tracker: item.vehicles![index].dt_tracker,//luego de pasar por filtro
            paradaDesde: "",
            vehicleService : this.vehicleService
          };
          // console.log("data enviada a function timeStopAux",options);
          this.timeStopAux(options);
        }

        if(item.vehicles![index].eye){
          let cont = 0;
          let object = item.markerClusterGroup.getLayers();
          for (const key in object) {
            // console.log("object[key]['_tooltip']['_content']==vehicles[index].name==>"+object[key]['_tooltip']['_content']+"=="+vehicles[index].name)
            if (object[key]['_tooltip']['_content']=="<span>"+item.vehicles![index].name+"</span>") {
              cont++;
              let oldCoords = item.markerClusterGroup.getLayers()[key].getLatLng();
              
              let coord = {
                lat : item.vehicles![index].latitud,
                lng : item.vehicles![index].longitud
              };

              let iconUrl = './assets/images/objects/nuevo/'+item.vehicles![index].icon;
              item.markerClusterGroup.getLayers()[key]['_popup']['_content'] = '<div class="row"><div class="col-6" align="left"><strong>'+item.vehicles![index].name+'</strong></div><div class="col-6" align="right"><strong>'+item.vehicles![index].speed+' km/h</strong></div></div>'+
                '<aside class="">'+
                  '<small>CONVOY: '+item.vehicles![index].convoy+'</small><br>'+
                  '<small>UBICACION: '+item.vehicles![index].latitud+', '+item.vehicles![index].longitud+'</small><br>'+
                  '<small>REFERENCIA: '+'Calculando ...'+'</small><br>'+
                  '<small>FECHA DE TRANSMISION: '+item.vehicles![index].dt_tracker+'</small><br>'+
                  '<small>TIEMPO DE PARADA: Calculando ...</small>'+
                '</aside>';
              // this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['iconUrl']='./assets/images/accbrusca.png';
              item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['iconUrl']=iconUrl;
              
              item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowSize']=[30,30];
              
              

              if(item.vehicles![index].speed != 0){

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
                  if(coord.lat > oldCoords.lat){
                    //arriba
                    this.direction_Y = 'up';
                    this.dif_Y = coord.lat-oldCoords.lat;  
                    if(this.dif_Y >= this.dif_mayor){
                      this.dif_mayor = this.dif_Y; 
                      this.direction = 'up';
                      this.dif_divide = this.dif_Y/2; 
                    }
                  }else{
                    //abajo
                    this.direction_Y = 'down';
                    this.dif_Y = oldCoords.lat-coord.lat;
                    if(this.dif_Y >= this.dif_mayor){
                      this.dif_mayor = this.dif_Y;
                      this.direction = 'down';
                      this.dif_divide = this.dif_Y/2;
                      
                    }
                  }
  
                  if(coord.lng > oldCoords.lng){
                    //derecha
                    this.direction_X = 'right';
                    this.dif_X = coord.lng-oldCoords.lng; 
                    if(this.dif_X >= this.dif_mayor){
                      this.dif_mayor = this.dif_X;
                      this.direction = 'right';
                      this.dif_divide = this.dif_X/2;
                    }
                  }else{
                    //izquierda
                    this.direction_X = 'left';
                    this.dif_X = oldCoords.lng-coord.lng;
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

                  item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${this.final_direction}.svg`;
                  item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[14,60]; 
                }
                else{
                  if(item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']){

                    let old_direction = item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl'].split('_');
                    //this.changePositionArrow(old_direction[1],key);

                    item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']=`./assets/images/arrow_${old_direction[1]}`;
                    item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowAnchor']=[14,60]; 
                  }
                  else{

                    item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
                    console.log('se borra la flecha', item.vehicles![index].name);
                  }

                }

              }else{
                item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
                
              }
              
              item.markerClusterGroup.getLayers()[key].setLatLng(coord);
              let aux = item.markerClusterGroup.getLayers()[key];

              item.dataFitBounds = [];
              for (const i in item.vehicles!){

                if(item.vehicles[i].follow){
                  const aux2: [number, number] = [item.vehicles[i].latitud, item.vehicles[i].longitud];
                  item.dataFitBounds.push(aux2);
                }
              }

              if(item.dataFitBounds.length>0){
                item.map!.fitBounds(item.dataFitBounds);
              }
            }
          }
        }
      }
    });
  }

  public addMap(mapItem:MapItem): void{
    // //console.log("loadMap");
    this.maps.push(mapItem);
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

  public changeClusteringVisibility(visibility: boolean){
    
    this.clustering = visibility;
  }

  public get getClustering(): boolean{

    return this.clustering;
  }
}