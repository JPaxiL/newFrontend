import { Injectable } from '@angular/core';

import RefDataHistorial from '../data/refDataHistorial';
import * as moment from 'moment';

import { BehaviorSubject } from 'rxjs';


import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';


@Injectable({
  providedIn: 'root'
})
export class HistorialService {


  //----------------- INICIO mensaje entre componentes ------------------
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();


  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  //----------------- FIN mensaje entre componentes ------------------



  public tramasHistorial: any = [];

  public conHistorial = false;

  public dataFormulario: any = {};

  public inicio = true;

  public nombreUnidad = '';





  constructor(private http: HttpClient) {
    //this.tramasHistorial = RefDataHistorial.data;
    // //console.log("XXXXXXX");
    // //console.log(this.tramasHistorial);
  }

  public getHistorial (){
    // this.tramasHistorial = RefDataHistorial.data;
    // this.tramasHistorial = RefDataHistorial.data2;
    // this.tramasHistorial = RefDataHistorial.data3;
    this.tramasHistorial = RefDataHistorial.data4;

    // var tramas = this.get_tramas_recorrido();
    // //console.log('================== DDD ');

    // //console.log( tramas );

  }


  public initialize (){


    //console.log('INICIALIZAR SERVICIO DEL HISTORIAL');
    let dateCurrent = {
      "year": moment().year(),
      "month": moment().month()  + 1,
      "day": moment().date()
    };


    this.dataFormulario = {
      inicio : true,

      selectedCar : null,

      selectedRango : '1',//{id: '0'}, //Rango de fechas para el historial
      duracionParada : '60',//{id: '60'}, //Duracion de la parada


      fecha_desde : dateCurrent,// moment().startOf('day').format("YYYY-MM-DD"),
      fecha_hasta : dateCurrent,//moment().startOf('day').format("YYYY-MM-DD"),
      hora_desde  : '00',//{id: '00', name:'00'},
      min_desde   : '00',//{id: '00', name:'00'},
      hora_hasta  : '00',//{id: '00', name:'00'},
      min_hasta   : '00',//{id: '00', name:'00'},


      colorHistorial : "#00FFFF",//dataUser.his_color,//"#00FFFF",//dataUser.map_rc,//"#FF0000",
      colorSubHistorial : "#0000FF",//dataUser.resaltado_color,//"#0000FF",

      chckParada  :true,
      chckTrama   :false,
      chckGrafico :false,
      chckEvento  :false,

      eventos :
            {
                all:false,
                evSalida:false,
                evEntrada:false,
                evEstadia:false,
                evParada:false,

                GPSbateriaBaja:false,
                GPSbateriaDesconectada:false,
                GPSaceleracionBrusca:false,
                GPSfrenadaBrusca:false,
                GPSbloqueoTransmision:false,
                GPSsos:false,
                GPSremolque:false,
                GPSparada:false,
                GPSmotorEncendido:false,
                GPSmotorApagado:false,

                evMovSinProgramacion:false,
                evInfraccion:false,
                evCambioConductor:false,
                evCambioConductorNoRealizado:false,
                evAnticolisionFrontal:false,
                evColisionConPeatones:false,

                evManPreventivo:false,
                evManCorrectivo:false,
                evManPreventivoRealizado:false,
                evManCorrectivoRealizado:false,

                AccEstadia:false,
                AccAlcoholemia:false,
                AccIButton:false,
                AccSomnolencia:false,
                AccDistraccion:false,
                OtroExVelocidad:false,

            },
       isCollapsedEventos: true

       // vm.form.eventos.evEntrada
       // vm.form.eventos.evSalida
       // vm.form.eventos.evEstadia
       // vm.form.eventos.evParada
    }

  }


  public async get_tramas_recorrido(param:any) {


    // //console.log('----1');

    // this.http.get<any>('assets/trackers.json')
    // .toPromise()
    // .then(res => {
    //   // console
    //   //console.log("data json",res.data);

    // });
    // //console.log('----2');
    // const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/events`).toPromise();
    // const response2 = new Array();
    // response2.push(  await this.http.post(`${environment.apiUrl}/api/historial`,param).toPromise() );
    this.tramasHistorial = await this.http.post(`${environment.apiUrl}/api/historial`,param).toPromise();
    //const response2 = await this.http.get(`${environment.apiUrl}/api/historial2`).toPromise();
    //(//console.log(response2);

    // //console.log('----2');

    // const response2 = await this.http.get(`${environment.apiUrl}/historial2`);

    // return this.http.put(this.api_url+"/api/tracker/"+vehicle.IMEI,vehicle);

    // const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/historial`,param).toPromise();

    return 'listoooo';
  }


  // public async getAlertsByType2(type:string){
  //   const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alerts/${type}`).toPromise();
  //   let event = response.data;
  //   return event;
  // }

  // public async create2(alert: any) {
  //   const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/alerts`,alert).toPromise();
  //   return response.data;
  // }

}



