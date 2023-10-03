import { Injectable, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import * as moment from 'moment';
import 'leaflet.markercluster';
import 'leaflet.markercluster.freezable';

import { SocketWebService } from 'src/app/vehicles/services/socket-web.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { FollowService } from 'src/app/vehicles/services/follow.service';
import { MapItem, UserTracker } from '../models/interfaces';

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
    this.vehicleService.initialize();
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
        console.log("user data completadoooo",vehicles);
        
        this.onDrawIcon();
    });
    this.socketWebService.callback.subscribe(res =>{
      this.monitor(res);
    });
    this.followService.callback.subscribe(res =>{
      console.log("Follow event desde map service");
      this.followVehicle(res.data);
    });

    this.vehicleService.calcTimeStop.subscribe(data=>{
      console.log("event time stop res = ",data);

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
            item.configuration!.vehicles?.forEach(element => {
              if(element.tracker_imei == data.imei){
                item.imeiPopup = data.imei;
                item.time_stop = tiempoParada;
                this.printPopup(aux,item.id!); //que actualice el popup en el mapa con tal id
              }
            });
          });
      }
    });

  }

  onDrawIcon(): void{
    console.log("onDrawIcon");
    this.maps.forEach(mapItem => {
      const e = mapItem.configuration!.vehicles!;

      const transmissionStatusColor: any = {
        10:"green",
        20:"blue",
        30:"purple",
        40:"black",
        50:"orange",
        60:"red",
        100:"transm-color-not-defined"
      }

      mapItem.markerClusterGroup.clearLayers();

      for (const property in e){
          if (e.hasOwnProperty(property)&&e[property].eye == true) {
            this.drawIcon(e[property], mapItem);
          }
      }

      if(mapItem.dataFitBounds!.length>0){
        // //console.log("dataFitBounds map",this.dataFitBounds);
        mapItem.map!.fitBounds(mapItem.dataFitBounds!);
      }
      mapItem.dataFitBounds = [];
      //EVENTO cluster lista
      mapItem.markerClusterGroup.on('clusterclick',function(a : any){
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
            .openOn(mapItem.map!);
      });
    });
  }
  private drawIcon(data:any, mapItem: MapItem): void{
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
        '<small>TIEMPO DE PARADA: '+mapItem.time_stop+'</small>'+
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
    console.log('envia cero XD',options.speed);
    tempMarker.on('click',mapItem.time_stop,options);
    // tempMarker.on('click',this.timeStop,options);
    // // this
    //this.marker[data.IMEI]=tempMarker;

    mapItem.markerClusterGroup.addLayer(tempMarker);
    // //console.log('this.markerClusterGroup',this.markerClusterGroup);
    let object = mapItem.markerClusterGroup.getLayers();
    let cont = 0;
    for (const key in object) {
      if (object[key]['_tooltip']['_content']==data.name) {
        //console.log('dato encontrado'+object[key]['_tooltip']['_content']+'=='+data.name);
        //console.log('key = ',key);
        //console.log('content popup',this.markerClusterGroup.getLayers()[key]['_popup']['_content']);
        cont++;
      }
    }
    
    mapItem.markerClusterGroup.addTo(mapItem.map);
    //let layers = mapItem.markerClusterGroup.getLayers();
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
      for (let index = 0; index < item.configuration!.vehicles!.length; index++) {
        if(data.IMEI==item.configuration!.vehicles![index].tracker_imei){
          item.configuration!.vehicles![index].follow = item.configuration!.vehicles![index].follow;
        }
        if(item.configuration!.vehicles![index].follow){
          const aux2: [number, number] = [parseFloat(item.configuration!.vehicles![index].latitud!), parseFloat(item.configuration!.vehicles![index].longitud!)];
          item.dataFitBounds.push(aux2);
        } 
      }
      if(item.dataFitBounds.length>0){
        item.map!.fitBounds(item.dataFitBounds);
      }
    });
  }

  private monitor(data: any): void{
    
    
    this.maps.forEach(item => {
      //console.log("vehicles in item: ", item.configuration?.vehicles);
      const resultado = item.configuration?.vehicles!.find(vehi => vehi.tracker_imei == data.IMEI.toString());
      //console.log("data IMEI: ", data.IMEI.toString());
      //console.log("vehicles IMEIs: ", item.configuration?.vehicles!.map(item=> {return item.tracker_imei}));
      
      if(resultado){
        const index = item.configuration!.vehicles!.indexOf(resultado);
        console.log("resultado e indice: ", resultado, index);

        item.configuration!.vehicles![index].latitud = data.Latitud.toString();
        item.configuration!.vehicles![index].longitud = data.Longitud.toString();
        item.configuration!.vehicles![index].speed = data.Velocidad;
        item.configuration!.vehicles![index].dt_server = data.fecha_server;
        item.configuration!.vehicles![index].dt_tracker = moment(data.fecha_tracker).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
        item.configuration!.vehicles![index].altitud = data.Altitud;
        item.configuration!.vehicles![index].señal_gps = data.señal_gps;
        item.configuration!.vehicles![index].señal_gsm = data.señal_gsm;
        item.configuration!.vehicles![index].parametros = data.Parametros;
        item.configuration!.vehicles![index] = this.vehicleService.formatVehicle(item.configuration!.vehicles![index]);

        console.log("["+resultado.numero_placa+"] item.imeiPopup==data.IMEI.toString()", item.imeiPopup==data.IMEI.toString());
        if(item.imeiPopup==data.IMEI.toString()){
          
          let options = {
            imei: data.IMEI,
            name: item.configuration!.vehicles![index].name,
            convoy: item.configuration!.vehicles![index].convoy,
            longitud: data.Longitud,
            latitud: data.Latitud,
            speed: data.Velocidad,
            dt_tracker: item.configuration!.vehicles![index].dt_tracker,//luego de pasar por filtro
            paradaDesde: "",
            vehicleService : this.vehicleService
          };
          // console.log("data enviada a function timeStopAux",options);
          this.timeStopAux(options);
        }

        console.log("["+resultado.numero_placa+"] item.configuration!.vehicles![index].eye", item.configuration!.vehicles![index].eye);
        if(item.configuration!.vehicles![index].eye){
          
          let cont = 0;
          let object = item.markerClusterGroup.getLayers();
          for (const key in object) {
            // console.log("object[key]['_tooltip']['_content']==vehicles[index].name==>"+object[key]['_tooltip']['_content']+"=="+vehicles[index].name)
            if (object[key]['_tooltip']['_content']=="<span>"+item.configuration!.vehicles![index].name+"</span>") {
              cont++;
              let oldCoords = item.markerClusterGroup.getLayers()[key].getLatLng();
              
              let coord = {
                lat : parseFloat(item.configuration!.vehicles![index].latitud!),
                lng : parseFloat(item.configuration!.vehicles![index].longitud!)
              };

              let iconUrl = './assets/images/objects/nuevo/'+item.configuration!.vehicles![index].icon;
              item.markerClusterGroup.getLayers()[key]['_popup']['_content'] = '<div class="row"><div class="col-6" align="left"><strong>'+item.configuration!.vehicles![index].name+'</strong></div><div class="col-6" align="right"><strong>'+item.configuration!.vehicles![index].speed+' km/h</strong></div></div>'+
                '<aside class="">'+
                  '<small>CONVOY: '+item.configuration!.vehicles![index].convoy+'</small><br>'+
                  '<small>UBICACION: '+item.configuration!.vehicles![index].latitud+', '+item.configuration!.vehicles![index].longitud+'</small><br>'+
                  '<small>REFERENCIA: '+'Calculando ...'+'</small><br>'+
                  '<small>FECHA DE TRANSMISION: '+item.configuration!.vehicles![index].dt_tracker+'</small><br>'+
                  '<small>TIEMPO DE PARADA: Calculando ...</small>'+
                '</aside>';
              // this.markerClusterGroup.getLayers()[key]['options']['icon']['options']['iconUrl']='./assets/images/accbrusca.png';
              item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['iconUrl']=iconUrl;
              
              item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowSize']=[30,30];
              
              

              if(item.configuration!.vehicles![index].speed != 0){

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
                    console.log('se borra la flecha', item.configuration!.vehicles![index].name);
                  }
                }
              }else{
                item.markerClusterGroup.getLayers()[key]['options']['icon']['options']['shadowUrl']='';
                
              }
              
              item.markerClusterGroup.getLayers()[key].setLatLng(coord);
              let aux = item.markerClusterGroup.getLayers()[key];

              item.dataFitBounds = [];
              item.dataFitBounds = item.setFitBounds(item.configuration!);
              item.map?.setView(item.setCenterMap(item.configuration!));
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
    console.log("loadMapp--------");
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