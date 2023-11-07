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
  public icono = '';
  public nameoperation = "";
  
  modalActive:boolean = false;

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

      // pngFechaIni: new Date(moment( "2023-10-03" ).format('YYYY-MM-DDTHH:mm')),
      // pngFechaFin: new Date(moment( "2023-10-03" ).format('YYYY-MM-DDTHH:mm')),


      // pngHoraIni2: 0,
      // pngMinIni: 0,
      // pngHoraFin2: 0,
      // pngMinFin: 0,

      pngHoraIni2 : new Date('2018-03-12T00:00'),
      pngHoraFin2 : new Date('2018-03-12T00:00'),

      // pngHoraIni2 : new Date('2018-03-12T12:00'),
      // pngHoraFin2 : new Date('2018-03-12T12:30'),


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

  async getReference(lat: any, lng: any){
    const response:ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user/get-reference`, {
        params:
        {
          latitud:lat,
          longitud:lng
        }
      })
      .toPromise();

      // console.log("===============================");
      // console.log(response);
      
      return response.data;
  }


  async getStreetViewImg(lat: any, lng: any){
    //const response:ResponseInterface 
    var urlReference = "https://api.openstreetcam.org/2.0/photo/?lat="+lat+"&lng="+lng+"&radius=20000";
    // console.log(urlReference);
    
    //.get<ResponseInterface>(`https://api.openstreetcam.org/2.0/photo/?lat=-18.073114&lng=-70.294772`, {})
    var response:any = await this.http
      .get<ResponseInterface>(urlReference, {})
      .toPromise();

      // console.log("===============================getStreetViewImg");
      // console.log(response);
      // console.log(response.status.httpCode);
      // console.log(response.result.data[0].filepathTh);
      if (response.status.httpCode == 200 && response.status.apiCode == 600) {
          // apiCode = 601
          // apiMessage = "The request has an empty response"
          //RESULTADO VACIO
          // console.log(response.result.data[0].lat);
          // console.log(response.result.data[0].lng);

          var distancia_min = 10000000;
          var id_min = 0;
          for (let i = 0; i < response.result.data.length; i++) {
              var distanciaEnKilometros = this.calcularDistanciaEntreDosCoordenadas(lat, lng, response.result.data[i].lat, response.result.data[i].lng);
              if (distanciaEnKilometros < distancia_min) {
                  distancia_min = distanciaEnKilometros
                  id_min = i;
              }
          }

          //var distanciaEnKilometros = this.calcularDistanciaEntreDosCoordenadas(lat, lng, response.result.data[0].lat, response.result.data[0].lng);
          // console.log("DISTANCIA : ");
          // console.log(distancia_min);

          var objDistancia = {
              lat1:lat,
              lng1:lng,
              lat2:parseFloat(response.result.data[id_min].lat),
              lng2:parseFloat(response.result.data[id_min].lng),
              distancia:distancia_min,
          }
          
          return [response.result.data[id_min].fileurlLTh,response.result.data[id_min].fileurlProc, objDistancia]
          
          // ["https://storage13.openstreetcam.org/files/photo/" + response.result.data[0].filepathTh,
          //  "https://storage13.openstreetcam.org/files/photo/" + response.result.data[0].fileurlProc ];
          // https://storage13.openstreetcam.org/files/photo/2023/10/2/th/7849961_6df4362f2b4205a96fff49a9d21d61e2.jpg  ->filepathTh
          // https://storage13.openstreetcam.org/files/photo/2023/10/2/proc/7849961_6df4362f2b4205a96fff49a9d21d61e2.jpg  ->fileurlProc
          // 2023/10/2/th/7849961_6df4362f2b4205a96fff49a9d21d61e2.jpg
          
      } else {
          if (response.status.httpCode == 200 && response.status.apiCode == 601) {
              // apiCode = 601
              // apiMessage = "The request has an empty response"
              console.log("601 => The request has an empty response");
          } else {
              console.log(" -- ERROR DESCONOCIDO -- ");
              console.log(response);
          }
          return false;
      }
      //return response.result.data[0].filepathTh;
      //return response.data;
  }

  calcularDistanciaEntreDosCoordenadas = (lat1:any, lon1:any, lat2:any, lon2:any) => {
    // Convertir todas las coordenadas a radianes
    lat1 = this.gradosARadianes(lat1);
    lon1 = this.gradosARadianes(lon1);
    lat2 = this.gradosARadianes(lat2);
    lon2 = this.gradosARadianes(lon2);
    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaEntreLongitudes = (lon2 - lon1);
    let diferenciaEntreLatitudes = (lat2 - lat1);
    let a = Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RADIO_TIERRA_EN_KILOMETROS * c;
  };

  gradosARadianes = (grados:any) => {
      return grados * Math.PI / 180;
  };


}


