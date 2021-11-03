import { Component, OnInit ,OnDestroy} from '@angular/core';

import { ItemHistorial } from 'src/app/historial/models/vehicle';

import * as moment from 'moment';
import * as L from 'leaflet';
import 'leaflet-polylinedecorator';


import { MapServicesService } from '../../../map/services/map-services.service';

import { HistorialService } from '../../services/historial.service';



import { ColDef } from 'ag-grid-community';

declare var $: any;



@Component({
  selector: 'app-panel-historial',
  templateUrl: './panel-historial.component.html',
  styleUrls: ['./panel-historial.component.scss']
})
export class PanelHistorialComponent implements OnInit, OnDestroy {


  isNaN: Function = Number.isNaN;

  // selectedCar: string='';
  // filtrarPor: string='1';
  //selectedRango: string='1';
  // fechaInicio:string='2020-01-02';
  // horaInicio:string='00';
  // minutoInicio:string='00';
  // fechaFinal:string='2020-01-01';
  // horaFin:string='00';
  // minutoFin:string='00';

  //duracionParada:string='60';
  // colorHistorial:string='#FF0000';

  // chckParada:boolean=true;
  // chckTrama:boolean=false;
  // chckGrafico:boolean=false;
  // chckEvento:boolean=false;

  conHistorial = false;
  nombreUnidad = '';

  form : any = {};

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



