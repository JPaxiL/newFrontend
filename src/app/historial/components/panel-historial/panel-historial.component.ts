import { Component, OnInit } from '@angular/core';

import { ItemHistorial } from 'src/app/historial/models/vehicle';

import * as moment from 'moment';



declare var $: any;



@Component({
  selector: 'app-panel-historial',
  templateUrl: './panel-historial.component.html',
  styleUrls: ['./panel-historial.component.scss']
})
export class PanelHistorialComponent implements OnInit {

  selectedCar: string='';
  filtrarPor: string='1';
  selectedRango: string='1';
  fechaInicio:string='2020-01-02';
  horaInicio:string='00';
  minutoInicio:string='00';
  fechaFinal:string='2020-01-01';
  horaFin:string='00';
  minutoFin:string='00';

  duracionParada:string='60';
  colorHistorial:string='#FF0000';

  chckParada:boolean=true;
  chckTrama:boolean=false;
  chckGrafico:boolean=false;
  chckEvento:boolean=false;

  availableOptionsHora =[
      {id: '00', name: '00'},
      {id: '01', name: '01'},
      {id: '02', name: '02'},
      {id: '03', name: '03'},
      {id: '04', name: '04'},
      {id: '05', name: '05'},
      {id: '06', name: '06'},
      {id: '07', name: '07'},
      {id: '08', name: '08'},
      {id: '09', name: '09'},
      {id: '10', name: '10'},
      {id: '11', name: '11'},
      {id: '12', name: '12'},
      {id: '13', name: '13'},
      {id: '14', name: '14'},
      {id: '15', name: '15'},
      {id: '16', name: '16'},
      {id: '17', name: '17'},
      {id: '18', name: '18'},
      {id: '19', name: '19'},
      {id: '20', name: '20'},
      {id: '21', name: '21'},
      {id: '22', name: '22'},
      {id: '23', name: '23'}
  ];


  availableOptionsMin =[
    {id:'00', name: '00'},
    {id:'01', name: '01'},
    {id:'02', name: '02'},
    {id:'03', name: '03'},
    {id:'04', name: '04'},
    {id:'05', name: '05'},
    {id:'06', name: '06'},
    {id:'07', name: '07'},
    {id:'08', name: '08'},
    {id:'09', name: '09'},
    {id:'10', name: '10'},
    {id:'11', name: '11'},
    {id:'12', name: '12'},
    {id:'13', name: '13'},
    {id:'14', name: '14'},
    {id:'15', name: '15'},
    {id:'16', name: '16'},
    {id:'17', name: '17'},
    {id:'18', name: '18'},
    {id:'19', name: '19'},
    {id:'20', name: '20'},
    {id:'21', name: '21'},
    {id:'22', name: '22'},
    {id:'23', name: '23'},
    {id:'24', name: '24'},
    {id:'25', name: '25'},
    {id:'26', name: '26'},
    {id:'27', name: '27'},
    {id:'28', name: '28'},
    {id:'29', name: '29'},
    {id:'30', name: '30'},
    {id:'31', name: '31'},
    {id:'32', name: '32'},
    {id:'33', name: '33'},
    {id:'34', name: '34'},
    {id:'35', name: '35'},
    {id:'36', name: '36'},
    {id:'37', name: '37'},
    {id:'38', name: '38'},
    {id:'39', name: '39'},
    {id:'40', name: '40'},
    {id:'41', name: '41'},
    {id:'42', name: '42'},
    {id:'43', name: '43'},
    {id:'44', name: '44'},
    {id:'45', name: '45'},
    {id:'46', name: '46'},
    {id:'47', name: '47'},
    {id:'48', name: '48'},
    {id:'49', name: '49'},
    {id:'50', name: '50'},
    {id:'51', name: '51'},
    {id:'52', name: '52'},
    {id:'53', name: '53'},
    {id:'54', name: '54'},
    {id:'55', name: '55'},
    {id:'56', name: '56'},
    {id:'57', name: '57'},
    {id:'58', name: '58'},
    {id:'59', name: '59'}
  ];

  availableOptionsTempoParada = [
    { id: '30'    , name: ' a 30 seg' },
    { id: '60'    , name: ' a 1 min'  },
    { id: '120'   , name: ' a 2 min'  },
    { id: '300'   , name: ' a 5 min'  },
    { id: '600'   , name: ' a 10 min' },
    { id: '1200'  , name: ' a 20 min' },
    { id: '1800'  , name: ' a 30 min' },
    { id: '3600'  , name: ' a 1 h'    },
    { id: '7200'  , name: ' a 2 h'    },
    { id: '18000' , name: ' a 5 h'    }
  ];

  availableOptionsDay = [
    // {id : '0' , name: 'select'},
    {id : '1' , name: 'Hoy'},
    {id : '2' , name: 'Ayer'},
    {id : '3' , name: 'hace 2 dias'},
    {id : '4' , name: 'hace 3 dias'},
    {id : '5' , name: 'Esta semana'},
    {id : '6' , name: 'Semana pasada'},
    {id : '7' , name: 'Este mes'},
    {id : '8' , name: 'Mes pasado'}
  ];





  // campaignOne: FormGroup;
  // campaignTwo: FormGroup;

  cars = [
      { nombre: 'ABC-676',imei:'111111111' },
      { nombre: 'DER-435',imei:'2222222222' },
      { nombre: 'DRW-345',imei:'3333333333' },
      { nombre: 'DRF-345',imei:'444444444' },
  ];

  constructor() {
      // // const today = new Date();
      // // const month = today.getMonth();
      // // const year = today.getFullYear();

      // this.campaignOne = new FormGroup({
      // //   // start: new FormControl(new Date(year, month, 13)),
      // //   // end: new FormControl(new Date(year, month, 16))
      // });

      // this.campaignTwo = new FormGroup({
      // //   // start: new FormControl(new Date(year, month, 15)),
      // //   // end: new FormControl(new Date(year, month, 19))
      // });
  }

  ngOnInit(): void {
    // $( "#datepicker" ).datepicker();
    // $('#datepicker').datetimepicker({
    //   language: 'pt-es'
    // });

    $( "#fechaInicial" ).datepicker({
      dateFormat: 'yy-mm-dd',
    });
    $( "#fechaFinal" ).datepicker({
      // appendText:'dd-mm-yy',
      dateFormat: 'yy-mm-dd'
    });

    this.fechaInicio = moment().startOf('day').format("YYYY-MM-DD");
    this.fechaFinal = moment().startOf('day').add(1, 'days').format("YYYY-MM-DD");



  }

  hidePanelHistorial(): void {

    console.log("Esconder panel");
    $("#panelHistorial").hide( "slow" );


    // if (this.visible) {
    //   $("#panel_sidebar").hide( "slow" );
    // } else {
    //   $("#panel_sidebar").show( "slow" );
    // }

    // this.buttonTitle = this.visible?"Hide":"Show";
  }




  // Busacdor de vehiculos en el historial
  customSearch(term: string, item: ItemHistorial) {
    term = term.toLocaleLowerCase();
    return item['nombre'].toLowerCase().indexOf(term) > -1 || item['imei'].toString().indexOf(term) > -1;
  }
}
