import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';
// import { SocketWebService } from '../services/socket-web.service';
import * as moment from 'moment';

import RefData from '../data/refData';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private URL_LIST = 'http://127.0.0.1:8001/api/tracker';

  public vehicles: any = [];
  private demo:boolean = false;
  private timeDemo: number = 1000;
  public statusDataVehicle: boolean = false;

  @Output() dataCompleted = new EventEmitter<any>();

  @Output() drawIconMap = new EventEmitter<any>();
  @Output() reloadTable = new EventEmitter<any>();
  @Output() sortLimit = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    /*
      procedimiento
        cargar data,
        emitir evento de carga a demas componentes
    */

    //tiempo critico
    if(this.demo){
      setTimeout(()=>{
        // console.log("carga de data");
        this.vehicles = this.dataFormatVehicle(RefData.data);
        this.statusDataVehicle = true;
        this.dataCompleted.emit(this.vehicles);
      },this.timeDemo);
    }else{
      this.getVehicles().subscribe(vehicles=>{
        // console.log("vehicles",vehicles);
        this.vehicles = this.dataFormatVehicle(vehicles);
        this.statusDataVehicle = true;
        this.dataCompleted.emit(this.vehicles);
      });
    }

  }
  public reloadTableVehicles():void{
    this.reloadTable.emit();
  }
  public sortLimitVehicle(): void{
    this.sortLimit.emit();
  }

  public getVehicles(): Observable<any>{
    return this.http.get(this.URL_LIST);
  }
  public getVehiclesDemo(): any{
    return this.vehicles;
  }
  public getVehiclesData(): any{
    return this.vehicles;
  }

  public getSession(): Observable <any>{
    return this.http.get(this.URL_LIST);
  }

  //app
  public updateVehiclesData(data: Vehicle):void {
    this.vehicles = data;
    this.drawIconMap.emit(data);
  }

  // public updateVehicleActive(data: Vehicle): void{
  //   this.vehicles = data;
  //   this.drawIconMap.emit(data);
  // }
  private dataFormatVehicle(vehicles: any): any{
    const items = vehicles;
    const today = moment();
    const userConfigId = 0;//configuracion de usuario

    for (const i in items){
      items[i].user_id = userConfigId;
      items[i] = this.addSelect(items[i]);
      items[i] = this.addTank(items[i]);
      items[i].parametrosGet = this.addParams(items[i].parametros);
      items[i].tipoGps = this.addTypeGps(items[i].parametros);
      items[i]=this.addSignal(items[i],today);
      items[i] = this.addVel(items[i]);
      items[i] = this.addPointColor(items[i]);


    }
    return items
  }

  private addPointColor(vehicle : any){
    vehicle.point_color = 100; //grey

    if (vehicle.user_id != 445) {
      vehicle = this.addPointColorUser(vehicle);
    }else{
      vehicle = this.addPointColorUser445(vehicle);
    }




    return vehicle;
  }
  private addPointColorUser445(vehicle : any){
    // id = 445
    if( vehicle.c_01 >= 7200 ) {
        //mayor a 2 horas //==>4
        // img_url = "/images/objects/arrow-4-black.svg"; //==>4 Sin transmisión
        vehicle.point_color = 40; //grey
    } else {
        if (vehicle.v_vel <= 3) {
            // img_url = "/images/objects/arrow-2-blue.svg"; //==>2 Parada (Prendida)
            vehicle.point_color = 20; //grey
        } else if (vehicle.v_vel > 3 && vehicle.v_on == 0) {
            // img_url = "/images/objects/arrow-1-green.svg"; //==>1 Movimiento
            vehicle.point_color = 10; //grey
        }

        if (vehicle.m2h > 0) {
            clearTimeout(vehicle.m2h);
            vehicle.m2h = 0;
        }
        vehicle.m2h = setTimeout(() => {
            // console.log("MAS DE 2 HORAS SIN TRANSMISION : " + vehicle.name);
            vehicle.c_02 = moment(new Date()).diff( moment(new Date( vehicle.dt_tracker.replace(/-/g, "/") )) , 'seconds');
            if( vehicle.c_02 >= 7200 ) {
                // if (userConfig.icono == "arrow2") {
                //     var img_url_02 = "/images/objects/arrow-4-black.svg"; //==>4 Sin transmisión
                //     var icon = new L.Icon({
                //                 iconUrl: img_url_02,
                //                 iconSize: [20, 32],
                //                 iconAnchor: [7, 13]
                //     });
                //     vehicle.layer.setIcon(icon);
                //     vehicle.layer.options.rotationAngle = vehicle.angulo;
                // }
                vehicle.point_color = 40; //grey
                // vehicle.layer.label.setContent(vehiclesHelper.getContentLabel(vehicle));
            }
            vehicle.m2h = 0;
        }, (7200 - vehicle.c_01)*1000 );

    }
    return vehicle;
  }

  private addPointColorUser(vehicle : any){

    if ( vehicle.parametrosGet["sat"] == 0 || ( vehicle.v_vel > 3 && (vehicle.v_on == 0 || vehicle.v_ac < 5) ) )
    {
        vehicle.point_color = 60; //grey
    }
    else if ( vehicle.v_on == 0 )
    {
        if( vehicle.c_01 >= 7200 ) {
            //mayor a 2 horas //==>4
            // img_url = "/images/objects/arrow-4-black.svg"; //==>4 Sin transmisión
            vehicle.point_color = 40; //grey
        } else if (vehicle.v_vel <= 3) {
            //menor a 2 horas //==>3
            // img_url = "/images/objects/arrow-3-purple.svg"; //==>3 Parada (Apagado)
            vehicle.point_color = 30; //grey
        }
    }
    else {

      if ((vehicle.v_vel > 3) && (vehicle.v_on == 1)) {
                if( vehicle.c_01 > 300 ) {
                    //mayor a 5 minutos //==>5
                    // img_url = "/images/objects/arrow-5-orange.svg"; //==>5 Zona de no cobertura
                    vehicle.point_color = 50; //grey
                } else {
                    //menor a 5 minutos //==>1
                    // img_url = "/images/objects/arrow-1-green.svg"; //==>1 Movimiento
                    vehicle.point_color = 10; //grey
                    if (vehicle.m5 > 0) {
                        clearTimeout(vehicle.m5);
                        vehicle.m5 = 0;
                    }
                    vehicle.m5 = setTimeout(() => {
                        // console.log("MAS DE 5 MINUTOS SIN TRANSMISION, EN MOVIMIENTO , ZONA DE NO COBERTURA: " + item.name);
                        vehicle.c_02 = moment(new Date()).diff( moment(new Date( vehicle.dt_tracker.replace(/-/g, "/") )) , 'seconds');
                        if ((vehicle.v_vel > 3) && (vehicle.v_on == 1) && (vehicle.c_02 >= 300)) {
                                //mayor a 5 minutos //==>5
                                // if (userConfig.icono == "arrow2") {
                                //     var img_url_02 = "/images/objects/arrow-5-orange.svg"; //==>5 Zona de no cobertura
                                //     var icon = new L.Icon({
                                //                 iconUrl: img_url_02,
                                //                 iconSize: [20, 32],
                                //                 iconAnchor: [7, 13]
                                //     });
                                //     item.layer.setIcon(icon);
                                // }
                                vehicle.point_color = 50; //grey
                                // item.layer.label.setContent(vehiclesHelper.getContentLabel(item));
                        }

                        vehicle.m5 = 0;
                    }, (300 - vehicle.c_01)*1000 );
                }
        } else if ( (vehicle.v_vel <= 3) && ( vehicle.v_on == 1 ) ) {
                // img_url = "/images/objects/arrow-2-blue.svg"; //==>2 Parada (Prendida)
                vehicle.point_color = 20; //grey
        }

        if (vehicle.m2h > 0) {
            clearTimeout(vehicle.m2h);
            vehicle.m2h = 0;
        }
        vehicle.m2h = setTimeout(() => {
            // console.log("MAS DE 2 HORAS SIN TRANSMISION : " + item.name);
            vehicle.c_02 = moment(new Date()).diff( moment(new Date( vehicle.dt_tracker.replace(/-/g, "/") )) , 'seconds');
            if( vehicle.c_02 >= 7200 && vehicle.v_on == 0 ) {
                // if (userConfig.icono == "arrow2") {
                //     var img_url_02 = "/images/objects/arrow-4-black.svg"; //==>4 Sin transmisión
                //     var icon = new L.Icon({
                //                 iconUrl: img_url_02,
                //                 iconSize: [20, 32],
                //                 iconAnchor: [7, 13]
                //     });
                //     item.layer.setIcon(icon);
                //     item.layer.options.rotationAngle = item.angulo;
                // }
                vehicle.point_color = 40; //grey
                // vehicle.layer.label.setContent(vehiclesHelper.getContentLabel(vehicle));
            }
            vehicle.m2h = 0;
        }, (7200 - vehicle.c_01)*1000 );

    }
    return vehicle;
  }

  private addVel(vehicle : any){
    if(this.statusDataVehicle==false){
      vehicle.speed=0;
    }
    const v_gps = vehicle.speed;
    vehicle.v_sat = Number(vehicle.parametrosGet["sat"]);
    const v_di4 = vehicle.parametrosGet["di4"];
    const v_di1 = vehicle.parametrosGet["di1"];
    const v_acv = vehicle.parametrosGet["acv"];
    const v_accv = vehicle.parametrosGet["accv"];
    // const v_status = item.parametrosGet["GPRS Status"];

    const a_01 = moment(new Date( vehicle.dt_tracker.replace(/-/g, "/") ));
    const b_01 = moment(new Date());
    const c_01 = b_01.diff(a_01, 'seconds');

    vehicle.c_01=c_01;
    vehicle.v_vel = v_gps;

    if (vehicle.tipoGps == "ruptela") {
        var v_can = vehicle.parametrosGet["can_speed"];
        var v_spd = vehicle.parametrosGet["GPS speed"];
        var v_eco = vehicle.parametrosGet["ECO_max_speed"];

        if ( typeof v_can !== 'undefined' && v_can > 10 ) {
            vehicle.v_vel = v_can;
        } else if (typeof v_spd !== 'undefined') {
            vehicle.v_vel = v_spd;
        } else if (typeof v_eco !== 'undefined' && v_eco < 110 && (v_gps-10 < v_eco && v_gps+10 > v_eco  )) {
            vehicle.v_vel = v_eco;
        } else {
            vehicle.v_vel = v_gps;
        }

        vehicle.v_on = v_di4;
        vehicle.v_ac = v_acv;
    } else if (vehicle.tipoGps == "teltonika") {
        vehicle.v_on = v_di1;
        vehicle.v_ac = v_accv;
    } else if (vehicle.tipoGps == "avl") {
        vehicle.v_sat = 1;
        vehicle.v_on = 1;
        vehicle.v_ac = 5;
    }

    return vehicle;
  }

  private addSignal(vehicle : any, today : any){
    vehicle.dt_server = moment(vehicle.dt_server);

    if (today.diff(vehicle.dt_server, 'hours') <= 3) {
        vehicle['señal_gps'] = Number('5');
        vehicle['señal_gsm'] = Number('5');
    } else {
        vehicle['señal_gps'] = Number('0');
        vehicle['señal_gsm'] = Number('0');
    }

    vehicle.dt_server = vehicle.dt_server.format('YYYY-MM-DD HH:mm:ss');

    vehicle.timer = 0;
    return vehicle;
  }

  private addTypeGps(params : any){
    if ( params.indexOf('ruptela') !== -1 ) {
      return "ruptela";
    } else if ( params.indexOf('teltonika') !== -1 ) {
      return "teltonika";
    } else if ( params.indexOf('avl') !== -1 ) {
      return "avl";
    }else{
      return "";
    }
  }

  private addParams(params: any){

    var arrayParam = params.split("|"); // explode('|', params);
          var paramsObj = [];

          //var arrayParam = a[i].params.split("|");
          for ( var j = 0; j < arrayParam.length; j++ )
          {
              //======= Detector de di1 (Somnolencia) ==============
              if ( arrayParam[j].indexOf("=") > -1 )
              {
                  var temp = arrayParam[j].split("=");
                  temp[0] = temp[0].trim();
                  temp[1] = temp[1].trim();
                  // arrayR.push(di1[0]);
                  if ( isNaN(temp[1]) ) {
                      paramsObj[temp[0]] = temp[1];
                  } else {
                      paramsObj[temp[0]] = parseFloat(temp[1]);
                  }
                  // arrayP.push(di1);
              };
              //======= Detector de di1 (Somnolencia) ==============
              if ( arrayParam[j].indexOf(":") > -1 )
              {
                  var temp = arrayParam[j].split(":");
                  temp[0] = temp[0].trim();
                  temp[1] = temp[1].trim();
                  if ( isNaN(temp[1]) ) {
                      paramsObj[temp[0]] = temp[1];
                  } else {
                      paramsObj[temp[0]] = parseFloat(temp[1]);
                  }
              };
          };

          return paramsObj;
  }

  private addSelect(vehicle: any){
    vehicle.follow = false;
    vehicle.eye = true;
    vehicle.tag = true;
    vehicle.arrayPrueba = [];
    vehicle.arrayPruebaParada = [];
    vehicle.paradaDesde = false;
    vehicle.eventos = {};
    // vehicle.dt_server = moment(vehicle.dt_server);

    return vehicle;
  }

  private addTank(vehicle: any){
    if(vehicle.tanque == 0){
      vehicle.capacidad_tanque = 0;
      vehicle.capacidad_tanque_text = '0 gal. || 0 l.';
    }else{
      const tanqueC = vehicle.tanque.split(',');
      vehicle.capacidad_tanque = parseInt(tanqueC[1]);
      vehicle.capacidad_tanque_text = vehicle.capacidad_tanque+" gal. || "+( vehicle.capacidad_tanque * 3.7854118).toFixed(2) +' l.';
    }
    return vehicle;
  }

}