  columnDefs: ColDef[] = [
        { field: 'make' },
        { field: 'model' },
        { field: 'price' }
    ];

    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];

  // campaignOne: FormGroup;
  // campaignTwo: FormGroup;

  cars = [
      { nombre: 'ABC-676',imei:'111111111' },
      { nombre: 'DER-435',imei:'2222222222' },
      { nombre: 'DRW-345',imei:'3333333333' },
      { nombre: 'DRF-345',imei:'444444444' },
  ];


  transfers = new Array();

  // message:string='';


  constructor(public mapService: MapServicesService, public historialService: HistorialService ) {

    // this.historialService.currentMessage.subscribe(message => this.message = message);
    // this.historialService.currentMessage.subscribe( () => {console.log('com 1 -> gaaaaaaaaa');
    // });

  }


  // constructor() {
  //     // // const today = new Date();
  //     // // const month = today.getMonth();
  //     // // const year = today.getFullYear();

  //     // this.campaignOne = new FormGroup({
  //     // //   // start: new FormControl(new Date(year, month, 13)),
  //     // //   // end: new FormControl(new Date(year, month, 16))
  //     // });

  //     // this.campaignTwo = new FormGroup({
  //     // //   // start: new FormControl(new Date(year, month, 15)),
  //     // //   // end: new FormControl(new Date(year, month, 19))
  //     // });
  // }

  ngOnInit(): void {
    // $( "#datepicker" ).datepicker();
    // $('#datepicker').datetimepicker({
    //   language: 'pt-es'
    // });

    // this.historialService.currentMessage.subscribe(message => this.message = message)

    if(this.historialService.inicio){
      this.historialService.initialize();
      this.historialService.inicio = false;
    }



    console.log("se inicia xXX");
    console.log(this.historialService);
    console.log(this.historialService.conHistorial);


    $( "#fechaInicial" ).datepicker({
      dateFormat: 'yy-mm-dd',
    });
    $( "#fechaFinal" ).datepicker({
      // appendText:'dd-mm-yy',
      dateFormat: 'yy-mm-dd'
    });

    // this.fechaInicio = moment().startOf('day').format("YYYY-MM-DD");
    // this.fechaFinal = moment().startOf('day').add(1, 'days').format("YYYY-MM-DD");



    // const iconMarker = L.icon({
    //   iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png', //'./marker-icon.png',
    //   iconSize: [30, 50],
    //   iconAnchor: [15, 50]
    // });

    // const tempMarker = L.marker([0, 0], {icon: iconMarker}).addTo(this.mapService.map);
    // console.log(this.mapService.nombreMap);
    // console.log("XXXXXXX--------");

    // console.log(this.historialService.tramasHistorial);

    // setTimeout(() => {
    //   const tempMarker = L.marker([0, 0], {icon: iconMarker}).addTo(this.mapService.map);
    //   console.log(this.mapService.nombreMap);

    // }, 5000)
    let dH =  this.historialService.tramasHistorial; // Data Historial

    this.conHistorial = this.historialService.conHistorial;
    this.form = this.historialService.dataFormulario;

    this.nombreUnidad = (this.cars.filter((item:any)=> item.imei == this.form.selectedCar))[0].nombre;

    if (this.conHistorial) {
      this.mostrar_tabla(dH, dH[0].index_historial);

    }




  }

  ngOnDestroy(){
    console.log('me destruire gaaa');

    this.historialService.conHistorial = this.conHistorial;

    this.historialService.dataFormulario = this.form;



  }


  // function changeColorHistorial() {
  //   console.log("********  ACTUALIZANDO VALORES  *******");

  //   //Actualizar parametros iniciales
  //   historialDataFactory.editForm(vm.form);

  //   //Si esta mostrando una ruta, q la cambie de color
  //   if (vm.lineaHis) {
  //       // console.log("********  CON HISTORIAL  *******");
  //       // console.log(vm.lineaHis);
  //       vm.lineaHis.setStyle({opacity: 1, color: vm.form.colorHistorial});
  //   }


  //   console.log("changeColorHistorial --- cambio color : "+ vm.form.colorHistorial);

  //   var data = {color:vm.form.colorHistorial};

  //   //**************************************************************************
  //   historialServices['editColorHistorial'](data).then(response => {
  //     console.log('funcion editar color historial en la base de datos');
  //   }).catch(err => {
  //     console.log('ERROR',err);
  //   });

  // }

  changeColorHistorial() {

    if (this.conHistorial) {
      let newColor = this.form.colorHistorial;
      let dH =  this.historialService.tramasHistorial; // Data Historial
      dH[0].rutaH2.setStyle({opacity: 1, color: newColor });
    }

  }


  changeRangoFechas() {

      switch (this.form.selectedRango)
      {
          case ('0'):
                this.form.fecha_desde = moment().startOf('day').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().startOf('day').format("YYYY-MM-DD");
              break;
          case ('1')://hoy
                this.form.fecha_desde = moment().startOf('day').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().add(1, 'days').startOf('day').format("YYYY-MM-DD");
              break;
          case ('2'):
                this.form.fecha_desde = moment().add(-1, 'days').startOf('day').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().startOf('day').format("YYYY-MM-DD");
              break;
          case ('3'):
                this.form.fecha_desde = moment().add(-2, 'days').startOf('day').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().add(-1, 'days').startOf('day').format("YYYY-MM-DD");
              break;
          case ('4'):
                this.form.fecha_desde = moment().add(-3, 'days').startOf('day').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().add(-2, 'days').startOf('day').format("YYYY-MM-DD");
              break;
          case ('5'):
                this.form.fecha_desde = moment().startOf('isoWeek').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().startOf('isoWeek').add(7, 'days').format("YYYY-MM-DD");
              break;
          case ('6'):
                this.form.fecha_desde = moment().startOf('isoWeek').add(-7, 'days').format("YYYY-MM-DD");;
                this.form.fecha_hasta = moment().startOf('isoWeek').format("YYYY-MM-DD");
              break;
          case ('7'):
                this.form.fecha_desde = moment().startOf('month').format("YYYY-MM-DD");
                this.form.fecha_hasta = moment().startOf('month').add(1, 'month').format("YYYY-MM-DD");
              break;
          case ('8'):
                this.form.fecha_desde = moment().startOf('month').add(-1, 'month').format("YYYY-MM-DD");;
                this.form.fecha_hasta = moment().startOf('month').format("YYYY-MM-DD");;;
              break;
      }

      this.form.hora_desde  = '00';//{id: '00', name: '00'};
      this.form.min_desde   = '00';//{id: '00', name: '00'};
      this.form.hora_hasta  = '00';//{id: '00', name: '00'};
      this.form.min_hasta   = '00';//{id: '00', name: '00'};

  };



  clickCargarHistorial() {

    this.clickEliminarHistorial();

    this.historialService.getHistorial();
    var dH =  this.historialService.tramasHistorial; // Data Historial



    var h1 = new Array();

    var index_historial2 = new Array();
    var poly = [];

    const duracion = parseInt(this.form.duracionParada);



    this.historialService.nombreUnidad = this.nombreUnidad = (this.cars.filter((item:any)=> item.imei == this.form.selectedCar))[0].nombre;



    if (dH.length > 1) {

      this.conHistorial = true;  // tenemos historial con datod


      var d = 0;

      var k = [];
      let l = new Array();

      k.length = 0;
      l.length = 0;

      var o;

      const h = dH.length - 1; //Ultimo indice del array

      var minLat = parseFloat(dH[0].lat);
      var maxLat = parseFloat(dH[0].lat);
      var minLng = parseFloat(dH[0].lng);
      var maxLng = parseFloat(dH[0].lng);

      dH[0].rutaH = [];

      dH[0].primero = h; // guardar el numero de elementos en la primera trama.
      dH[h].ultimo  = h; // guardar el numero de elementos en la ultima trama.

      for (let i = 0; i < dH.length; i++) {

          dH[i].dt_ss = new Date(dH[i].dt_server);
          dH[i].dt_js = new Date(dH[i].dt_tracker);

          dH[i].dt_tracker = dH[i].dt_tracker.replace(/\//g, "-");
          dH[i].lat = parseFloat(dH[i].lat);
          dH[i].lng = parseFloat(dH[i].lng);

          dH[i].paramsGet = this.getParams(dH[i].params);

          dH[i]._trama = this.get_trama_marker(dH[i]);//.addTo(this.mapService.map);

          var arrayP = [];

          dH[0].rutaH.push([dH[i].lat, dH[i].lng]); // guardar puntos para dibujar la linea del recorrido

          if (dH[i].lat < minLat) {  minLat = dH[i].lat; }
          if (dH[i].lat > maxLat) {  maxLat = dH[i].lat; }
          if (dH[i].lng < minLng) {  minLng = dH[i].lng; }
          if (dH[i].lng > maxLng) {  maxLng = dH[i].lng; }

          dH[i].historial2 = 0;
          dH[i].indice = i;


          if (dH[i].speed <= 3) {
              if (i == h) {
                  if (l.length == 0) {
                      //estado = 0;
                      var p = dH[0].dt_js;
                      var q = dH[h].dt_js;
                      var r = this.string_diffechas(p, q);
                      dH[0].historial2 = 1;
                      dH[0].estado = 0;
                      dH[0].temp = r;

                      dH[0].marker = "PARADA";

                      index_historial2[d] = 0;
                      d++
                  } else if (l.length > 0 && k.length > 0) {
                      var p = dH[k[0]].dt_js;
                      var q = dH[i].dt_js;
                      var s = Math.floor((q - p) / 1000);
                      if (s > duracion) {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[k[0]].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++;
                          //estado = 0;
                          var p = dH[k[0]].dt_js;
                          var q = dH[i].dt_js;
                          var t = this.string_diffechas(p, q);
                          dH[k[0]].historial2 = 1;
                          dH[k[0]].estado = 0;
                          dH[k[0]].temp = t;

                          // dH[k[0]].marker = new google.maps.Marker({
                          //     map: mapa,
                          //     visible: false,
                          //     position: {
                          //         lat: dH[k[0]].lat,
                          //         lng: dH[k[0]].lng
                          //     },
                          //     icon: "images/stop.png"
                          // });

                          // var icon_0 = L.icon({ iconUrl: "images/stop.png" });
                          // dH[k[0]].marker = L.marker([dH[k[0]].lat, dH[k[0]].lng], {icon: icon_0, opacity: 0 }).addTo(mymap);

                          dH[k[0]].marker = "PARADA";//marker_x("images/stop.png", [dH[k[0]].lat, dH[k[0]].lng], [7, 26], k[0]);
                          //var label = "<div id='ih"+ k[0] +"' class='infoboxICON'> <span></span> </div>";
                          //dH[k[0]].marker.addTo(mymap);
                          //$("div#ih"+k[0]).parents('div.leaflet-label').css("opacity", 0);



                          index_historial2[d] = k[0];
                          d++;
                          l.length = 0;
                          k.length = 0
                      } else {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[i].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++
                      }
                  } else if (l.length > 0 && k.length == 0) {
                      if (l.length >= 1) {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[i].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++
                      }
                  }
              }
              k.push(i)
          } else {
              if (k.length > 0) {
                  var p = dH[k[0]].dt_js;
                  var q = dH[i].dt_js;
                  var t = this.string_diffechas(p, q);
                  var s = Math.floor((q - p) / 1000);
                  if (s > duracion) {
                      if (o == 1) {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[k[0]].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++;
                          //estado = 0;
                          dH[k[0]].historial2 = 1;
                          dH[k[0]].estado = 0;
                          dH[k[0]].temp = t;
                          // dH[k[0]].marker = new google.maps.Marker({
                          //     map: mapa,
                          //     visible: false,
                          //     position: {
                          //         lat: dH[k[0]].lat,
                          //         lng: dH[k[0]].lng
                          //     },
                          //     icon: "images/stop.png"
                          // });

                          // var icon_0 = L.icon({ iconUrl: "images/stop.png" });
                          // dH[k[0]].marker = L.marker([dH[k[0]].lat, dH[k[0]].lng], {icon: icon_0, opacity: 0 }).addTo(mymap);

                          dH[k[0]].marker = "PARADA";//marker_x("images/stop.png", [dH[k[0]].lat, dH[k[0]].lng], [7, 26], k[0]);
                          //var label = "<div id='ih"+ k[0] +"' class='infoboxICON'> <span></span> </div>";
                          //dH[k[0]].marker.addTo(mymap);
                          //$("div#ih"+k[0]).parents('div.leaflet-label').css("opacity", 0);

                          index_historial2[d] = k[0];
                          d++;
                          l.length = 0;
                          k.length = 0
                      }
                      if (l.length > 0 && dH[l[0]].dt_tracker == dH[0].dt_tracker) {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[k[0]].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++;
                          //estado = 0;
                          dH[k[0]].historial2 = 1;
                          dH[k[0]].estado = 0;
                          dH[k[0]].temp = t;
                          // dH[k[0]].marker = new google.maps.Marker({
                          //     map: mapa,
                          //     visible: false,
                          //     position: {
                          //         lat: dH[k[0]].lat,
                          //         lng: dH[k[0]].lng
                          //     },
                          //     icon: "images/stop.png"
                          // });

                          // //var icon_0 = L.icon({ iconUrl: "images/stop.png" });
                          // dH[k[0]].marker = L.marker([dH[k[0]].lat, dH[k[0]].lng], {icon: L.icon({ iconUrl: "images/stop.png" }), opacity: 0 }).addTo(mymap);

                          dH[k[0]].marker = "PARADA";//marker_x("images/stop.png", [dH[k[0]].lat, dH[k[0]].lng],  [7, 26], k[0]);
                          //var label = "<div id='ih"+ k[0] +"' class='infoboxICON'> <span></span> </div>";
                          //dH[k[0]].marker.addTo(mymap);
                          //$("div#ih"+k[0]).parents('div.leaflet-label').css("opacity", 0);

                          index_historial2[d] = k[0];
                          d++;
                          l.length = 0;
                          k.length = 0;
                          o = 1;
                      }
                      if (k.length > 0 && dH[k[0]].dt_tracker == dH[0].dt_tracker) {
                          //estado = 0;
                          dH[k[0]].historial2 = 1;
                          dH[k[0]].estado = 0;
                          dH[k[0]].temp = t;
                          // dH[k[0]].marker = new google.maps.Marker({
                          //     map: mapa,
                          //     visible: false,
                          //     position: {
                          //         lat: dH[k[0]].lat,
                          //         lng: dH[k[0]].lng
                          //     },
                          //     icon: "images/stop.png"
                          // });

                          // //var icon_0 = L.icon({ iconUrl: "images/stop.png" });
                          // dH[k[0]].marker = L.marker([dH[k[0]].lat, dH[k[0]].lng], {icon: L.icon({ iconUrl: "images/stop.png" }), opacity: 0 }).addTo(mymap);

                          dH[k[0]].marker = "PARADA";//marker_x("images/stop.png" , [dH[k[0]].lat, dH[k[0]].lng],  [7, 26], k[0]);
                          //var label = "<div id='ih"+ k[0] +"' class='infoboxICON'> <span></span> </div>";
                          //dH[k[0]].marker.addTo(mymap);
                          //$("div#ih"+k[0]).parents('div.leaflet-label').css("opacity", 0);

                          index_historial2[d] = k[0];
                          d++;
                          k.length = 0;
                          o = 1
                      }
                  } else {
                      var u = l.concat(k);
                      k.length = 0;
                      l.length = 0;
                      l = u;
                      if (i == h) {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[i].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++
                      }
                  }
              } else {
                  if (i == h) {
                      if (l.length == 0) {
                          //estado = 1;
                          var p = dH[0].dt_js;
                          var q = dH[h].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[0].historial2 = 1;
                          dH[0].estado = 1;
                          dH[0].temp = r;
                          index_historial2[d] = 0;
                          d++
                      } else if (l.length > 0) {
                          //estado = 1;
                          var p = dH[l[0]].dt_js;
                          var q = dH[i].dt_js;
                          var r = this.string_diffechas(p, q);
                          dH[l[0]].historial2 = 1;
                          dH[l[0]].estado = 1;
                          dH[l[0]].temp = r;
                          index_historial2[d] = l[0];
                          d++
                      }
                  }
              }
              l.push(i)
          }

      } //el for termina aqui


          var count = 1;
          index_historial2.forEach((item, i) => {
            // console.log("--------xD");
            // console.log(item);
            // console.log(dH[item]);
            // console.log(i);
            //Es parada y tiene el check de mostrar paradas
            if ( dH[item].marker == "PARADA") {

                if (i != index_historial2.length-1) {
                  dH[item].paradaFin = dH[index_historial2[i+1]].dt_tracker;
                } else {
                  //console.log("--------xD-- ULTIMO");
                  dH[item].paradaFin = dH[dH.length-1].dt_tracker;
                }
                //var icon = { iconUrl: 'images/stop.png', iconAnchor: [7, 26] };
                dH[item].count = count++;
                dH[item].nombre = this.nombreUnidad;//"Nombre Unidad";//param.nombreUnidad;
                dH[item].layer = this.get_parada_marker(dH[item]);



                if (this.form.chckParada) {

                  dH[item].layer.addTo(this.mapService.map);
                }

            } else {
                dH[item].marker = "MOVIMIENTO";

                let a1,a2;//Primer y ultimo punto de una sublinea
                if ( i == 0 ) {

                  a1 = 0;
                  if (index_historial2.length == 1) {
                    a2 = dH.length-1;
                  } else {
                    a2 = index_historial2[i+1];
                  }

                } else if( i == index_historial2.length-1 ) {
                  a1 = index_historial2[i-1];
                  a2 = dH.length-1;
                } else {
                  a1 = index_historial2[i-1];
                  a2 = index_historial2[i+1];
                }

                dH[item].cc = [a1, a2];
                // for (let i = a1; i <= a2; i++) {
                //   dH[item].cc.push([dH[i].lat, dH[i].lng]);
                // }

            }
          });
          // console.log('------>>>>> '+index_historial2);

          // console.log(index_historial2);


          dH[0].index_historial = index_historial2;
          dH[0].layer0 = this.get_inicial_marker(dH[0]).addTo(this.mapService.map);
          dH[h].layerN = this.get_final_marker(dH[h]).addTo(this.mapService.map);

          this.mostrar_tabla(dH, dH[0].index_historial);
          this.changeShowingTramas();
          this.changeShowingGrafico();


          this.mapService.map.fitBounds([[minLat, minLng],[maxLat, maxLng]]);


          var color = 'red';
          var color_sub = 'blue';
          dH[0].rutaH2 = this.get_historial_line( dH[0].rutaH , color).addTo(this.mapService.map); //Linea del historial
          dH[0].ruta_sub = this.get_historial_line( [] , color_sub); //Sub linea del historial


          dH[0].rutaH2_trace = L.polylineDecorator( dH[0].rutaH , {
            patterns: [
                //{ offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: 'black', weight: 2}})},
                { offset: 2, repeat: 30, symbol: L.Symbol.arrowHead({pixelSize: 4.3,polygon: false,pathOptions: {stroke: true,weight: 1.4,color: 'black',opacity: 1}})}
            ]
          }).addTo(this.mapService.map);


          this.historialService.changeMessage("desde com panel-historial")


          // var allmap = new map.Movimiento(h1,{color: param.colorHistorial }).addTo(overlay);
          // allmap._trace.addTo(overlay);


          // var misOpciones2 = {
          //     //color: '#E7AB1E',
          //     color: 'red',
          //     weight: 3,
          //     opacity: 1.0
          // }

       // poly_h2 = L.polyline([], misOpciones2).addTo(mymap);





          // // h1.push([dH[0].lat, dH[0].lng]);
          // // h1.push([dH[dH.length-1].lat, dH[dH.length-1].lng]);
          // // console.log("---- FF ------- 1");
          // // console.log(overlay);
          // // console.log("---- FF ------- 2");
          // // console.log("------");
          // // console.log(overlay);
          // // console.log("------");
          // // mapData.map.fitBounds(overlay.getBounds());
          // //mapData.map.fitBounds(bounds);


          // mapData.map.fitBounds([[minLat, minLng],[maxLat, maxLng]]);
          // var allmap = new map.Movimiento(h1,{color: param.colorHistorial }).addTo(overlay);
          // allmap._trace.addTo(overlay);

          // var submap = new map.Movimiento([],{color: param.colorSubHistorial});//.addTo(overlay);
          // var poly = [allmap, submap];
          // // console.log("XXXXXXXXXXXXXXXXXXXXXX-------------------------------------");
          // // //console.log(lili);
          // // console.log("XXXXXXXXXXXXXXXXXXXXXX-------------------------------------");
          // //------------------------ MOVIMEINTO DEL GRAFICO ------------------------------
          // var iconc = { iconUrl: 'images/mm_20_red.png', iconAnchor: [6, 20] };
          // var icoG1 = new map.Parada([0, 0], { icon: new L.Icon(iconc), showTrace: true })
          //                   .bindPopup( {offset: new L.Point(0, -16)} );

          // var icons = { iconUrl: 'images/objects/nuevo/'+param.icono, iconSize: [32, 32], iconAnchor: [16, 16] };
          // var icoG2 = new map.Parada([0, 0], { icon: new L.Icon(icons), showTrace: true })
          //                   .bindPopup( {offset: new L.Point(-18, -10)} );



          //   // console.log(this.getParams(this.historialService.tramasHistorial[0].params));



      console.log(dH[0].paramsGet);


      //this.panelService.nombreComponente = nomComponent;

      const item1 = (dH[0].paramsGet.filter((item:any)=> item.id == "GPRS Status"))[0].name;
      const item2 = (dH[0].paramsGet.filter((item:any)=> item.id == "GPRdfdfdfd"))[0];

      console.log("===================================");

      console.log(item1);
      console.log(item2);


      // this.panelService.nombreCabecera =   item[0].name;




    } else {
      console.log("NO HAY SUFICIENTE INFORMACIÓN "+dH.length);
    }


  }


  clickEliminarHistorial() {

    if (this.conHistorial) {
      var dH =  this.historialService.tramasHistorial; // Data Historial

      this.mapService.map.removeLayer(dH[0].layer0);
      this.mapService.map.removeLayer(dH[dH.length-1].layerN);

      this.mapService.map.removeLayer(dH[0].rutaH2);
      this.mapService.map.removeLayer(dH[0].rutaH2_trace);

      this.mapService.map.removeLayer(dH[0].ruta_sub);

      for (let i = 0; i < dH.length; i++) {
        if (dH[i].layer != null) {
          this.mapService.map.removeLayer(dH[i].layer);
        }
        this.mapService.map.removeLayer(dH[i]._trama);
      }



      this.historialService.tramasHistorial = [];
      this.conHistorial = false;
      this.transfers = [];

      $("#graficohistorial").css("display", "none");

    }



  }


  changeShowingParadasHistorial() {

    if (this.conHistorial) {
      var dH =  this.historialService.tramasHistorial; // Data Historial
      var iH  = dH[0].index_historial; //indices de paradas y movimientos

      if (this.form.chckParada) {
        for (let i = 0; i < dH.length; i++) {
          if (dH[i].layer != null) {
            dH[i].layer.addTo(this.mapService.map);
          }
        }
      } else {
        for (let i = 0; i < dH.length; i++) {
          if (dH[i].layer != null) {
            this.mapService.map.removeLayer(dH[i].layer);
          }
        }
      }

      this.mostrar_tabla(dH,iH);
    }

  }


  mostrar_tabla(dH:any, iH:any) {
      if (this.conHistorial) {
            // para la tabla
            this.transfers = [];
            this.transfers.push({icono:"assets/images/start.png", trama:dH[0],icono_width:"13px",icono_height:"13px"});
            for (let i = 0; i < iH.length; i++) {
              if (dH[iH[i]].marker == "PARADA") {
                if (this.form.chckParada ) {
                  this.transfers.push({icono:"assets/images/stop.png",trama:dH[iH[i]],icono_width:"11px",icono_height:"13px"});
                }
              }
              else {
                this.transfers.push({icono:"assets/images/drive.png",trama:dH[iH[i]],icono_width:"13px",icono_height:"13px"});
              }
            }
            this.transfers.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});
      }
  }

  clickLocate(row:any) {

    var dH =  this.historialService.tramasHistorial; // Data Historial

    let trama = row.trama;
      console.log("click en el tr");
      console.log(trama);

    if (row.icono == "assets/images/start.png") {
      console.log("--primero ----");
      trama.layer0.fireEvent('click');
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if(row.icono == "assets/images/end.png") {
      console.log("--ultimo ----");
      trama.layerN.fireEvent('click');
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if(row.icono == "assets/images/stop.png") {
      console.log("-----parada ----");
      trama.layer.fireEvent('click');
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if (row.icono == "assets/images/drive.png") {
      console.log("-----movimiento ----");

      let t1 = trama.cc[0];
      let t2 = trama.cc[1];
      let cc = [];

      let minLat = (dH[t1].lat);
      let maxLat = (dH[t1].lat);
      let minLng = (dH[t1].lng);
      let maxLng = (dH[t1].lng);

      for (let i = t1; i <= t2; i++) {

        cc.push([dH[i].lat, dH[i].lng]);

        if (dH[i].lat < minLat) {  minLat = dH[i].lat; }
        if (dH[i].lat > maxLat) {  maxLat = dH[i].lat; }
        if (dH[i].lng < minLng) {  minLng = dH[i].lng; }
        if (dH[i].lng > maxLng) {  maxLng = dH[i].lng; }

      }

      //this.mapService.map.fitBounds(cc, { padding: [30, 30] });
      this.mapService.map.fitBounds([[minLat, minLng],[maxLat, maxLng]], { padding: [30, 30] });

      dH[0].ruta_sub.setLatLngs(cc).addTo(this.mapService.map);
      dH[0].ruta_sub.setStyle({opacity: 1, color: 'blue'});

    }

  }







  changeShowingTramas(){

    if (this.conHistorial) {

      var dH =  this.historialService.tramasHistorial; // Data Historial

      if (this.form.chckTrama) {
        for (let i = 0; i < dH.length; i++) {
          dH[i]._trama.addTo(this.mapService.map);
        }
      } else {

        for (let i = 0; i < dH.length; i++) {
          this.mapService.map.removeLayer(dH[i]._trama);

        }
      }
    }

  }

  changeShowingGrafico(){
      if (this.conHistorial) {

          if (this.form.chckGrafico) {
              $("#graficohistorial").css( "display", "block" );
          } else {
              $("#graficohistorial").css( "display", "none" );
          }

      }
  }



  // Busacdor de vehiculos en el historial
  customSearch(term: string, item: ItemHistorial) {
    term = term.toLocaleLowerCase();
    return item['nombre'].toLowerCase().indexOf(term) > -1 || item['imei'].toString().indexOf(term) > -1;
  }

  //creacion del icono
  marker_x(feature:string, latlng:L.LatLngTuple, anchor:L.PointTuple) {
      // console.log(latlng);

      var marker = L.marker(latlng, { icon: L.icon({
                iconUrl: feature,
                //iconSize:     [50, 45],
                iconAnchor:   anchor, //[16, 32],
                popupAnchor:  [0, 0]
            }),
            //clickable: true
      }).bindPopup('<xXXXxxxXXXxXXxx ');
      return marker;
  }






  //retorna una Objeto con los valores en un array

  // options = new Array(
  //   { id:'GEOPOINTS' , name:"Geopunto"},
  //   { id:'HISTORIAL' , name:"Historial"},
  //   { id:'VEHICLES' , name:"Vehículos"},
  // );
  getParams(params:string) {

    var arrayParam = params.split("|"); // explode('|', params);
    var paramsObj = new Array();

    //var arrayParam = a[i].params.split("|");
    for ( var j = 0; j < arrayParam.length; j++ )
    {
        //======= ==============
        if ( arrayParam[j].indexOf("=") > -1 )
        {
            var temp = arrayParam[j].split("=");
            const v1 = temp[0].trim();
            const v2 = temp[1].trim();
            //console.log(v1,v2);
            if ( isNaN( parseFloat( v2 ) ) ) {
                paramsObj.push({id:v1,value:v2})
            } else {
                paramsObj.push({id:v1,value:parseFloat(v2)})
            }
        };
        //=======  ==============
        if ( arrayParam[j].indexOf(":") > -1 )
        {
            var temp = arrayParam[j].split(":");
            const v1 = temp[0].trim();
            const v2 = temp[1].trim();
            //console.log(v1,v2);
            if ( isNaN( parseFloat( v2 ) ) ) {
                paramsObj.push({id:v1,value:v2})
            } else {
                paramsObj.push({id:v1,value:parseFloat(v2)})
            }
        };
        //console.log(paramsObj);

    };

    // console.log("**** parametros ****");
    // console.log(paramsObj);
    return paramsObj;

  }


  get_historial_line(path:any,color:string) {
        var opciones = {
            color: color,
            weight: 3,
            opacity: 1.0
        }
        var linea = L.polyline(path, opciones);
        return linea;
  }

  get_trama_marker(trama:any){

      //============= LEGENDA

      // color: #FFF; -> BLANCO   sin señal
      // color: #000; -> NEGRO    con señal
      // color: #FF0; -> AMARILLO sin GPRS Status y diferencia entre fecha tracker y fecha de servidor  >= 180s  (3min)
      // color: #00E; -> AZUL     sin GPRS Status y diferencia entre fecha tracker y fecha de servidor  < 180s  (3min)
      // color: #0EE; -> TURQUESA ERROR

      let gprsStatus = (trama.paramsGet.filter((item:any)=> item.id == "GPRS Status"))[0];
      let color = '#0EE';
      if (gprsStatus == null) {
            let m_server = moment( new Date(trama.dt_server) );    //new Date(trama.dt_server);
            let m_tracker = moment( new Date(trama.dt_tracker) );  //new Date(trama.dt_tracker)
            let timeo = m_server.diff( m_tracker, 'seconds');
            //console.log(timeo)
            if( timeo >= 180 ) { color = "#FF0"; } else {   color = "#00E";}
            //conParam = false;

      } else if (gprsStatus.value == 0) {
        color = "#FFF";
      } else if (gprsStatus.value == 1) {
        color = "#000";
      }

          var xlat = parseFloat(trama.lat).toFixed(6);
          var xlng = parseFloat(trama.lng).toFixed(6);
          var xdt_tracker= trama.dt_tracker.replace(/\//g, "-");

            var contenido = '<table class="dl-horizontal">'+
              '<tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q='+trama.lat+','+trama.lng+'&amp;t=m" target="_blank">'+xlat+'°,'+xlng+'°</a></td></tr>'+
              '<tr><td>Altitud</td><td>:'+ trama.altitude +' m</td></tr>'+
              '<tr><td>Angulo</td><td>:'+ trama.angle+'&#160;&#176;</td></tr>'+
              '<tr><td>Velocidad</td><td>:'+ trama.speed+' km/h</td></tr>'+
              '<tr><td>Tiempo</td><td>:'+ xdt_tracker+' </td></tr>'+
            '</table>'

      // var marker = L.marker([trama.lat, trama.lng],
      //       { icon: L.icon({
      //           iconUrl: feature,
      //           //iconSize:     [50, 45],
      //           iconAnchor:   [4.5, 4.5], //[16, 32],
      //           popupAnchor:  [0, 0]
      //       }),
      //       //clickable: true
      // }).bindPopup(contenido,{offset: new L.Point(0, -13)});

      var marker = L.circleMarker([trama.lat, trama.lng], {
        // pane: 'markers1',
        "radius": 4,
        "fillColor": color,
        "fillOpacity": 1,
        "color": "#000",//color,
        "weight": 1,
        "opacity": 1
      }).bindPopup(contenido,{offset: new L.Point(0, -13)});


      return marker;
  }


  get_parada_marker(trama:any) {

    // new map.Parada([dH[item].lat, dH[item].lng], { icon: new L.Icon(icon), showTrace: true })
    // .bindPopup(historialHelper.getContentPopup(dH[item]), {offset: new L.Point(0, -13)} );

      var xlat = parseFloat(trama.lat).toFixed(6);
      var xlng = parseFloat(trama.lng).toFixed(6);
      var xdt_tracker= trama.dt_tracker.replace(/\//g, "-");
      var xparadaFin = trama.paradaFin.replace(/\//g, "-");


      // return (
        var contenido = '<table class="dl-horizontal">'+
          '<tr><td width="57px">Parada</td><td width="140px">:'+ trama.count+'</td></tr>'+
          '<tr><td>Objeto</td><td>:'+ trama.nombre +'</td></tr>'+
          '<tr><td>Direcci&#243n</td><td>: ...</td></tr>'+
          '<tr><td>P.Cercano</td><td>: </td></tr>'+
          '<tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q='+trama.lat+','+trama.lng+'&amp;t=m" target="_blank">'+xlat+'°,'+xlng+'°</a></td></tr>'+
          '<tr><td>Altitud</td><td>:'+ trama.altitude+'m</td></tr>'+
          '<tr><td>Angulo</td><td>:'+ trama.angle+'&#160;&#176;</td></tr>'+
          '<tr><td>Tiempo</td><td>:'+ xdt_tracker+'</td></tr>'+
          '<tr><td>Restante</td><td>:'+ xparadaFin+'</td></tr>'+
          '<tr><td>Duraci&#243n</td><td>:'+ trama.temp+'</td></tr>'+
        '</table>';
      // );


    var marker = L.marker([trama.lat, trama.lng],
          { icon: L.icon({
              iconUrl: 'assets/images/stop.png',
              iconAnchor: [7, 26]
          }),
          //clickable: true
    }).bindPopup(contenido,{offset: new L.Point(0, -13)});

    return marker;

  }

  get_inicial_marker(trama:any){
    var xlat = parseFloat(trama.lat).toFixed(6);
    var xlng = parseFloat(trama.lng).toFixed(6);
    var xdt_tracker= trama.dt_tracker.replace(/\//g, "-");

    var contenido = '<table class="dl-horizontal">'+
      '<tr><td>Objeto</td><td>:'+ trama.nombre+'</td></tr>'+
      '<tr><td>Direcci&#243n</td><td>: ...</td></tr>'+
      '<tr><td>P.Cercano</td><td>: </td></tr>'+
      '<tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q='+trama.lat+','+trama.lng+'&amp;t=m" target="_blank">'+xlat+'°,'+xlng+'°</a></td></tr>'+
      '<tr><td>Altitud</td><td>:'+ trama.altitude +'m</td></tr>'+
      '<tr><td>Angulo</td><td>:'+ trama.angle+'&#160;&#176;</td></tr>'+
      '<tr><td>Velocidad</td><td>:'+ trama.speed +'km/h</td></tr>'+
      '<tr><td>Tiempo</td><td>:'+ xdt_tracker +'</td></tr>'+
    '</table>';

      var marker = L.marker([trama.lat, trama.lng],
        { icon: L.icon({
              iconUrl: 'assets/images/route_start.png',
              iconAnchor: [16, 32]
          }),
          //clickable: true
        }).bindPopup(contenido,{offset: new L.Point(0, -13)});

    return marker;
  }

  get_final_marker(trama:any){

    var xlat = parseFloat(trama.lat).toFixed(6);
    var xlng = parseFloat(trama.lng).toFixed(6);
    var xdt_tracker= trama.dt_tracker.replace(/\//g, "-");

    var contenido = '<table class="dl-horizontal">'+
      '<tr><td>Objeto</td><td>:'+ trama.nombre+'</td></tr>'+
      '<tr><td>Direcci&#243n</td><td>: ...</td></tr>'+
      '<tr><td>P.Cercano</td><td>: </td></tr>'+
      '<tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q='+trama.lat+','+trama.lng+'&amp;t=m" target="_blank">'+xlat+'°,'+xlng+'°</a></td></tr>'+
      '<tr><td>Altitud</td><td>:'+ trama.altitude +'m</td></tr>'+
      '<tr><td>Angulo</td><td>:'+ trama.angle+'&#160;&#176;</td></tr>'+
      '<tr><td>Velocidad</td><td>:'+ trama.speed +'km/h</td></tr>'+
      '<tr><td>Tiempo</td><td>:'+ xdt_tracker +'</td></tr>'+
    '</table>';

      var marker = L.marker([trama.lat, trama.lng],
        { icon: L.icon({
              iconUrl: 'assets/images/route_end.png',
              iconAnchor: [16, 32]
          }),
          //clickable: true
        }).bindPopup(contenido,{offset: new L.Point(0, -13)});
    return marker;

  }



  string_diffechas(a:any, b:any) {
    var c = (Math.floor((b - a) / 1000)) % 60;
    var d = (Math.floor((b - a) / 60000)) % 60;
    var e = (Math.floor((b - a) / 3600000)) % 24;
    var f = Math.floor((b - a) / 86400000);
    var g = "";
    if (f > 0) {
        g = '' + f + ' d ' + e + ' h ' + d + ' min ' + c + ' s'
    } else if (e > 0) {
        g = '' + e + ' h ' + d + ' min ' + c + ' s'
    } else if (d > 0) {
        g = '' + d + ' min ' + c + ' s'
    } else if (c >= 0) {
        g = '' + c + ' s'
    }
    return g;
  }


}
