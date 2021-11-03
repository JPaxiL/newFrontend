import { Injectable } from '@angular/core';

import RefDataHistorial from '../data/refDataHistorial';
import * as moment from 'moment';

import { BehaviorSubject } from 'rxjs';


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





  constructor() {
    //this.tramasHistorial = RefDataHistorial.data;
    // console.log("XXXXXXX");
    // console.log(this.tramasHistorial);
  }

  public getHistorial (){
    this.tramasHistorial = RefDataHistorial.data;
  }


  public initialize (){


    console.log('INICIALIZAR SERVICIO DEL HISTORIAL');

    this.dataFormulario = {
      inicio : true,

      selectedCar : '2222222222',

      selectedRango : '1',//{id: '0'}, //Rango de fechas para el historial
      duracionParada : '60',//{id: '60'}, //Duracion de la parada


      fecha_desde : moment().startOf('day').format("YYYY-MM-DD"),
      fecha_hasta : moment().startOf('day').format("YYYY-MM-DD"),
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




}



