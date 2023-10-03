import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';
import {TreeNode} from 'primeng-lts/api';

import { environment } from 'src/environments/environment';
// import { SocketWebService } from '../services/socket-web.service';
import * as moment from 'moment';

import RefData from '../data/refData';
import { UserTracker } from 'src/app/multiview/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private URL_LIST = environment.apiUrl+'/api/tracker';
  private URL_TIME_STOP = environment.apiUrl+'/api/historialParada'

  public demo:boolean = false;
  public demo_id : number = 0;
  private url_demo = 'assets/trackers.json';
  // private url_demo = 'assets/trackers3.json';
  public treeTableStatus: boolean = false;
  public TableStatus: boolean = false;
  public vehicles: UserTracker[] = [];
  public vehiclesTree: TreeNode[]=[];
  public groups: any = [];
  public convoys: any = [];
  private timeDemo: number = 1000;
  public statusDataVehicle: boolean = false;
  public statusDataVehicleTree: boolean = false;

  public allEyes: any = { state: true };
  public countOpenEyes: number = 0;

  public listTable = -1; // 0 general, 1 = group

  public vehicleLoadingError: boolean = false;

  @Output() dataCompleted = new EventEmitter<any>();
  @Output() dataTreeCompleted = new EventEmitter<any>();

  @Output() drawIconMap = new EventEmitter<any>();
  @Output() reloadTable = new EventEmitter<any>();
  @Output() reloadTableTree = new EventEmitter<any>();
  @Output() sortLimit = new EventEmitter<any>();
  @Output() clickIcon = new EventEmitter<any>();
  @Output() clickEye = new EventEmitter<any>();
  @Output() clickEyeAll = new EventEmitter<any>();
  @Output() clickTag = new EventEmitter<any>();
  @Output() clickListTable = new EventEmitter<any>();
  @Output() calcTimeStop = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    ) {
  }

  public initialize(){
    /*
      procedimiento
        cargar data,
        emitir evento de carga a demas componentes
    */
   console.log('Iniciando vehicleService');
    if(this.demo){
      setTimeout(()=>{
        // //console.log("carga de data");
        this.http.get<any>(this.url_demo)
                    .toPromise()
                    .then(res => {
                      // console
                      // //console.log("data json",<TreeNode[]>res.data);
                      this.vehicles = this.dataFormatVehicle(<TreeNode[]>res.data);
                      this.vehiclesTree = this.createNode(this.vehicles);
                      this.dataCompleted.emit(this.vehicles);
                      this.dataTreeCompleted.emit(this.vehiclesTree);
                      this.statusDataVehicle = true;
                      this.statusDataVehicleTree = true;
                    });

        // this.vehicles = this.dataFormatVehicle(RefData.data);
        // this.statusDataVehicle = true;
        // this.dataCompleted.emit(this.vehicles);
      },this.timeDemo);
    }else{
      this.getVehicles().subscribe(vehicles=>{
        console.log("get vehicles",vehicles);
        this.vehicles = this.dataFormatVehicle(vehicles);
        this.vehiclesTree = this.createNode(this.vehicles);
        this.dataCompleted.emit(this.vehicles);
        this.dataTreeCompleted.emit(this.vehiclesTree);
        this.statusDataVehicle = true;
        this.statusDataVehicleTree = true;

        //InputSwitch EyeHeader behavior
        for(let i = 0; i < this.vehicles.length; i++){
          if(this.vehicles[i].eye){
            this.countOpenEyes++;
          }
        }
        this.allEyes.state = this.countOpenEyes > 0;
      },
      () => {
        console.log('Error al obtener los vehículos')
        this.vehicleLoadingError = true;
        this.dataCompleted.emit(false);
      }
      );
    }
  }

  /*tree table*/
  // public get
  /*end tree table*/
  public onClickEye(IMEI: string):void{
    this.clickEye.emit(IMEI);
  }
  public onClickIcon(IMEI: string):void{
    this.clickIcon.emit(IMEI);
  }
  public onClickTag(IMEI: string): void{
    this.clickTag.emit(IMEI);
  }
  // public reloadTableVehicles():void{
  //   this.reloadTable.emit();
  // }
  public sortLimitVehicle(): void{
    this.sortLimit.emit();
  }

  public getVehicles(): Observable<any>{
    return this.http.get(this.URL_LIST);
  }
  public queryTimeStop(params: any): Observable<any>{
    return this.http.get(this.URL_TIME_STOP+'?fecha_i='+params.fecha_i+'&vel='+params.speed+'&fecha_f='+params.fecha_f+'&imei='+params.imei+'&lat='+params.latitud+'&lng='+params.longitud);
  }
  public postTimeStop(data: any){
    // console.log("function time stop datos de envio",data);

      this.queryTimeStop(data).subscribe(response=>{
        // console.log('respuesta server response ',response);
        let aux = {
          imei: data.imei,
          name: data.name,
          convoy: data.convoy,
          longitud: data.longitud,
          latitud: data.latitud,
          speed: data.speed,
          dt_tracker: data.dt_tracker,
          direction: response.direction,
          paradaDesde: response.paradaDesde,
          res: response.res
        }
        // console.log("aux data query vehicle service",aux);
        this.calcTimeStop.emit(aux);
      });

  }
  public postTest(): any {
    console.log("data test");

    return this.vehicles;
  }
  public getVehiclesDemo(): any{
    return this.vehicles;
  }
  public getVehiclesData(): any{
    return this.vehicles;
  }
  public getVehicle(imei: string):any {
    // console.log('imei ===',imei);
    for (let index = 0; index < this.vehicles.length; index++) {
      // const element = array[index];
      // console.log(this.vehicles[index].IMEI);
      if(this.vehicles[index].IMEI==imei){
        return this.vehicles[index];
      }

    }
    return {};
  }

  public getSession(): Observable <any>{
    return this.http.get(this.URL_LIST);
  }

  //app
  public getIndexToIMEI(IMEI: string):any{
    ///implements
  }
  public updateVehicle(data : any){

  }
  public updateVehiclesData(data : UserTracker[]):void {
    this.vehicles = data;
    this.drawIconMap.emit(data);
  }

  // public updateVehicleActive(data: Vehicle): void{
  //   this.vehicles = data;
  //   this.drawIconMap.emit(data);
  // }
  private dataFormatVehicle(vehicles: any): any{
    const items = vehicles;
    const userConfigId = 0;//configuracion de usuario

    for (const i in items){
      items[i] = this.formatVehicle(items[i]);
      items[i].user_id = userConfigId;
      // items[i] = this.addSelect(items[i]);
      // items[i] = this.addTank(items[i]);
      // items[i].parametrosGet = this.addParams(items[i].parametros);
      // items[i].tipoGps = this.addTypeGps(items[i].parametros);
      // items[i]=this.addSignal(items[i],today);
      // items[i] = this.addVel(items[i]);
      // items[i] = this.addPointColor(items[i]);


    }
    return items
  }
  public formatVehicle(vehicle: any): any{
    if (vehicle.speed >6) {
      vehicle.paradaDesde = false;
    }
    const today = moment();
    // const date = moment(vehicle.dt_tracker).subtract(5, 'hours');
    const date = moment(vehicle.dt_tracker);

    vehicle.dt_tracker = date.format('YYYY-MM-DD HH:mm:ss');
    vehicle = this.addSelect(vehicle);
    vehicle = this.addTank(vehicle);
    vehicle.parametrosGet = this.addParams(vehicle.parametros);
    vehicle.tipoGps = this.addTypeGps(vehicle.parametros);
    vehicle=this.addSignal(vehicle,today);
    vehicle = this.addVel(vehicle);
    vehicle = this.addPointColor(vehicle);

    return vehicle;
  }

  private addPointColor(vehicle : any){
    // console.log(vehicle.IMEI+" vehicle.point_color antes = ",vehicle.point_color);
    if(vehicle.point_color==undefined)
    {
    vehicle.point_color = 100; //grey

    }

    if (vehicle.user_id != 445) {
      vehicle = this.addPointColorUser(vehicle);
    }else{
      vehicle = this.addPointColorUser445(vehicle);
    }



    // console.log("vehicle.point_color des = ",vehicle.point_color);
    return vehicle;
  }
  private addPointColorUser445(vehicle : any){
    // id = 445
    // console.log("color user 445 vehicle = ",vehicle);
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
            // //console.log("MAS DE 2 HORAS SIN TRANSMISION : " + vehicle.name);
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
    // console.log("color init user vehicle = ",vehicle);
    //860640057372346
    // if(vehicle.IMEI=='868324028888902'){
    // if(vehicle.IMEI=='860640057372346'){
    //   // console.log('vehicle color = ',vehicle);
    //   // console.log('vehicle color = ',vehicle);
    //   console.log('vehicle color init = ',vehicle);
    //   console.log("point_color ",vehicle.point_color);
    // }

    if ( vehicle.parametrosGet["sat"] == 0 || ( vehicle.v_vel > 3 && (vehicle.v_on == 0 || vehicle.v_ac < 5) ) )
    {
        vehicle.point_color = 60; //grey GPS sin señal
    }
    else if ( vehicle.v_on == 0 )
    {
        if( vehicle.c_01 >= 7200 ) {
            //mayor a 2 horas //==>4
            // img_url = "/images/objects/arrow-4-black.svg"; //==>4 Sin transmisión
            vehicle.point_color = 40; //grey Sin transmisión
        } else if (vehicle.v_vel <= 3) {
            //menor a 2 horas //==>3
            // img_url = "/images/objects/arrow-3-purple.svg"; //==>3 Parada (Apagado)
            vehicle.point_color = 30; //grey Detenido apagado

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
                        // //console.log("MAS DE 5 MINUTOS SIN TRANSMISION, EN MOVIMIENTO , ZONA DE NO COBERTURA: " + item.name);
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
            // //console.log("MAS DE 2 HORAS SIN TRANSMISION : " + item.name);
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

    // if(vehicle.IMEI=='860640057372346'){
    //   // console.log('vehicle color = ',vehicle);
    //   // console.log('vehicle color = ',vehicle);
    //   console.log('vehicle color init = ',vehicle);
    //   console.log("point_color ",vehicle.point_color);
    // }860640057372346
    //D0F-931   864200050813881
    // BNE-700  864200050774257 no tiene di4 ni ign
    //AHF-784 867604055672126
    // if(vehicle.IMEI=='867604055672126'){
    //   // console.log('vehicle color = ',vehicle);
    //   // console.log('vehicle color = ',vehicle);
    //   console.log('vehicle color = ',vehicle);
    //   console.log("point_color ",vehicle.point_color);
    // }
    return vehicle;
  }

  private addVel(vehicle : any){
    if(this.statusDataVehicle==false){
      vehicle.speed=0;
    }
    const v_gps = vehicle.speed;
    vehicle.v_sat = Number(vehicle.parametrosGet["sat"]);
    const v_di1 = vehicle.parametrosGet["di1"];
    let v_di4 = vehicle.parametrosGet["di4"];
    // if(vehicle.IMEI=='867604055672126'){
    //   console.log(vehicle);
    // }
    if(v_di4==undefined){
      v_di4 = vehicle.parametrosGet["Custom_ign"];
      // console.log("caso v_di4 undefined",vehicle.IMEI);
      // console.log("vehicle.parametrosGetCustom_ign",vehicle.parametrosGet["Custom_ign"]);
    }
    const v_acv = vehicle.parametrosGet["acv"];
    const v_accv = vehicle.parametrosGet["accv"];
    // const v_status = item.parametrosGet["GPRS Status"];

    const a_01 = moment(new Date( vehicle.dt_tracker.replace(/-/g, "/") ));
    const b_01 = moment(new Date());
    const c_01 = b_01.diff(a_01, 'seconds');
    // if(vehicle.IMEI=='868324028888902'){
    //   console.log("vehicle.name",vehicle.name);
    //   console.log("vehicle.dt_tracker",vehicle.dt_tracker);
    //   console.log("a_01",a_01);
    //   console.log("b_01",b_01);
    //   console.log("vehicle c_01 = ",c_01);
    //   console.log("v_di4",v_di4);
    //   console.log("v_di1",v_di1);
    //   console.log("vehicle.tipoGps",vehicle.tipoGps);
    // }

    vehicle.c_01=c_01;
    vehicle.v_vel = v_gps;

    if (vehicle.tipoGps == "ruptela") {
        var v_can = vehicle.parametrosGet["can_speed"];
        var v_spd = vehicle.parametrosGet["GPS speed"];
        var v_eco = vehicle.parametrosGet["ECO_max_speed"];

        if ( typeof v_can !== undefined && v_can > 10 ) {
            vehicle.v_vel = v_can;
        } else if (typeof v_spd !== undefined) {
            vehicle.v_vel = v_spd;
        } else if (typeof v_eco !== undefined && v_eco < 110 && (v_gps-10 < v_eco && v_gps+10 > v_eco  )) {
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
    if(this.statusDataVehicle==false){
      vehicle.follow = false;
      vehicle.eye = true;
      vehicle.tag = true;
    }
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
  createNode(data: any): any{
    //console.log("create node");
    //variables de inicio

    //identificando grupos
    let map: any=[];
    this.groups = [];
    this.convoys = [];
    let status_group = false;
    let status_convoy = false;
    let prueba = [];

    for(const index in data){
      if(this.groups.includes(data[index]['grupo'])){
      }else{
        this.groups.push(data[index]['grupo']);
        status_group= true;
      }
      if(this.convoys.includes(data[index]['grupo']+'_'+data[index]['convoy'])){
      }else{
        this.convoys.push(data[index]['grupo']+'_'+data[index]['convoy']);
        status_convoy= true;
      }

      // //console.log("posibilidad "+status_group+" - "+status_convoy);
      // //console.log()
      // posibilidades
      // 1 1
      // 0 1
      // 1 0
      // 0 0
      if(status_group&&status_convoy){
        prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
        map.push(
          {
            data:{name: data[index]['grupo'], col:3, type:'grupo', id:data[index]['idgrupo']},
            expanded: true,
            children:[
              {
                data:{name:data[index]['convoy'], col:3, type:'convoy', id:data[index]['idconvoy']},
                expanded: true,
                children: [
                  {
                    data:data[index]
                  }
                ]
              }
            ]
          }
        );

      }else if(!status_group&&status_convoy){
        prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
        //recuperar el id del grupo
        let index_group = this.groups.indexOf(data[index]["grupo"]);
        //reucperar id del convoy
        // let index_convoy = map[index_group]['children']['data']
        map[index_group]['children'].push(
          {
            data : {name: data[index]['convoy'], col: 3, type:'convoy', id:data[index]['idconvoy']},
            expanded: true,
            children: [
              {
                data:data[index]
              }
            ]
          }
        );
        // //console.log("index_group",index_group)
        // map[data]
      }else if(status_group&&!status_convoy){//igual que el caso 1 1
        // prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
        // //console.log("data[index]['convoy']",data[index]['convoy']);
        map.push(
          {
            data:{name: data[index]['grupo'], col: 3, type:'grupo', id:data[index]['idgrupo']},
            expanded: true,
            children:[
              {
                data:{name: data[index]['convoy'], col: 3, type:'convoy', id:data[index]['idconvoy']},
                expanded: true,
                children: [
                  {
                    data:data[index]
                  }
                ]
              }
            ]
          }
        );
      }else if(!status_group&&!status_convoy){
        // prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
        //recuperar el id del grupo
        let index_group = this.groups.indexOf(data[index]["grupo"]);
        //recuperar el id del convoy dentro del grupo
        // let index_convoy = map[index_group]['children']['data']

        // //console.log("mar de opciones", map[index_group]['children'].indexOf({data:{name:"GRUPO LINARES"}}));
        // //console.log("mar de opciones", map[index_group]['children']);
        let e = map[index_group]['children'];
        let b = {data:{name:data[index]['convoy']}};
        // //console.log("index-->",e.indexOf(b));
        let aux_index: string = "0";
        for(const i in e){
          // //console.log("convoy",e[i]['data']['name'])
          if(e[i]['data']['name']==data[index]['convoy']){
            // //console.log("exito en "+data[index]["grupo"]+"/"+data[index]['convoy']+" -->",i);
            aux_index = i;
          }
        }
        // //console.log("aux_index",aux_index);
        map[index_group]['children'][aux_index]["children"].push({
          data:data[index]
        });
      }
      status_group=false;
      status_convoy=false;

    }
    // //console.log("groups",this.groups);
    // //console.log("convoys",this.convoys);
    // //console.log("map",map);
    // //console.log("prueba",prueba);

    return map;
  }

}
