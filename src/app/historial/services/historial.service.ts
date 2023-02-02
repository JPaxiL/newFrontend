import { Injectable } from '@angular/core';

import RefDataHistorial from '../data/refDataHistorial';
import * as moment from 'moment';

import { BehaviorSubject } from 'rxjs';


import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/app/events/services/event.service';



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

  //---------------------------  Multi Historial --------------------------------------------------

  public arrayRecorridos : any = [];
  public keyGrafico : string = "";



  //---------------------------  Multi Historial --------------------------------------------------


  constructor(private http: HttpClient,
    private EventService : EventService) {
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

  public initializeForm(){
    this.dataFormulario = {
      inicio : true,

      selectedCar : null,

      selectedRango : '1',//{id: '0'}, //Rango de fechas para el historial
      duracionParada : '60',//{id: '60'}, //Duracion de la parada


      // fecha_desde : dateCurrent,// moment().startOf('day').format("YYYY-MM-DD"),
      // fecha_hasta : dateCurrent,//moment().startOf('day').format("YYYY-MM-DD"),
      // hora_desde  : '00',//{id: '00', name:'00'},
      // min_desde   : '00',//{id: '00', name:'00'},
      // hora_hasta  : '00',//{id: '00', name:'00'},
      // min_hasta   : '00',//{id: '00', name:'00'},

      pngFechaIni: new Date(moment( Date.now() ).format('YYYY-MM-DDTHH:mm')),
      pngFechaFin: new Date(moment( Date.now() ).add(1, 'days').format('YYYY-MM-DDTHH:mm')),
      // pngHoraIni2: 0,
      // pngMinIni: 0,
      // pngHoraFin2: 0,
      // pngMinFin: 0,

      pngHoraIni2 : new Date('2018-03-12T00:00'),
      pngHoraFin2 : new Date('2018-03-12T00:00'),



      colorHistorial : "#FF0000",//dataUser.his_color,//"#00FFFF",//dataUser.map_rc,//"#FF0000",
      colorSubHistorial : "#0000FF",//dataUser.resaltado_color,//"#0000FF",

      chckParada  :true,
      chckTrama   :false,
      chckTramaFechaVelocidad : false,
      chckGrafico :false,
      chckEvento  :false,

      eventos :
            {
                all:false,
                evSalida:true,
                evEntrada:true,
                evEstadia:true,
                evParada:true,

                GPSbateriaBaja:true,
                GPSbateriaDesconectada:true,
                GPSaceleracionBrusca:true,
                GPSfrenadaBrusca:true,
                GPSbloqueoTransmision:true,
                GPSsos:true,
                GPSremolque:true,
                GPSparada:true,
                GPSmotorEncendido:true,
                GPSmotorApagado:true,

                evMovSinProgramacion:true,
                evInfraccion:true,
                evCambioConductor:true,
                evCambioConductorNoRealizado:true,
                evAnticolisionFrontal:true,
                evColisionConPeatones:true,

                evNoRostro:true,
                evFatigaExtrema:true,
                evDesvioCarrilIzquierda:true,
                evDesvioCarrilDerecha:true,
                evBloqueoVisionMobileye:true,


                evManPreventivo:true,
                evManCorrectivo:true,
                evManPreventivoRealizado:true,
                evManCorrectivoRealizado:true,

                AccEstadia:true,
                AccAlcoholemia:true,
                AccIButton:true,
                AccSomnolencia:true,
                AccDistraccion:true,
                OtroExVelocidad:true,

            },
       isCollapsedEventos: true

       // vm.form.eventos.evEntrada
       // vm.form.eventos.evSalida
       // vm.form.eventos.evEstadia
       // vm.form.eventos.evParada
    }
  }


  public initialize (){


    //console.log('INICIALIZAR SERVICIO DEL HISTORIAL');
    let dateCurrent = {
      "year": moment().year(),
      "month": moment().month()  + 1,
      "day": moment().date()
    };

    this.initializeForm();

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



