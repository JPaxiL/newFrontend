import { Component, OnInit ,OnDestroy, ComponentRef, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { DialogModule } from 'primeng-lts/dialog';
import { ItemHistorial } from 'src/app/historial/models/vehicle';

import * as moment from 'moment';
import * as L from 'leaflet';
import 'leaflet-polylinedecorator';


import { VehicleService } from '../../../vehicles/services/vehicle.service';

import { MapServicesService } from '../../../map/services/map-services.service';
import { EventService } from 'src/app/events/services/event.service';


import { HistorialService } from '../../services/historial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { SliderMultimediaComponent } from 'src/app/shared/components/slider-multimedia/slider-multimedia.component';




// import { ColDef } from 'ag-grid-community';
// import { threadId } from 'worker_threads';

declare var $: any;

// interface JQueryStatic {
//   plot: any;
// }

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
  showEventos = false;
  nombreUnidad = '';

  form : any = {};

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

  columnDefs = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  booleanOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  selectedEvents: any = [];
  chkAllEvents: boolean = false;
  chkMostrarRuta: boolean = false;
  typeEvents :any = [];
   eventList = [
    // {
    //   label: 'Evento GPS',
    //   items: [
    //     // { name: 'Batería baja', value: false },
    //     { name: 'Batería Desconectada', value: false },
    //     { name: 'Aceleración Brusca', value: false },
    //     { name: 'Frenada Brusca', value: false },
    //     // { name: 'Bloqueo de Transmisión', value: false },
    //     { name: 'SOS', value: false },
    //     // { name: 'Remolque', value: false },
    //     // { name: 'Parada', value: false },
    //     { name: 'Motor Apagado', value: false },
    //     { name: 'Motor Encendido', value: false },

    //   ]
    // },
    {
      label: 'Evento Plataforma',
      items: [
        { name: 'Zona de Entrada', value: 'zona-de-entrada' },
        { name: 'Zona de Salida', value: 'Zona de salida' },
        // { name: 'Tiempo de Estadía en Zona', value: false },
        // { name: 'Parad en Zona no Autorizada', value: false },
        // { name: 'Vehículo en Movimiento Sin Programación', value: false },
        // { name: 'Infracción', value: false },
        { name: 'Exceso de Velocidad', value: 'exceso-velocidad' },
        // { name: 'Anticolisión frontal', value: false },
        // { name: 'Colisión con Peatones', value: false },
        // { name: 'No Rostro', value: false },
        // { name: 'Fatiga Extrema', value: false },
        // { name: 'Desvío de carril hacia la izquierda', value: false },
        // { name: 'Desvío de carril hacia la derecha', value: false },
        // { name: 'Bloqueo de visión del mobileye', value: false },
      ]
    },
    // {
    //   label: 'Evento Seguridad Vehicular',
    //   items: [
    //     { name: 'Ausencia de Rostro', value: false },// { name: 'No Rostro', value: false },
    //     { name: 'Fatiga Extrema', value: false },
    //     { name: 'Posible Fatiga', value: false },
    //     { name: 'Distracción', value: false },
    //     { name: 'Detección de Alcohol', value: false },//  { name: 'Alcoholemia', value: false },
    //     { name: 'Anticolisión Frontal', value: false },
    //     { name: 'Colisión con Peatones', value: false },
    //     { name: 'Desvío de Carril Hacia la Izquierda', value: false },
    //     { name: 'Desvío de Carril Hacia la Derecha', value: false },
    //     { name: 'Bloqueo de Visión del Mobileye', value: false },
    //   ]
    // }
    {
      label: 'Eventos 360º',
        items: [
          { name: 'Conductor Adormitado 360°', value: 'conductor-adormitado-360' },
          { name: 'Conductor Somnoliento 360', value: 'conductor-somnoliento-360' },
          { name: 'Distracción Detectada 360°', value: 'conductor-distraido-360' },
          { name: 'Cinturón no Detectado 360°', value: 'cinturon-desabrochado-360' },
          { name: 'Celular Detectado 360°', value: 'uso-de-celular-360' },
          { name: 'Cigarro Detectado 360°', value: 'conductor-fumando-360' },
          { name: 'Detección de Manipulación 360°', value: 'deteccion-manipulacion-360' },
          { name: 'Error de Cámara 360°', value: 'error-de-camara-360' },
        ]
    }
    // ,
    // {
    //   label: 'Otros',
    //   items: [
    //     { name: 'Exceso de Velocidad', value: false },
    //   ]
    // }
   ];

  // campaignOne: FormGroup;
  // campaignTwo: FormGroup;

  cars : any = [];

  // vehicles = [];

  transfers = new Array();

  // message:string='';

  public expirationDate = false;

  // pngFechaIni!: Date;
  // pngHoraIni!: Date;
  // pngFechaFin!: Date;
  // pngHoraFin!: Date;

  // pngHoraIni2!: Date;
  // pngHoraFin2!: Date;

  pngColorRuta: string = '#ff0000';
  dialogDisplay: boolean = false;
  loadingHistorial: boolean = false;
  // pngHoraIni2: number = 0;
  // pngMinIni: number = 0;
  // pngHoraFin2: number = 0;
  // pngMinFin: number = 0;

  pngChkParadas: boolean = false;
  pngChkTrama: boolean = false;
  pngVelFecha: boolean = true;
  pngGrafico: boolean = false;

  isHistorialTableLoaded: boolean = false;

  constructor(
    public mapService: MapServicesService,
    public historialService: HistorialService,
    private VehicleService : VehicleService,
    private spinner: NgxSpinnerService,
    private EventService: EventService,
    private resolver: ComponentFactoryResolver, 
    private container: ViewContainerRef
    ) {



    // this.historialService.currentMessage.subscribe(message => this.message = message);
    // this.historialService.currentMessage.subscribe( () => {//console.log('com 1 -> gaaaaaaaaa');
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
    if(!this.VehicleService.statusDataVehicle){
      this.spinner.show('loadingHistorialForm');
      this.VehicleService.dataCompleted.subscribe( vehicles => {
        this.getCars(vehicles);
        this.spinner.hide('loadingHistorialForm');
      });
    } else {
      let vehicles = this.VehicleService.getVehiclesData();
      this.getCars(vehicles);
    }

    // this.historialService.initializeForm();

    // const hoy = Date.now();
    // this.pngFechaIni = new Date(moment(hoy).format('YYYY-MM-DDTHH:mm'));
    // this.pngFechaFin = this.pngFechaIni;
    // this.pngHoraIni = new Date('2018-03-12T00:00');
    // this.pngHoraIni2 = new Date('2018-03-12T00:00');
    // this.pngHoraFin2 = new Date('2018-03-12T00:00');

    // this.pngHoraFin = new Date('2018-03-14T00:00');
    this.form.selectedRango = '0';
    //this.form.duracionParada = '60';
    // $( "#datepicker" ).datepicker();
    // $('#datepicker').datetimepicker({
    //   language: 'pt-es'
    // });

    // this.historialService.currentMessage.subscribe(message => this.message = message)



  //   cars = [
  //     { nombre: 'ABC-676',imei:'111111111' },
  //     { nombre: 'DER-435',imei:'2222222222' },
  //     { nombre: 'DRW-345',imei:'3333333333' },
  //     { nombre: 'DRF-345',imei:'444444444' },
  // ];

    // //console.log(vehicles);

    if(this.historialService.inicio){
      this.historialService.initialize();
      this.historialService.inicio = false;
    }



    // //console.log("se inicia xXX");
    // //console.log(this.historialService);
    //console.log('Con historial : '+this.historialService.conHistorial);


    // $( "#fechaInicial" ).datepicker({
    //   dateFormat: 'yy-mm-dd',
    // });
    // $( "#fechaFinal" ).datepicker({
    //   // appendText:'dd-mm-yy',
    //   dateFormat: 'yy-mm-dd'
    // });

    // this.fechaInicio = moment().startOf('day').format("YYYY-MM-DD");
    // this.fechaFinal = moment().startOf('day').add(1, 'days').format("YYYY-MM-DD");



    // const iconMarker = L.icon({
    //   iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png', //'./marker-icon.png',
    //   iconSize: [30, 50],
    //   iconAnchor: [15, 50]
    // });

    // const tempMarker = L.marker([0, 0], {icon: iconMarker}).addTo(this.mapService.map);
    // //console.log(this.mapService.nombreMap);
    // //console.log("XXXXXXX--------");

    // //console.log(this.historialService.tramasHistorial);

    // setTimeout(() => {
    //   const tempMarker = L.marker([0, 0], {icon: iconMarker}).addTo(this.mapService.map);
    //   //console.log(this.mapService.nombreMap);

    // }, 5000)
    let dH =  this.historialService.tramasHistorial; // Data Historial

    this.conHistorial = this.historialService.conHistorial;
    
    
    this.form = this.historialService.dataFormulario;

    console.log("=== formulario ===");

    console.log(this.form);

    // //console.log(this.form.selectedCarC );

    if (!(this.form.selectedCarC == null)) {
      this.nombreUnidad = (this.cars.filter((item:any)=> item.imei == this.form.selectedCar))[0].nombre;
      //console.log("unidad diferente de null");
    } else {
      //console.log("unidad es igual a null");
    }

    if (this.conHistorial) {
      this.mostrar_tabla(dH, dH[0].index_historial);
    }

    // (function($) {
    //   $.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });

    //   // $['plot']($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
    // })(jQuery);

    // $.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });



    // $(function(){
    //   $.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });

    // });





    //CHANGES FOR HISTORIAL *********************
    // SE VA CAMBIAR TODO EL API DEL SERVICIO PARA JALAR DE USUARIOS DETALLES 

    // console.log('TESTING OPEN HISTORY');
    // let status_event = false;
    // let map: any=[];

    // this.EventService.getEventName().subscribe(data => {
    //   console.log(data.data.event_id); // Aquí deberías ver los valores reales devueltos por el Observable
    //   for (let event of data.data) {
    //     status_event= false;
    //     event.event_type = this.changeNameEvent(event.event_type);
        
    //     const existingTypeEvent = map.find((item: { label: any; items: any[]; }) => item.label === event.event_type);

    //     if (existingTypeEvent) {
    //       // El tipo de evento ya existe en el mapa
    //       const existingEvent = existingTypeEvent.items.find((existingItem: { name: any; value: any; }) => existingItem.value === event.event_id);

    //       if (!existingEvent) {
    //         // El id_event no existe para este tipo de evento, lo agregamos
    //         existingTypeEvent.items.push({
    //           name: event.name_event,
    //           value: event.event_id
    //         });
    //       }
    //     } else {
    //       // El tipo de evento no existe en el mapa, lo añadimos
    //       map.push({
    //         label: event.event_type,
    //         items: [
    //           {
    //             name: event.name_event,
    //             value: event.event_id,
    //           }
    //         ]
    //       });
    //     }

    //   }
    // });
    // // LIMPIAMOS EVENTOS LIST
    // this.eventList = [];
    // this.eventList = map;
    
    // console.log(this.eventList,map);
    this.EventService.pinPopupStream.subscribe(event => {
      this.clearMultimedia(event);
      this.addMultimediaComponent(event);
    })
  }

  changeNameEvent (name:string){
    if (name == 'gps'){
      return 'EVENTOS GPS';
    }else if(name == 'platform'){
      return 'EVENTOS PLATAFORMA';
    }else if (name == 'accessories'){
      return 'EVENTOS FATIGA 360º'
    }else {
      return 'EVENTOS '+name.toUpperCase();
    }
  }
  clickTest(){
    console.log('Eventos seleccionados:', this.selectedEvents);
  }

  ngOnDestroy(){
    ////console.log('me destruire gaaa');

    this.clickEliminarHistorial();

    this.historialService.conHistorial = this.conHistorial;

    console.log("=========== Destroy =============");
    
    console.log( this.form);
    
    this.historialService.dataFormulario = this.form;

    this.VehicleService.dataCompleted.unsubscribe;

    // this.historialService.icoGplay = this.icoGplay;
    // this.historialService.icoGclick = this.icoGclick;

    this.mapService.map.removeLayer(this.historialService.icoGplay);
    this.mapService.map.removeLayer(this.historialService.icoGclick);


  }

  getCars(vehicles: any){
    console.log("======================== icono == getCars");
    console.log(vehicles);
    
    
    for (let i = 0; i < vehicles.length; i++) {
      let gaa = { nombre: vehicles[i].name ,imei:vehicles[i].IMEI, icon:vehicles[i].icon , nameoperation:vehicles[i].nameoperation };
      this.cars.push(gaa);
    }
  }

  

  // function changeColorHistorial() {
  //   //console.log("********  ACTUALIZANDO VALORES  *******");

  //   //Actualizar parametros iniciales
  //   historialDataFactory.editForm(vm.form);

  //   //Si esta mostrando una ruta, q la cambie de color
  //   if (vm.lineaHis) {
  //       // //console.log("********  CON HISTORIAL  *******");
  //       // //console.log(vm.lineaHis);
  //       vm.lineaHis.setStyle({opacity: 1, color: vm.form.colorHistorial});
  //   }


  //   //console.log("changeColorHistorial --- cambio color : "+ vm.form.colorHistorial);

  //   var data = {color:vm.form.colorHistorial};

  //   //**************************************************************************
  //   historialServices['editColorHistorial'](data).then(response => {
  //     //console.log('funcion editar color historial en la base de datos');
  //   }).catch(err => {
  //     //console.log('ERROR',err);
  //   });

  // }

  changeColorHistorial() {
    if (this.conHistorial) {
      // let newColor = this.form.colorHistorial;
      // let dH =  this.historialService.tramasHistorial; // Data Historial
      // dH[0].rutaH2.setStyle({opacity: 1, color: newColor });
    }

  }

  changeShowingEventos() {
    // console.log("Ç=======changeShowingEventos");

    // console.log(this.form.chckEvento);
    // this.showEventos = this.form.chckEvento;
    // if (this.form.chckEvento) {

    //   if (this.conHistorial) {
    //     var dH =  this.historialService.tramasHistorial; // Data Historial
    //     var iH  = dH[0].index_historial; //indices de paradas y movimientos
    //     this.mostrar_tabla(dH,iH);

    //   };
    // }

    //console.log(this.form.chckEvento);

    //this.chkAllEvents = this.selectedEvents.length == [...this.eventList[0].items, ...this.eventList[1].items, ...this.eventList[2].items, ...this.eventList[3].items].length;
    // this.chkAllEvents = this.selectedEvents.length == [...this.eventList[0].items, ...this.eventList[1].items, ...this.eventList[2].items].length;
    this.chkAllEvents = this.selectedEvents.length == [...this.eventList[0].items, ...this.eventList[1].items].length;

    // console.log(this.chkAllEvents);
    // console.log(this.selectedEvents);


    // if (!this.form.chckEvento) {
    //   this.showEventos = false;
    // }

    // if (this.conHistorial) {
    //   var dH =  this.historialService.tramasHistorial; // Data Historial
    //   var iH  = dH[0].index_historial; //indices de paradas y movimientos
    //   this.mostrar_tabla(dH,iH);
    // }



    this.changeShowingParadasHistorial();
  }


  changeRangoFechas() {

      let fecha_desde:any = '';
      let fecha_hasta:any = '';
      switch (this.form.selectedRango)
      {
          case ('0'):
                fecha_desde = moment().startOf('day');//.format("YYYY-MM-DD");
                fecha_hasta = moment().startOf('day');//.format("YYYY-MM-DD");
              break;
          case ('1')://hoy
                fecha_desde = moment().startOf('day');//.format("YYYY-MM-DD");
                fecha_hasta = moment().add(1, 'days');//.startOf('day').format("YYYY-MM-DD");
              break;
          case ('2'):
                fecha_desde = moment().add(-1, 'days').startOf('day');//.format("YYYY-MM-DD");
                fecha_hasta = moment().startOf('day');//.format("YYYY-MM-DD");
              break;
          case ('3'):
                fecha_desde = moment().add(-2, 'days').startOf('day');//.format("YYYY-MM-DD");
                fecha_hasta = moment().add(-1, 'days').startOf('day');//.format("YYYY-MM-DD");
              break;
          case ('4'):
                fecha_desde = moment().add(-3, 'days').startOf('day');//.format("YYYY-MM-DD");
                fecha_hasta = moment().add(-2, 'days').startOf('day');//.format("YYYY-MM-DD");
              break;
          case ('5'):
                fecha_desde = moment().startOf('isoWeek');//.format("YYYY-MM-DD");
                fecha_hasta = moment().startOf('isoWeek').add(7, 'days');//.format("YYYY-MM-DD");
              break;
          case ('6'):
                fecha_desde = moment().startOf('isoWeek').add(-7, 'days');//.format("YYYY-MM-DD");;
                fecha_hasta = moment().startOf('isoWeek');//.format("YYYY-MM-DD");
              break;
          case ('7'):
                fecha_desde = moment().startOf('month');//.format("YYYY-MM-DD");
                fecha_hasta = moment().startOf('month').add(1, 'month');//.format("YYYY-MM-DD");
              break;
          case ('8'):
                fecha_desde = moment().startOf('month').add(-1, 'month');//.format("YYYY-MM-DD");;
                fecha_hasta = moment().startOf('month');//.format("YYYY-MM-DD");;;
              break;
      }

      /* this.form.fecha_desde = {
        year: parseInt(fecha_desde.format("YYYY")),
        month: parseInt(fecha_desde.format("MM")),
        day: parseInt(fecha_desde.format("DD")),
      };

      this.form.fecha_hasta = {
        year: parseInt(fecha_hasta.format("YYYY")),
        month: parseInt(fecha_hasta.format("MM")),
        day: parseInt(fecha_hasta.format("DD")),
      }; */

      this.form.pngFechaIni = fecha_desde.toDate();
      this.form.pngFechaFin = fecha_hasta.toDate();

      console.log(this.form.pngFechaIni);
      console.log(this.form.pngFechaFin);

      /* this.form.hora_desde  = '00';//{id: '00', name: '00'};
      this.form.min_desde   = '00';//{id: '00', name: '00'};
      this.form.hora_hasta  = '00';//{id: '00', name: '00'};
      this.form.min_hasta   = '00';//{id: '00', name: '00'}; */

      // this.pngHoraIni = new Date('2018-03-12T00:00');
      // this.pngHoraFin = new Date('2018-03-12T00:00');

      // this.form.pngHoraIni2 = 0;
      // this.form.pngMinIni = 0;
      // this.form.pngHoraFin2 = 0;
      // this.form.pngMinFin = 0;

      this.form.pngHoraIni2 = new Date('2018-03-12T00:00');
      this.form.pngHoraFin2 = new Date('2018-03-12T00:00');


  };



  // format_mes_dia   1 -> 01
  fStrMD(str:string) {
    let str2 = ('00'+str).substring(str.length);
    return str2;
  };


  onChkMostrarRuta(key:any) {
    console.log("-----------------onChkMostrarRuta");
    console.log();

    this.historialService.arrayRecorridos[key];

    console.log(this.historialService.arrayRecorridos[key]);
    console.log(this.historialService.arrayRecorridos);

    
    var dH = this.historialService.arrayRecorridos[key].recorrido;
    var iH  = dH[0].index_historial; //indices de paradas y movimientos



    // if (this.conHistorial) {
    //   this.mostrar_tabla(dH, dH[0].index_historial);
    // }


    if (this.historialService.arrayRecorridos[key].mostrarRuta) {


      for (let i = 0; i < iH.length; i++) {
        if (dH[iH[i]].marker == "PARADA") {
          if (this.form.chckParada ) {
            //this.transfers.push({icono:"assets/images/stop.png", tooltip: "Parada",trama:dH[iH[i]],icono_width:"11px",icono_height:"13px",dt_tracker:dH[iH[i]].dt_tracker});
            dH[iH[i]].layer.addTo(this.mapService.map);
          }
        }
        // else {
        //   this.transfers.push({icono:"assets/images/drive.png", tooltip: "Movimiento",trama:dH[iH[i]],icono_width:"13px",icono_height:"13px",dt_tracker:dH[iH[i]].dt_tracker});
        // }
      }


      if (this.form.chckTrama) {
        for (let i = 0; i < dH.length; i++) {
          dH[i]._trama.addTo(this.mapService.map);
        }
      } 
      // else {
      //   for (let i = 0; i < dH.length; i++) {
      //     this.mapService.map.removeLayer(dH[i]._trama);
      //   }
      // }


      if (this.form.chckTramaFechaVelocidad) {
        for (let i = 0; i < dH.length; i++) {
          dH[i]._trama_fecha_velocidad.addTo(this.mapService.map);
        }
      } 

      //eventos
      console.log("=======================================");
      // console.log(this.historialService.arrayRecorridos);
      // console.log(idx);
      // console.log(this.historialService.arrayRecorridos[idx]);

      var EventosAll = this.historialService.arrayRecorridos[key].eventos;

      for (let index = 0; index < EventosAll.length; index++) {
        EventosAll[index].layer.addTo(this.mapService.map);
      }


      dH[0].layer0.addTo(this.mapService.map);
      dH[dH.length - 1].layerN.addTo(this.mapService.map);

      
      dH[0].rutaH2.addTo(this.mapService.map);// = this.get_historial_line( dH[0].rutaH , color).addTo(this.mapService.map); //Linea del historial
      dH[0].ruta_sub.addTo(this.mapService.map); // = this.get_historial_line( [] , color_sub).addTo(this.mapService.map); //Sub linea del historial
      dH[0].rutaH2_trace.addTo(this.mapService.map);



    } else {

        for (let i = 0; i < dH.length; i++) {
            if (dH[i].layer != null) {
                this.mapService.map.removeLayer(dH[i].layer);
            }
            // if(dH[i]._trama_fecha_velocidad != null){
            //     this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);
            // }
            // this.mapService.map.removeLayer(dH[i]._trama);
        }
        
        // if (this.form.chckTrama) {
        //   for (let i = 0; i < dH.length; i++) {
        //     dH[i]._trama.addTo(this.mapService.map);
        //   }
        // } 
        // else {
          for (let i = 0; i < dH.length; i++) {
            this.mapService.map.removeLayer(dH[i]._trama);
            this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);

          }
        // }



        this.mapService.map.removeLayer(dH[0].layer0);
        this.mapService.map.removeLayer(dH[dH.length - 1].layerN);

        this.mapService.map.removeLayer(dH[0].rutaH2);
        this.mapService.map.removeLayer(dH[0].ruta_sub);
        this.mapService.map.removeLayer(dH[0].rutaH2_trace);

    
    }



    // for (let index = 0; index < this.EventService.eventsHistorial.length; index++) {
    //   const item = this.EventService.eventsHistorial[index];
    //   this.mapService.map.removeLayer(item.layer);
    // }



    var eH = this.historialService.arrayRecorridos[key].eventos;

    if (this.historialService.arrayRecorridos[key].mostrarRuta) {



      this.mostrar_tabla2(dH,iH,key);

      

    } else {
      for (let i = 0; i < eH.length; i++) {
        this.mapService.map.removeLayer(eH[i].layer);
      }
    }


  }

  clickEliminar(index:any, key:any) {
    console.log("-----------------clickEliminar");
    console.log();

    this.historialService.arrayRecorridos[index];

    console.log(this.historialService.arrayRecorridos[index]);
    console.log(this.historialService.arrayRecorridos);

    var dH = this.historialService.arrayRecorridos[index].recorrido;
    var iH  = dH[0].index_historial; //indices de paradas y movimientos

    for (let i = 0; i < dH.length; i++) {
        if (dH[i].layer != null) {
            this.mapService.map.removeLayer(dH[i].layer);
        }

        this.mapService.map.removeLayer(dH[i]._trama);
        this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);

    }


    this.mapService.map.removeLayer(dH[0].layer0);
    this.mapService.map.removeLayer(dH[dH.length-1].layerN);
    
    this.mapService.map.removeLayer(dH[0].rutaH2);
    this.mapService.map.removeLayer(dH[0].ruta_sub);
    this.mapService.map.removeLayer(dH[0].rutaH2_trace);
    


    // Eliminar eventos
    var eH = this.historialService.arrayRecorridos[index].eventos;
    for (let i = 0; i < eH.length; i++) {
      this.mapService.map.removeLayer(eH[i].layer);
    }








    this.historialService.arrayRecorridos = this.historialService.arrayRecorridos.filter(function( obj:any ) {
      return obj.key !== key;  // id=23	name=Somnolencia	slug=somnolencia	type=accessories		 ==> 7.	Quitar los eventos de Somnolencia
    });


  }


  async clickVerGrafico(index:any, key:any) {
    console.log("-----------------clickVerGrafico");
    console.log("-----------index");
    console.log(index);
    console.log("-----------key");
    console.log(key);

    // this.historialService.modalActive=false;
    // console.log("GAAAAAAA");
    // await new Promise(f => setTimeout(f, 500));

    this.historialService.modalActive=true;


    this.historialService.keyGrafico = key;

    // this.changeShowingGrafico();

    this.historialService.changeMessage("desde com panel-historial");


    // this.historialService.arrayRecorridos[index];

    // console.log(this.historialService.arrayRecorridos[index]);
    // console.log(this.historialService.arrayRecorridos);

    // var dH = this.historialService.arrayRecorridos[index].recorrido;
    // var iH  = dH[0].index_historial; //indices de paradas y movimientos

    // for (let i = 0; i < dH.length; i++) {
    //     if (dH[i].layer != null) {
    //         this.mapService.map.removeLayer(dH[i].layer);
    //     }

    //     this.mapService.map.removeLayer(dH[i]._trama);
    //     this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);

    // }

    // this.mapService.map.removeLayer(dH[0].layer0);
    // this.mapService.map.removeLayer(dH[dH.length-1].layerN);
    
    // this.mapService.map.removeLayer(dH[0].rutaH2);
    // this.mapService.map.removeLayer(dH[0].ruta_sub);
    // this.mapService.map.removeLayer(dH[0].rutaH2_trace);

    // // Eliminar eventos
    // var eH = this.historialService.arrayRecorridos[index].eventos;
    // for (let i = 0; i < eH.length; i++) {
    //   this.mapService.map.removeLayer(eH[i].layer);
    // }

    // this.historialService.arrayRecorridos = this.historialService.arrayRecorridos.filter(function( obj:any ) {
    //   return obj.key !== key;  // id=23	name=Somnolencia	slug=somnolencia	type=accessories		 ==> 7.	Quitar los eventos de Somnolencia
    // });


  }
  

  async clickCargarHistorial() {
    this.spinner.show('loadingHistorial');
    // this.clickEliminarHistorial();



    this.historialService.getHistorial();
    // var dH =  this.historialService.tramasHistorial; // Data Historial


    /* let MDstr = "" + this.form.fecha_desde.month;
    let DDstr = "" + this.form.fecha_desde.day;
    console.log('Form', MDstr);
    console.log('Form', DDstr); */
    let MDstr = "" + moment(this.form.pngFechaIni).format("M");
    let DDstr = "" + moment(this.form.pngFechaIni).format("D");
    // let HMDstr = "" + moment(this.pngHoraIni).format("HH:mm:00");
    // let horaDstr = this.form.pngHoraIni2.toString();
    // let minDstr = this.form.pngMinIni.toString();

    let HMDstr = "" + moment(this.form.pngHoraIni2).format("HH:mm:00");


    /* console.log('Date', MDstr);
    console.log('Date', DDstr); */

    /* let MHstr = "" + this.form.fecha_hasta.month;
    let DHstr = "" + this.form.fecha_hasta.day; */
    let MHstr = "" + moment(this.form.pngFechaFin).format("M");
    let DHstr = "" + moment(this.form.pngFechaFin).format("D");
    // let HMHstr = "" + moment(this.pngHoraFin).format("HH:mm:00");
    // let horaHstr = this.form.pngHoraFin2.toString();
    // let minHstr = this.form.pngMinFin.toString();

    let HMHstr = "" + moment(this.form.pngHoraFin2).format("HH:mm:00");

    /* var M1 = this.form.fecha_desde.year+'-'+this.fStrMD(MDstr)+'-'+this.fStrMD(DDstr) + 'T' + this.form.hora_desde + ':' + this.form.min_desde + ':00-05:00';
    var M2 = this.form.fecha_hasta.year+'-'+this.fStrMD(MHstr)+'-'+this.fStrMD(DHstr) + 'T' + this.form.hora_hasta + ':' + this.form.min_hasta + ':00-05:00'; */
    var M1 = moment(this.form.pngFechaIni).format("YYYY")+'-'+this.fStrMD(MDstr)+'-'+this.fStrMD(DDstr) + 'T' + HMDstr + '-05:00';
    var M2 = moment(this.form.pngFechaFin).format("YYYY")+'-'+this.fStrMD(MHstr)+'-'+this.fStrMD(DHstr) + 'T' + HMHstr + '-05:00';

    var M1str = moment(this.form.pngFechaIni).format("YYYY")+'-'+this.fStrMD(MDstr)+'-'+this.fStrMD(DDstr) + ' ' + HMDstr + '';
    var M2str = moment(this.form.pngFechaFin).format("YYYY")+'-'+this.fStrMD(MHstr)+'-'+this.fStrMD(DHstr) + ' ' + HMHstr + '';

    
    // var M1 = moment(this.form.pngFechaIni).format("YYYY")+'-'+this.fStrMD(MDstr)+'-'+this.fStrMD(DDstr) + 'T' + this.fStrMD(horaDstr)+":"+this.fStrMD(minDstr)+':00-05:00';
    // var M2 = moment(this.form.pngFechaFin).format("YYYY")+'-'+this.fStrMD(MHstr)+'-'+this.fStrMD(DHstr) + 'T' + this.fStrMD(horaHstr)+":"+this.fStrMD(minHstr)+':00-05:00';

    console.log(this.form.pngFechaIni);
    // console.log( this.fStrMD(this.form.pngHoraIni2.toString()) );
    // console.log( this.fStrMD(this.form.pngMinIni.toString()));
    console.log("===========================");
    console.log(this.form.pngFechaFin);
    // console.log(this.form.pngHoraFin2);
    // console.log(this.form.pngMinFin);
    console.log(this.form.pngHoraIni2);
    console.log(this.form.pngHoraFin2);


    // console.log( this.fStrMD(this.pngHoraFin2.toString()) );
    // console.log( this.fStrMD(this.pngMinFin.toString()));



    this.historialService.nombreUnidad = this.nombreUnidad = (this.cars.filter((item:any)=> item.imei == this.form.selectedCar))[0].nombre;
    this.historialService.icono = (this.cars.filter((item:any)=> item.imei == this.form.selectedCar))[0].icon;
    this.historialService.nameoperation = (this.cars.filter((item:any)=> item.imei == this.form.selectedCar))[0].nameoperation;


    

    var au = this.historialService.arrayRecorridos;
    var key = this.nombreUnidad+'_'+M1+'_'+M2;
    var icono = this.historialService.icono;
    var nameoperation = this.historialService.nameoperation;
    //verificar q no existan keys repetidas :
    for (let i = 0; i < au.length; i++) {
      console.log(au[i].key+' - '+key);
      
      if ( au[i].key == key ) {
        console.log("SE REPITE LA KEY ");
        Swal.fire({
          title: 'Error',
          text: 'Unidad y recorrido ya seleccionado.',
          icon: 'error',
        });
        this.spinner.hide('loadingHistorial');

        return ;
        
      }
      
    }





    var param = {
                fecha_desde:M1, fecha_hasta:M2,
                imei:this.form.selectedCar,
                user_id:localStorage.getItem('user_id')

                // , duracionParada:vm.form.duracionParada.id,
                // conParada:vm.form.verParadasHistorial, nombreUnidad:vm.form.selectedUnidad.value.name,
                // colorHistorial:vm.form.colorHistorial, colorSubHistorial:vm.form.colorSubHistorial,
                // icono : values[0].icon
              };
    console.log(param);
    // console.log("ID DEL USUARIO");
    // console.log(localStorage.getItem('user_id'));
    
    


    this.historialService.get_tramas_recorrido(param).then( res => {

      this.EventService.ShowAllHistorial(param).then( res1 => {

          console.log("=== VERDADERO EVENTOS HISTORIAL");
          console.log(res1);
          console.log(this.EventService.eventsHistorial);


          const duracion = parseInt(this.form.duracionParada);
          //let dH = res[0];
          var dH =  this.historialService.tramasHistorial; // Data Historial

          //console.log('HISTORIALLLLLL');
          //console.log(res);
          // //console.log(res[0]);

          //console.log('-----clickCargarHistorial');
          //console.log(this.form);
          //console.log(dH.length);
          //console.log(dH);



          // var h1 = new Array();

          var index_historial2 = new Array();
          // var poly = [];


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
            dH[0].nombre = this.nombreUnidad;//"Nombre Unidad";//param.nombreUnidad;

            dH[h].ultimo  = h; // guardar el numero de elementos en la ultima trama.
            dH[h].nombre = this.nombreUnidad;//"Nombre Unidad";//param.nombreUnidad;

            for (let i = 0; i < dH.length; i++) {

                if (i!=0) {
                  dH[i].distancia =   (this.calcularDistanciaEntreDosCoordenadas(dH[i-1].lat, dH[i-1].lng, dH[i].lat, dH[i].lng)) * 1000;
                }

                dH[i].dt_ss = new Date(dH[i].dt_server);
                dH[i].dt_js = new Date(dH[i].dt_tracker);

                dH[i].dt_tracker = dH[i].dt_tracker.replace(/\//g, "-");
                dH[i].lat = parseFloat(dH[i].lat);
                dH[i].lng = parseFloat(dH[i].lng);

                dH[i].paramsGet = this.getParams(dH[i].params);

                dH[i]._trama = this.get_trama_marker(dH[i]);//.addTo(this.mapService.map);
                dH[i]._trama_fecha_velocidad = this.get_trama_marker_fecha_velocidad(dH[i]);//.addTo(this.mapService.map);

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
                  // //console.log("--------xD");
                  // //console.log(item);
                  // //console.log(dH[item]);
                  // //console.log(i);
                  //Es parada y tiene el check de mostrar paradas
                  if ( dH[item].marker == "PARADA") {

                      if (i != index_historial2.length-1) {
                        dH[item].paradaFin = dH[index_historial2[i+1]].dt_tracker;
                      } else {
                        ////console.log("--------xD-- ULTIMO");
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

                      dH[item].combustible_movimiento = this.get_combustible_movimiento(dH, a1, a2);
                      dH[item].distancia_movimiento = this.get_distancia_movimiento(dH, a1, a2);

                      // for (let i = a1; i <= a2; i++) {
                      //   dH[item].cc.push([dH[i].lat, dH[i].lng]);
                      // }

                  }
                });
                // //console.log('------>>>>> '+index_historial2);
                // //console.log(index_historial2);

                dH[0].index_historial = index_historial2;
                dH[0].layer0 = this.get_inicial_marker(dH[0]).addTo(this.mapService.map);
                dH[h].layerN = this.get_final_marker(dH[h]).addTo(this.mapService.map);

                this.mapService.map.fitBounds([[minLat, minLng],[maxLat, maxLng]]);

                var color = this.form.colorHistorial;//'red';
                var color_sub = 'blue';
                dH[0].rutaH2 = this.get_historial_line( dH[0].rutaH , color).addTo(this.mapService.map); //Linea del historial
                dH[0].ruta_sub = this.get_historial_line( [] , color_sub).addTo(this.mapService.map); //Sub linea del historial


                dH[0].rutaH2_trace = L.polylineDecorator( dH[0].rutaH , {
                  patterns: [
                      //{ offset: 12, repeat: 25, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: 'black', weight: 2}})},
                      { offset: 2, repeat: 30, symbol: L.Symbol.arrowHead({pixelSize: 4.3,polygon: false,pathOptions: {stroke: true,weight: 1.4,color: 'black',opacity: 1}})}
                  ]
                }).addTo(this.mapService.map);;

              var combustibleTotal = this.get_combustible_movimiento(dH, 0, 'FIN');//'100 gal.';
              var kilometrajeTotal = this.get_distancia_movimiento(dH, 0, 'FIN');//'100 gal.';


                console.log("dH",dH);
                
                this.historialService.arrayRecorridos.push({
                    key: this.nombreUnidad+'_'+M1+'_'+M2,
                    icono: icono,
                    nameoperation: nameoperation,
                    nombre: this.nombreUnidad,
                    f_ini: M1str,
                    f_fin: M2str,
                    kilometrajeTotal: kilometrajeTotal,
                    combustibleTotal: combustibleTotal,
                    mostrarRuta : true,
                    recorrido: dH,
                    // recorrido_bol :distancia_bol,
                    eventos:this.EventService.eventsHistorial,
                    // tramas : [{
                    //       tooltip: '11111',
                    //       dato:'gaaaaa1',
                    //       dt_tracker:'2011-10-10 11:11:11',
                    //       temp:'ee'
                    //     },{
                    //       tooltip: '1112',
                    //       dato:'gaaaaa2',
                    //       dt_tracker:'2011-10-10 11:11:11',
                    //       temp:'ee'

                    //     },{
                    //       tooltip: '1113',
                    //       dato:'gaaaaa3',
                    //       dt_tracker:'2011-10-10 11:11:11',
                    //       temp:'ee'

                    //     }]
                });

                // this.historialService.changeMessage("desde com panel-historial")


                // this.historialService.arrayRecorridos = [
                //   {
                //     nombre: this.nombreUnidad+'o',
                //     f_ini: M1,
                //     f_fin: M2,
                //     kilometrajeTotal: 20,
                //     tramas : [{
                //           tooltip: '11111',
                //           dato:'gaaaaa1',
                //           dt_tracker:'2011-10-10 11:11:11',
                //           temp:'ee'
                //         },{
                //           tooltip: '1112',
                //           dato:'gaaaaa2',
                //           dt_tracker:'2011-10-10 11:11:11',
                //           temp:'ee'

                //         },{
                //           tooltip: '1113',
                //           dato:'gaaaaa3',
                //           dt_tracker:'2011-10-10 11:11:11',
                //           temp:'ee'

                //         }]
                //   },
                //   {
                //     nombre: this.nombreUnidad,
                //     f_ini: M1,
                //     f_fin: M2,
                //     kilometrajeTotal: 30,
                //     tramas : [{
                //           tooltip: '1117',
                //           dato:'gaaaaa4',
                //           dt_tracker:'2011-10-10 11:11:11'
                //         },{
                //           tooltip: '1118',
                //           dato:'gaaaaa5',
                //           dt_tracker:'2011-10-10 11:11:11'
                //         },{
                //           tooltip: '1119',
                //           dato:'gaaaaa6',
                //           dt_tracker:'2011-10-10 11:11:11'
                //         },{
                //           tooltip: '1120',
                //           dato:'gaaaaa7',
                //           dt_tracker:'2011-10-10 11:11:11'
                //         }
                      
                //       ]
                //   }


                // ];

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
                // // //console.log("---- FF ------- 1");
                // // //console.log(overlay);
                // // //console.log("---- FF ------- 2");
                // // //console.log("------");
                // // //console.log(overlay);
                // // //console.log("------");
                // // mapData.map.fitBounds(overlay.getBounds());
                // //mapData.map.fitBounds(bounds);


                // mapData.map.fitBounds([[minLat, minLng],[maxLat, maxLng]]);
                // var allmap = new map.Movimiento(h1,{color: param.colorHistorial }).addTo(overlay);
                // allmap._trace.addTo(overlay);

                // var submap = new map.Movimiento([],{color: param.colorSubHistorial});//.addTo(overlay);
                // var poly = [allmap, submap];
                // // //console.log("XXXXXXXXXXXXXXXXXXXXXX-------------------------------------");
                // // ////console.log(lili);
                // // //console.log("XXXXXXXXXXXXXXXXXXXXXX-------------------------------------");
                // //------------------------ MOVIMEINTO DEL GRAFICO ------------------------------
                // var iconc = { iconUrl: 'images/mm_20_red.png', iconAnchor: [6, 20] };
                // var icoG1 = new map.Parada([0, 0], { icon: new L.Icon(iconc), showTrace: true })
                //                   .bindPopup( {offset: new L.Point(0, -16)} );

                // var icons = { iconUrl: 'images/objects/nuevo/'+param.icono, iconSize: [32, 32], iconAnchor: [16, 16] };
                // var icoG2 = new map.Parada([0, 0], { icon: new L.Icon(icons), showTrace: true })
                //                   .bindPopup( {offset: new L.Point(-18, -10)} );



                //   // //console.log(this.getParams(this.historialService.tramasHistorial[0].params));



            //console.log(dH[0].paramsGet);


            //this.panelService.nombreComponente = nomComponent;

            // const item1 = (dH[0].paramsGet.filter((item:any)=> item.id == "GPRS Status"))[0].value;
            // const item2 = (dH[0].paramsGet.filter((item:any)=> item.id == "GPRS Status"))[0];

            // //console.log("===================================");

            // //console.log(item1);
            // //console.log(item2);


            // this.panelService.nombreCabecera =   item[0].name;

                this.mostrar_tabla(dH, dH[0].index_historial);

                this.mostrar_tabla2(dH, dH[0].index_historial,(this.historialService.arrayRecorridos.length-1))
                this.changeShowingTramas();
                this.changeShowingGrafico();

                
                // this.changeShowingTramas();
                this.changeShowingTramasFechaVelocidad();
                this.isHistorialTableLoaded = true;
                /* $('#tbl_fechas').floatThead({
                  scrollContainer: () => {
                    return $('.panel-izq-table-container');
                  },
                }); */
            this.spinner.hide('loadingHistorial');
          } else {
            this.spinner.hide('loadingHistorial');
            console.log("NO HAY SUFICIENTE INFORMACIÓN "+dH.length);
            Swal.fire({
              title: 'Error',
              text: 'No hay suficiente información.',
              icon: 'error',
            });
            //this.showNotEnoughInfoDialog();
          }

      }); // fin de eventosa historial
    }); // fin de historial tramas

    // var dH22  = await this.historialService.get_tramas_recorrido(param);
    // //console.log('================== DDD ');
    // //console.log(dH22);





  }



  get_combustible_movimiento(dH:any, a1:any, a2:any) {

      if (a2 == 'FIN') {
            
          var h = dH.length - 1; //Ultimo indice del array
          var x1 = (dH[0].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0] === undefined ? "-" :(dH[0].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0].value ;
          var x2 = (dH[h].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0] === undefined ? "-" :(dH[h].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0].value ;
          var kilometrajeTotal = '-';
          // console.log('======== 0 - Fin');
          // console.log(a1+' - '+a2);
          // console.log(x1+' - '+x2);
          // console.log(x2-x1);
          if (x1 == '-' || x2 == '-') {
              kilometrajeTotal = '-';
          } else {
              kilometrajeTotal = ((x2-x1)*0.2641).toFixed(2) + 'gal. (' + (x2-x1).toFixed(2) + 'l.)';
          }
          return kilometrajeTotal;

      } else {

          var x1 = (dH[a1].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0] === undefined ? "-" :(dH[a1].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0].value ;
          var x2 = (dH[a2].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0] === undefined ? "-" :(dH[a2].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0].value ;
          var kilometrajeTotal = '-';
          if (x1 == '-' || x2 == '-') {
              kilometrajeTotal = '';
          } else {
              kilometrajeTotal = ((x2-x1)*0.2641).toFixed(2) + 'gal. (' + (x2-x1).toFixed(2) + 'l.)';
          }
          return kilometrajeTotal;

      }

  }
  
  get_distancia_movimiento(dH:any, a1:any, a2:any) {

    if (a2 == 'FIN') {
        var h = dH.length - 1; //Ultimo indice del array
        var x1 = (dH[0].paramsGet.filter((item:any)=> item.id == "can_dist"))[0] === undefined ? "-" :(dH[0].paramsGet.filter((item:any)=> item.id == "can_dist"))[0].value ;
        var x2 = (dH[h].paramsGet.filter((item:any)=> item.id == "can_dist"))[0] === undefined ? "-" :(dH[h].paramsGet.filter((item:any)=> item.id == "can_dist"))[0].value ;
        var kilometrajeTotal = '-';
        // console.log('======== 0 - Fin');
        // console.log(a1+' - '+a2);
        // console.log(x1+' - '+x2);
        // console.log(x2-x1);
        if (x1 == '-' || x2 == '-') {
            kilometrajeTotal = '-';
        } else {
            kilometrajeTotal = (x2-x1).toFixed(2) + ' km';
        }
        return kilometrajeTotal;
    } else {

        var x1 = (dH[a1].paramsGet.filter((item:any)=> item.id == "can_dist"))[0] === undefined ? "-" :(dH[a1].paramsGet.filter((item:any)=> item.id == "can_dist"))[0].value ;
        var x2 = (dH[a2].paramsGet.filter((item:any)=> item.id == "can_dist"))[0] === undefined ? "-" :(dH[a2].paramsGet.filter((item:any)=> item.id == "can_dist"))[0].value ;
        var kilometrajeTotal = '-';
        if (x1 == '-' || x2 == '-') {
            kilometrajeTotal = '';
        } else {
            kilometrajeTotal = (x2-x1).toFixed(2) + 'km';
        }
        return kilometrajeTotal;
    }
  }



  add_geocerca_movimineto(trama:any,trama2trama:any, key:any) {
    console.log("____________add_geocerca_movimineto");
    // console.log(key);
    // console.log(trama);
    // console.log(trama2trama);
    // console.log(trama2trama.cc);
    // console.log(trama2trama.cc[0]);
    // console.log(trama2trama.cc[1]);
    var recorrido_unidad = this.historialService.arrayRecorridos.filter(function( obj:any ) {
      return obj.key == key;  // id=23	name=Somnolencia	slug=somnolencia	type=accessories		 ==> 7.	Quitar los eventos de Somnolencia
    });
    // console.log(recorrido_unidad[0]);
    //var dH =  this.historialService.tramasHistorial; // Data Historial
    // console.log(recorrido_unidad[0].recorrido);

    var LL = recorrido_unidad[0].recorrido;
    var arrCoordenadas = [];
    for (let i = trama2trama.cc[0]; i <= trama2trama.cc[1]; i++) {
      arrCoordenadas.push({lat:LL[i].lat,lng:LL[i].lng, speed:LL[i].speed});
    }
    console.log("==== arrCoordenadas");
    console.log(arrCoordenadas);
    

    // console.log(recorrido_unidad[0].recorrido[trama2trama.cc[0]]);
    // console.log(recorrido_unidad[0].recorrido[trama2trama.cc[1]]);

  }




  showNotEnoughInfoDialog() {
    this.dialogDisplay = true;
  }

  clickEliminarHistorial() {

    if (this.conHistorial) {

      $("#btnStopConsola").trigger("click");

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
        if(dH[i]._trama_fecha_velocidad != null){
          this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);
        }
        this.mapService.map.removeLayer(dH[i]._trama);
      }


      for (let index = 0; index < this.EventService.eventsHistorial.length; index++) {
        const item = this.EventService.eventsHistorial[index];
        this.mapService.map.removeLayer(item.layer);
      }


      this.historialService.tramasHistorial = [];
      this.conHistorial = false;
      this.transfers = [];

      $("#graficohistorial").css("display", "none");

    }

    this.isHistorialTableLoaded = false;



  }


  changeShowingParadasHistorial() {

    // if (this.conHistorial) {
    //   var dH =  this.historialService.tramasHistorial; // Data Historial
    //   var iH  = dH[0].index_historial; //indices de paradas y movimientos

    //   if (this.form.chckParada) {
    //     for (let i = 0; i < dH.length; i++) {
    //       if (dH[i].layer != null) {
    //         dH[i].layer.addTo(this.mapService.map);
    //       }
    //     }
    //   } else {
    //     for (let i = 0; i < dH.length; i++) {
    //       if (dH[i].layer != null) {
    //         this.mapService.map.removeLayer(dH[i].layer);
    //       }
    //     }
    //   }

    //   this.mostrar_tabla(dH,iH);
    // } 

    //===================================  ARRAY DE HISTORIALES ============================================
    
    var rdH = this.historialService.arrayRecorridos;

    for (let i = 0; i < rdH.length; i++) {

        var dH = rdH[i].recorrido;
        var iH  = dH[0].index_historial; //indices de paradas y movimientos
        
        this.mostrar_tabla2(dH,iH,i);

        for (let i = 0; i < iH.length; i++) {
          if (dH[iH[i]].marker == "PARADA") {
            if (this.form.chckParada ) {
              dH[iH[i]].layer.addTo(this.mapService.map);
            } else {
              this.mapService.map.removeLayer(dH[iH[i]].layer);
            }
          }
        }

    }

  }


  calcularDistanciaEntreDosCoordenadas (lat1:any, lon1:any, lat2:any, lon2:any) {
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

  gradosARadianes(grados:any) {
    return grados * Math.PI / 180;
  };



  mostrar_tabla(dH:any, iH:any , idx:any=-1) {
      if (this.conHistorial) {

            // console.log("========================== HISTORIAL ===========================");
            // console.log(this.EventService.eventsHistorial);

            // para la tabla


                              //   // console.log(tableH);
                              //   vm.tramasEventos.forEach(item => {
                              //     if (item.inHistorial) {
                              //       item.dt_tracker = item.fecha_tracker.replace(/\//g, "-");
                              //       item.lat = item.latitud;
                              //       item.lng = item.longitud;
                              //       item.icono = item.layer.options.icon.options.iconUrl.substring(9);
                              //       item.icono_height = "17px";
                              //       item.icono_width = "18px";
                              //       if ( item.tipo == "Tiempo de estadia en zona" || item.tipo == "Parada en zona no autorizada" ) {item.temp = item.tiempo_limite;} else { item.temp = "";}
                              //       tableH.push(item);
                              //     }

                              // });


                             

            this.transfers = [];
            this.transfers.push({icono:"assets/images/start.png", tooltip: "Inicio",trama:dH[0],icono_width:"13px",icono_height:"13px",dt_tracker:dH[0].dt_tracker});


            for (let i = 0; i < iH.length; i++) {

              if (dH[iH[i]].marker == "PARADA") {
                  if (this.form.chckParada ) {
                      this.transfers.push({icono:"assets/images/stop.png", tooltip: "Parada",trama:dH[iH[i]],icono_width:"11px",icono_height:"13px",dt_tracker:dH[iH[i]].dt_tracker});
                  }
              } else {
                  this.transfers.push({icono:"assets/images/drive.png", tooltip: "Movimiento",trama:dH[iH[i]],icono_width:"13px",icono_height:"13px",dt_tracker:dH[iH[i]].dt_tracker});
              }

            }
            // console.log("this.eventList : mostrar tabla eventos");
            // console.log(this.eventList);
            // console.log(this.EventService.eventsHistorial);

            // if (this.form.chckEvento) {
            for (let index = 0; index < this.EventService.eventsHistorial.length; index++) {

              const item = this.EventService.eventsHistorial[index];
              var activar = true;//false;

              // for (let j = 0; j < this.selectedEvents.length; j++) {
              //   const opEve = this.selectedEvents[j];
              //   // console.log(opEve.name + " -- " +item.evento);
              //   // if (opEve.name == item.evento) { activar = true; }

              //   //Nombres de eventos que cambiaron
              //   var tEvento = item.evento.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); //en mayusculas y sin tildes

              //   // if (opEve.name == 'Batería desconectada' && item.evento.toUpperCase() == 'BATERÍA DESCONECTADA') { activar = true; }

              //   if (opEve.name == 'Batería desconectada' && tEvento == 'BATERIA DESCONECTADA') { activar = true; }
              //   if (opEve.name == 'Aceleración brusca'   && tEvento == 'ACELERACION BRUSCA') { activar = true; }
              //   if (opEve.name == 'Frenada brusca'       && tEvento == 'FRENADA BRUSCA') { activar = true; }
              //   if (opEve.name == 'SOS'                  && tEvento == 'SOS') { activar = true; }
              //   if (opEve.name == 'Motor Apagado'        && tEvento == 'MOTOR APAGADO') { activar = true; }
              //   if (opEve.name == 'Motor Encendido'      && tEvento == 'MOTOR ENCENDIDO') { activar = true; }

              //   if (opEve.name == 'Zona de Entrada'           && tEvento == 'ZONA DE ENTRADA') { activar = true; }
              //   if (opEve.name == 'Zona de Salida'            && tEvento == 'ZONA DE SALIDA') { activar = true; }
              //   if (opEve.name == 'Tiempo de Estadía en Zona' && tEvento == 'TIEMPO DE ESTADIA EN ZONA') { activar = true; }

              //   if (opEve.name == 'Parada en Zona no Autorizada'            && tEvento == 'PARADA EN ZONA NO AUTORIZADA') { activar = true; }
              //   if (opEve.name == 'Vehículo en movimiento sin programación' && tEvento == 'VEHICULO SIN PROGRAMACION') { activar = true; }
              //   if (opEve.name == 'Infracción'                              && tEvento == 'INFRACCION') { activar = true; }
              //   if (opEve.name == 'Exceso de Velocidad'                     && tEvento == 'EXCESO DE VELOCIDAD') { activar = true; }

              //   if (opEve.name == 'Ausencia de rostro' && tEvento == 'NO ROSTRO') { activar = true; }
              //   if (opEve.name == 'Fatiga Extrema'     && tEvento == 'FATIGA EXTREMA') { activar = true; }
              //   if (opEve.name == 'Posible Fatiga'     && tEvento == 'SOMNOLENCIA') { activar = true; }
              //   if (opEve.name == 'Posible Fatiga'     && tEvento == 'POSIBLE FATIGA') { activar = true; }

              //   if (opEve.name == 'Distracción'        && tEvento == 'DISTRACCION') { activar = true; }

              //   if (opEve.name == 'Detección de alcohol' && tEvento == 'ALCOHOLEMIA') { activar = true; }
              //   if (opEve.name == 'Anticolisión frontal' && tEvento == 'ANTICOLISION FRONTAL') { activar = true; }
              //   if (opEve.name == 'Anticolisión frontal' && tEvento == 'COLISION DELANTERA') { activar = true; }


              //   if (opEve.name == 'Colisión con Peatones'               && tEvento == 'COLISION CON PEATONES') { activar = true; }
              //   if (opEve.name == 'Desvío de carril hacia la izquierda' && tEvento == 'DESVIO DE CARRIL HACIA LA IZQUIERDA') { activar = true; }
              //   if (opEve.name == 'Desvío de carril hacia la derecha'   && tEvento == 'DESVIO DE CARRIL HACIA LA DERECHA') { activar = true; }
              //   if (opEve.name == 'Bloqueo de visión del Mobileye'      && tEvento == 'BLOQUEO DE VISION DEL MOBILEYE') { activar = true; }

              // }

              // eventsClassList = [
              //   { tipo: 'Zona de entrada', clase: 'zona-entrada' },
              //   { tipo: 'Zona de salida', clase: 'zona-salida' },
              //   { tipo: 'Tiempo de estadia en zona', clase: 'tiempo-estadia-zona' },
              //   { tipo: 'Parada en zona no autorizada', clase: 'parada-zona-no-autorizada' },
              //   { tipo: 'Mantenimiento correctivo', clase: 'mantenimiento-correctivo' },
              //   { tipo: 'Mantenimiento preventivo', clase: 'mantenimiento-preventivo' },
              //   { tipo: 'Mantenimiento correctivo realizado', clase: 'mantenimiento-correctivo-realizado' },
              //   { tipo: 'Mantenimiento preventivo realizado', clase: 'mantenimiento-preventivo-realizado' },
              //   { tipo: 'SOS', clase: 'sos-event' },
              //   { tipo: 'Exceso de Velocidad', clase: 'exceso-velocidad' },
              //   { tipo: 'Infraccion', clase: 'infraccion' },
              //   { tipo: 'Vehiculo sin programacion', clase: 'vehiculo-sin-programacion' },
              //   { tipo: 'Frenada brusca', clase: 'frenada-brusca' },
              //   { tipo: 'Aceleracion brusca', clase: 'aceleracion-brusca' },
              //   { tipo: 'Bateria desconectada', clase: 'bateria-desconectada' },
              //   { tipo: 'Motor encendido', clase: 'motor-encendido' },
              //   { tipo: 'Motor apagado', clase: 'motor-apagado' },
              //   { tipo: 'Fatiga', clase: 'fatiga' },
              //   { tipo: 'Somnolencia', clase: 'somnolencia' },
              //   { tipo: 'Distraccion', clase: 'distraccion' },
              //   { tipo: 'Distracción', clase: 'distraccion' },
              //   { tipo: 'Desvío de carril hacia la izquierda', clase: 'desvio-carril-izq' },
              //   { tipo: 'Desvío de carril hacia la derecha', clase: 'desvio-carril-der' },
              //   { tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
              //   { tipo: 'Colisión con peatones', clase: 'colision-peatones' },
              //   { tipo: 'Colisión delantera', clase: 'colision-delantera' },
              //   { tipo: 'Posible Fatiga', clase: 'posible-fatiga' },
              //   { tipo: 'Fatiga Extrema', clase: 'fatiga-extrema' },
              //   { tipo: 'No Rostro', clase: 'no-rostro' },
              // ];


                    // this.tipoEvento = [
                    //   { id: 0, option: 'Todos los Eventos', tipo: '' },
                    //   { id: 1, option: 'Alcoholemia', tipo: '' },
                    //   { id: 2, option: 'Somnolencia', tipo: 'Somnolencia', clase: 'somnolencia' },
                    //   { id: 3, option: 'Distracción', tipo: 'Distraccion', clase: 'distraccion' },
                    //   { id: 4, option: 'Batería Desconectada', tipo: 'Bateria desconectada', clase: 'bateria-desconectada' },
                    //   { id: 5, option: 'Aceleración Brusca', tipo: 'Aceleracion brusca', clase: 'aceleracion-brusca' },
                    //   { id: 6, option: 'Frenada Brusca', tipo: 'Frenada brusca', clase: 'frenada-brusca' },
                    //   { id: 7, option: 'S.O.S.', tipo: 'SOS', clase: 'sos-event' },
                    //   { id: 8, option: 'Zona de Entrada', tipo: 'Zona de entrada', clase: 'zona-entrada' },
                    //   { id: 9, option: 'Zona de Salida', tipo: 'Zona de salida', clase: 'zona-salida' },
                    //   { id: 10, option: 'Tiempo de estadía en zona', tipo: 'Tiempo de estadia en zona', clase: 'tiempo-estadia-zona' },
                    //   { id: 11, option: 'Parada en zona no autorizada', tipo: 'Parada en zona no autorizada', clase: 'parada-zona-no-autorizada' },
                    //   { id: 12, option: 'Exceso de velocidad', tipo: 'Exceso de Velocidad', clase: 'exceso-velocidad' },
                    //   { id: 13, option: 'Transgresión', tipo: '' },
                    //   { id: 14, option: 'Infracción', tipo: 'Infraccion', clase: 'infraccion' },
                    //   { id: 15, option: 'Vehículo sin programación', tipo: 'Vehiculo sin programacion', clase: 'vehiculo-sin-programacion' },
                    //   { id: 16, option: 'Mantenimiento preventivo', tipo: 'Mantenimiento preventivo', clase: 'mantenimiento-preventivo' },
                    //   { id: 16, option: 'Mantenimiento preventivo realizado', tipo: 'Mantenimiento preventivo realizado', clase: 'mantenimiento-preventivo-realizado' },
                    //   { id: 17, option: 'Mantenimiento correctivo', tipo: 'Mantenimiento correctivo', clase: 'mantenimiento-correctivo' },
                    //   { id: 18, option: 'Mantenimiento correctivo realizado', tipo: 'Mantenimiento correctivo realizado', clase: 'mantenimiento-correctivo-realizado' },
                    //   { id: 19, option: 'Motor apagado', tipo: 'Motor apagado', clase: 'motor-apagado' },
                    //   { id: 20, option: 'Motor encendido', tipo: 'Motor encendido', clase: 'motor-encendido' },

                    //   { id: 21, option: 'Fatiga', tipo: 'Fatiga', clase: 'fatiga' },
                    //   { id: 22, option: 'Posible Fatiga', tipo: 'Posible Fatiga', clase: 'posible-fatiga' },
                    //   { id: 23, option: 'Fatiga Extrema', tipo: 'Fatiga Extrema', clase: 'fatiga-extrema' },
                    //   { id: 24, option: 'Desvío de carril hacia la izquierda', tipo: 'Desvío de carril hacia la izquierda', clase: 'desvio-carril-izq' },
                    //   { id: 25, option: 'Desvío de carril hacia la derecha', tipo: 'Desvío de carril hacia la derecha', clase: 'desvio-carril-der' },
                    //   { id: 26, option: 'Bloqueo de visión del Mobileye', tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
                    //   { id: 27, option: 'Colisión con peatones', tipo: 'Colisión con peatones', clase: 'colision-peatones' },
                    //   { id: 28, option: 'Colisión con delantera', tipo: 'Colisión delantera', clase: 'colision-delantera' },
                    //   { id: 29, option: 'Bloqueo de visión del mobileye', tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
                    // ];


              // for (let j = 0; j < this.eventList.length; j++) {
              //   const items = this.eventList[j].items;
              //   for (let i = 0; i < items.length; i++) {
              //     console.log(items[i]);

              //       if (items[i].name == item.evento && items[i].value) {
              //         activar = true;
              //       }
              //   }
              // }


                  // if (this.form.eventos.OtroTodos) {
                  //   activar = true;
                  // } else {
                  // if (item.evento == "Zona de salida" && this.form.eventos.evSalida) {
                  //   activar = true;
                  // } else if (item.evento == "Zona de entrada" && this.form.eventos.evEntrada) {
                  //   activar = true;
                  // } else if (item.evento == "Tiempo de estadia en zona" && this.form.eventos.evEstadia) {
                  //   activar = true;
                  // } else if (item.evento == "Parada en zona no autorizada" && this.form.eventos.evParada) {
                  //   activar = true;
                  // } else if (item.evento == "Infraccion" && this.form.eventos.evInfraccion) {
                  //   activar = true;
                  // } else if (item.evento == "Anticolision frontal" && this.form.eventos.evAnticolisionFrontal) {
                  //   activar = true;
                  // } else if (item.evento == "Colision con peatones" && this.form.eventos.evColisionConPeatones) {
                  //   activar = true;
                  // } else if (item.evento == "No Rostro" && this.form.eventos.evNoRostro) {
                  //   activar = true;
                  // } else if (item.evento == "Fatiga Extrema" && this.form.eventos.evFatigaExtrema) {
                  //   activar = true;
                  // } else if (item.evento == "Desvío de carril hacia la izquierda" && this.form.eventos.evDesvioCarrilIzquierda) {
                  //   activar = true;
                  // } else if (item.evento == "Desvío de carril hacia la derecha" && this.form.eventos.evDesvioCarrilDerecha) {
                  //   activar = true;
                  // } else if (item.evento == "Bloqueo de vision del mobileye" && this.form.eventos.evBloqueoVisionMobileye) {
                  //   activar = true;
                  // } else if (item.evento == "Cambio de conductor" && this.form.eventos.evCambioConductor) {
                  //   activar = true;
                  // } else if (item.evento == "Cambio de conductor no realizado" && this.form.eventos.evCambioConductorNoRealizado) {
                  //   activar = true;
                  // } else if (item.evento == "Mantenimiento preventivo" && this.form.eventos.evManPreventivo) {
                  //   activar = true;
                  // } else if (item.evento == "Mantenimiento correctivo" && this.form.eventos.evManCorrectivo) {
                  //   activar = true;
                  // } else if (item.evento == "Mantenimiento preventivo realizado" && this.form.eventos.evManPreventivoRealizado) {
                  //   activar = true;
                  // } else if (item.evento == "Mantenimiento correctivo realizado" && this.form.eventos.evManCorrectivoRealizado) {
                  //   activar = true;
                  // } else if ( (item.evento == "Exceso de Velocidad" || item.evento == "Transgresion") && this.form.eventos.OtroExVelocidad) {
                  //   activar = true;
                  // } else if (item.evento == "SOS" && this.form.eventos.GPSsos) {  //=================  GPS
                  //   activar = true;
                  // } else if (item.evento == "Bateria desconectada" && this.form.eventos.GPSbateriaDesconectada) {
                  //   activar = true;
                  // } else if (item.evento == "Aceleracion brusca" && this.form.eventos.GPSaceleracionBrusca) {
                  //   activar = true;
                  // } else if (item.evento == "Frenada brusca" && this.form.eventos.GPSfrenadaBrusca) {
                  //   activar = true;
                  // } else if (item.evento == "Motor encendido" && this.form.eventos.GPSmotorEncendido) {
                  //   activar = true;
                  // } else if (item.evento == "Motor apagado" && this.form.eventos.GPSmotorApagado) {
                  //   activar = true;
                  // } else if (item.evento == "Fatiga" && this.form.eventos.AccFatiga) {   //========== ACCESORIOS
                  //   activar = true;
                  // } else if (item.evento == "Somnolencia" && this.form.eventos.AccSomnolencia) {   //========== ACCESORIOS
                  //   activar = true;
                  // } else if (item.evento == "Distraccion" && this.form.eventos.AccDistraccion) {   //========== ACCESORIOS
                  //   activar = true;
                  // } else if (item.evento == "Alcoholemia" && this.form.eventos.AccAlcoholemia) {   //========== ACCESORIOS
                  //   activar = true;
                  //}



              if (activar) {

                item.layer.addTo(this.mapService.map);//.openPopup();

                item.lat = parseFloat(item.latitud);
                item.lng = parseFloat(item.longitud);
                item.dt_tracker = item.fecha_tracker.replace(/\//g, "-");
                this.transfers.push({icono: item.layer.options.icon.options.iconUrl, tooltip: item.evento, trama:item,icono_width:"17px",icono_height:"18px",dt_tracker:item.dt_tracker});

              } else {
                this.mapService.map.removeLayer(item.layer);
              }

            } // fin del for
            this.transfers = this.sortByKey(this.transfers, "dt_tracker");
            // console.log("=== ORDENADO");
            // console.log(this.transfers);
            // } else {
            //   for (let index = 0; index < this.EventService.eventsHistorial.length; index++) {
            //     const item = this.EventService.eventsHistorial[index];
            //     this.mapService.map.removeLayer(item.layer);
            //   }
            // }

            this.transfers.push({icono:"assets/images/end.png", tooltip: "Fin", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px",dt_tracker:dH[dH.length-1].dt_tracker});
           
            // console.log("================================================");
            // console.log(this.historialService.arrayRecorridos);
            // console.log(this.transfers);
            // console.log(this.transfers.length);

      }

  }


  mostrar_tabla2(dH:any, iH:any , idx:any=-1) {
    console.log("==== mostrar_tabla2 ===>>");
    
    if (this.conHistorial) {

          this.transfers = [];
          this.transfers.push({icono:"assets/images/start.png", tooltip: "Inicio",trama:dH[0],icono_width:"13px",icono_height:"13px",dt_tracker:dH[0].dt_tracker});



          for (let i = 0; i < iH.length; i++) {

            //===== obtener la distacia con en can
       

            if (dH[iH[i]].marker == "PARADA") {
              //console.log('parara = '+iH[i]+' - '+x1);

              if (this.form.chckParada ) {
                this.transfers.push({icono:"assets/images/stop.png", tooltip: "Parada",trama:dH[iH[i]],icono_width:"11px",icono_height:"13px",dt_tracker:dH[iH[i]].dt_tracker});
              }
            }
            else {
              // var x1 = (dH[iH[i]].paramsGet.filter((item:any)=> item.id == "can_dist"))[0] === undefined ? "-" : (dH[iH[i]].paramsGet.filter((item:any)=> item.id == "can_dist"))[0].value;
              // console.log('movimi = '+iH[i]+' - '+x1);
              // console.log(dH[iH[i]]);
              this.transfers.push({icono:"assets/images/drive.png", tooltip: "Movimiento",trama:dH[iH[i]],icono_width:"13px",icono_height:"13px",dt_tracker:dH[iH[i]].dt_tracker});
            }
          }
          // console.log(this.eventList);
          // console.log(this.EventService.eventsHistorial);
          var EventosAll = [];

          if (idx == -1) {
            EventosAll = this.EventService.eventsHistorial;
          } else {

            console.log("=======================================");
            console.log(this.historialService.arrayRecorridos);
            console.log(idx);
            console.log(this.historialService.arrayRecorridos[idx]);


            EventosAll = this.historialService.arrayRecorridos[idx].eventos;
          }
          console.log(":::: LOS EVENTOS ::::");
          console.log(EventosAll);
          
          for (let index = 0; index < EventosAll.length; index++) {

            //const item = this.EventService.eventsHistorial[index];
            const item = EventosAll[index];
            var activar = true;// false;

            // for (let j = 0; j < this.selectedEvents.length; j++) {
            //   const opEve = this.selectedEvents[j];

            //   //Nombres de eventos que cambiaron
            //   var tEvento = item.evento.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); //en mayusculas y sin tildes
              
            //   if (opEve.name == 'Batería desconectada' && tEvento == 'BATERIA DESCONECTADA') { activar = true; }
            //   if (opEve.name == 'Aceleración brusca'   && tEvento == 'ACELERACION BRUSCA') { activar = true; }
            //   if (opEve.name == 'Frenada brusca'       && tEvento == 'FRENADA BRUSCA') { activar = true; }
            //   if (opEve.name == 'SOS'                  && tEvento == 'SOS') { activar = true; }
            //   if (opEve.name == 'Motor Apagado'        && tEvento == 'MOTOR APAGADO') { activar = true; }
            //   if (opEve.name == 'Motor Encendido'      && tEvento == 'MOTOR ENCENDIDO') { activar = true; }

            //   if (opEve.name == 'Zona de Entrada'           && tEvento == 'ZONA DE ENTRADA') { activar = true; }
            //   if (opEve.name == 'Zona de Salida'            && tEvento == 'ZONA DE SALIDA') { activar = true; }
            //   if (opEve.name == 'Tiempo de Estadía en Zona' && tEvento == 'TIEMPO DE ESTADIA EN ZONA') { activar = true; }

            //   if (opEve.name == 'Parada en Zona no Autorizada'            && tEvento == 'PARADA EN ZONA NO AUTORIZADA') { activar = true; }
            //   if (opEve.name == 'Vehículo en movimiento sin programación' && tEvento == 'VEHICULO SIN PROGRAMACION') { activar = true; }
            //   if (opEve.name == 'Infracción'                              && tEvento == 'INFRACCION') { activar = true; }
            //   if (opEve.name == 'Exceso de Velocidad'                     && tEvento == 'EXCESO DE VELOCIDAD') { activar = true; }

            //   if (opEve.name == 'Ausencia de rostro' && tEvento == 'NO ROSTRO') { activar = true; }
            //   if (opEve.name == 'Fatiga Extrema'     && tEvento == 'FATIGA EXTREMA') { activar = true; }
            //   if (opEve.name == 'Posible Fatiga'     && tEvento == 'SOMNOLENCIA') { activar = true; }
            //   if (opEve.name == 'Posible Fatiga'     && tEvento == 'POSIBLE FATIGA') { activar = true; }

            //   if (opEve.name == 'Distracción'        && tEvento == 'DISTRACCION') { activar = true; }

            //   if (opEve.name == 'Detección de alcohol' && tEvento == 'ALCOHOLEMIA') { activar = true; }
            //   if (opEve.name == 'Anticolisión frontal' && tEvento == 'ANTICOLISION FRONTAL') { activar = true; }
            //   if (opEve.name == 'Anticolisión frontal' && tEvento == 'COLISION DELANTERA') { activar = true; }


            //   if (opEve.name == 'Colisión con Peatones'               && tEvento == 'COLISION CON PEATONES') { activar = true; }
            //   if (opEve.name == 'Desvío de carril hacia la izquierda' && tEvento == 'DESVIO DE CARRIL HACIA LA IZQUIERDA') { activar = true; }
            //   if (opEve.name == 'Desvío de carril hacia la derecha'   && tEvento == 'DESVIO DE CARRIL HACIA LA DERECHA') { activar = true; }
            //   if (opEve.name == 'Bloqueo de visión del Mobileye'      && tEvento == 'BLOQUEO DE VISION DEL MOBILEYE') { activar = true; }

            // }

            if (activar) {

              item.layer.addTo(this.mapService.map);//.openPopup();

              item.lat = parseFloat(item.latitud);
              item.lng = parseFloat(item.longitud);
              item.dt_tracker = item.fecha_tracker.replace(/\//g, "-");
              this.transfers.push({icono: item.layer.options.icon.options.iconUrl, tooltip: item.evento, trama:item,icono_width:"17px",icono_height:"18px",dt_tracker:item.dt_tracker});

            } else {
              this.mapService.map.removeLayer(item.layer);
            }

          } // fin del for


          this.transfers = this.sortByKey(this.transfers, "dt_tracker");

          dH[dH.length-1].distancia = '- km';
          this.transfers.push({icono:"assets/images/end.png", tooltip: "Fin", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px",dt_tracker:dH[dH.length-1].dt_tracker});


          if (idx == -1) {
              if (this.conHistorial && this.transfers.length > 0) {
                  console.log("LLENAR TRAMAS ================================================ - " + idx);
                  this.historialService.arrayRecorridos[this.historialService.arrayRecorridos.length-1].tramas = this.transfers;
              }
          } else {
              if (this.conHistorial && this.transfers.length > 0) {
                  console.log("LLENAR TRAMAS ================================================ - " + idx);
                  this.historialService.arrayRecorridos[idx].tramas = this.transfers;
              }
          }


    }

  }

  sortByKey(array:any, key:any) {
    return array.sort((a:any, b:any) => {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }


  
  clickLocate(row:any, key:any=-1) {
    console.log(row);
    console.log(key);
    
    //console.log("-----movimiento ----");
    if (key == -1) {
      var dH =  this.historialService.tramasHistorial; // Data Historial
    } else {

      //=======================================================================================

      // this.historialService.arrayRecorridos.push({
      //   key: this.nombreUnidad+'_'+M1+'_'+M2,
      //   nombre: this.nombreUnidad,
      //   f_ini: M1str,
      //   f_fin: M2str,
      //   kilometrajeTotal: distancia_total,
      //   mostrarRuta : true,
      //   recorrido: dH,
      //   recorrido_bol :distancia_bol,
      //   eventos:this.EventService.eventsHistorial,
      //   tramas : [{
      //         tooltip: '11111',
      //         dato:'gaaaaa1',
      //         dt_tracker:'2011-10-10 11:11:11',
      //         temp:'ee'
      //       },{
      //         tooltip: '1112',
      //         dato:'gaaaaa2',
      //         dt_tracker:'2011-10-10 11:11:11',
      //         temp:'ee'
      //       },{
      //         tooltip: '1113',
      //         dato:'gaaaaa3',
      //         dt_tracker:'2011-10-10 11:11:11',
      //         temp:'ee'
      //       }]
      // });

      var rdH = this.historialService.arrayRecorridos;

      for (let i = 0; i < rdH.length; i++) {
          //console.log(rdH[i].key+"  -  -  "+key);
          if ( rdH[i].key == key ) {
            var dH = rdH[i].recorrido;
          }
  
          // var dH = rdH[i].recorrido;
          // var iH  = dH[0].index_historial; //indices de paradas y movimientos
          // this.mostrar_tabla2(dH,iH,i);
          // for (let i = 0; i < iH.length; i++) {
          //   if (dH[iH[i]].marker == "PARADA") {
          //     if (this.form.chckParada ) {
          //       dH[iH[i]].layer.addTo(this.mapService.map);
          //     } else {
          //       this.mapService.map.removeLayer(dH[iH[i]].layer);
          //     }
          //   }
          // }
      }
      //=======================================================================================

    }




    let trama = row.trama;
      // console.log("click en el tr");
      // console.log(trama);

    if (row.icono == "assets/images/eventos/pin_point.svg") {
      this.clearMultimedia(trama);
      trama.layer.openPopup();
      this.addMultimediaComponent(trama);
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if (row.icono == "assets/images/start.png") {
      //console.log("--primero ----");
      trama.layer0.fireEvent('click');
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if(row.icono == "assets/images/end.png") {
      //console.log("--ultimo ----");
      trama.layerN.fireEvent('click');
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if(row.icono == "assets/images/stop.png") {
      //console.log("-----parada ----");
      trama.layer.fireEvent('click');
      this.mapService.map.setView([trama.lat, trama.lng], 15);

    } else if (row.icono == "assets/images/drive.png") {





      // var rdH = this.historialService.arrayRecorridos;

      // for (let i = 0; i < rdH.length; i++) {
  
      //     var dH = rdH[i].recorrido;
      //     var iH  = dH[0].index_historial; //indices de paradas y movimientos
          
      //     this.mostrar_tabla2(dH,iH,i);
  
      //     for (let i = 0; i < iH.length; i++) {
      //       if (dH[iH[i]].marker == "PARADA") {
      //         if (this.form.chckParada ) {
      //           dH[iH[i]].layer.addTo(this.mapService.map);
      //         } else {
      //           this.mapService.map.removeLayer(dH[iH[i]].layer);
      //         }
      //       }
      //     }
      // }


      //console.log("-----movimiento ----");

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
      // console.log("log ==> cc");
      // console.log(cc);
      // console.log(dH[0].ruta_sub);
      dH[0].ruta_sub.setLatLngs(cc); //.addTo(this.mapService.map);
      dH[0].ruta_sub.setStyle({opacity: 1, color: 'blue'});

    }

  }


  changeShowingTramas(){

    // if (this.conHistorial) {
    //   var dH =  this.historialService.tramasHistorial; // Data Historial
    //   if (this.form.chckTrama) {
    //     for (let i = 0; i < dH.length; i++) {
    //       dH[i]._trama.addTo(this.mapService.map);
    //     }
    //   } else {
    //     for (let i = 0; i < dH.length; i++) {
    //       this.mapService.map.removeLayer(dH[i]._trama);
    //     }
    //   }
    // }

    //=================================================================================
    
    this.historialService.dataFormulario.chckTrama = this.form.chckTrama;

    console.log(this.mapService.map.getZoom());

    var lvlzoom = this.mapService.map.getZoom();
    var nivel = 1000;; // todo
    var ccont = 0;
    switch (lvlzoom) {
      case 12:
        nivel = 1000; //todo
        console.log("-------12 - 1000");
        break;
      case 13:
        nivel = 600; //todo
        console.log("-------13 - 600");
        break;
      case 14:
        nivel = 400; //todo
        console.log("-------14 - 400");
        break;
      case 15:
        nivel = 300; //todo
        console.log("-------15 - 200");
        break;
      case 16:
        nivel = 200; //todo
        console.log("-------16 - 100");
        break;
      case 17:
        nivel = 100; //todo
        console.log("-------17 - 50");
        break;
      case 18:
        nivel = 1; //todo
        console.log("-------18 - 1");
        break;
      default:
        nivel = 1000; // todo
        console.log("-------default");
        break;
    }



    var acum1 = 0.000000;
    var acum2 = nivel;



    if (lvlzoom >= 12) {
      var allH = this.historialService.arrayRecorridos;

      for (let j = 0; j < allH.length; j++) {
        var dH       = allH[j].recorrido;
        var mostrarR = allH[j].mostrarRuta;

        for (let i = 0; i < dH.length; i++) {
          this.mapService.map.removeLayer(dH[i]._trama);
          // this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);
        }
  
        if (this.form.chckTrama && mostrarR) {
          for (let i = 0; i < dH.length; i++) {

            dH[i]._trama.addTo(this.mapService.map);
            
            // acum1 = acum1 + dH[i].distancia;
            // // if (dH[i].distancia > nivel) {
            // if (acum1 > acum2) {
            //   acum2 = acum2 + nivel;
            //   // if (ccont == i) {
            //   // console.log(ccont);
            //   dH[i]._trama.addTo(this.mapService.map);
            //   //   ccont = ccont + nivel;
            //   // }
            // }

          }
        } 

      }
    }


  }

  changeShowingTramasFechaVelocidad(){

    // // : marker.bindTooltip(tooltipText, {permanent:false} )
    // if (this.conHistorial) {
    //   var dH =  this.historialService.tramasHistorial; // Data Historial

    //   if (this.form.chckTrama) {
    //     if (this.form.chckTramaFechaVelocidad) {
    //         for (let i = 0; i < dH.length; i++) {
    //           dH[i]._trama_fecha_velocidad.addTo(this.mapService.map);
    //           // dH[i]._trama.bindTooltip( "gaaaaaaa1",{permanent:true})
    //         }
    //     } else {
    //         for (let i = 0; i < dH.length; i++) {
    //           this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);
    //           // dH[i]._trama.bindTooltip("gaaaaaaa2",{permanent:false})
    //         }
    //     }
    //   } else {
    //     for (let i = 0; i < dH.length; i++) {
    //       this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);
    //       // dH[i]._trama.bindTooltip("gaaaaaaa3",{permanent:false})
    //     }
    //   }
    // }


    ///==============================================================

    this.historialService.dataFormulario.chckTramaFechaVelocidad = this.form.chckTramaFechaVelocidad;

    // console.log(this.mapService.map.getZoom());

    var lvlzoom = this.mapService.map.getZoom();
    var nivel = 100; // todo
    var ccont = 0;
    switch (lvlzoom) {
      case 12:
        nivel = 1000; //todo
        console.log("-------12 - 1000");
        break;
      case 13:
        nivel = 600; //todo
        console.log("-------13 - 600");
        break;
      case 14:
        nivel = 400; //todo
        console.log("-------14 - 400");
        break;
      case 15:
        nivel = 300; //todo
        console.log("-------15 - 200");
        break;
      case 16:
        nivel = 200; //todo
        console.log("-------16 - 100");
        break;
      case 17:
        nivel = 100; //todo
        console.log("-------17 - 50");
        break;
      case 18:
        nivel = 1; //todo
        console.log("-------18 - 1");
        break;
      default:
        nivel = 1000; // todo
        console.log("-------default");
        break;
    }


    var acum1 = 0.000000;
    var acum2 = nivel;

    //movimiento
    //https://stackoverflow.com/questions/35800775/leaflet-js-fire-event-when-map-pans
    if (lvlzoom >= 12) {
        var allH = this.historialService.arrayRecorridos;
        for (let j = 0; j < allH.length; j++) {
          var dH       = allH[j].recorrido;
          var mostrarR = allH[j].mostrarRuta;

          for (let i = 0; i < dH.length; i++) {
            // this.mapService.map.removeLayer(dH[i]._trama);
            this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);
          }

          if (this.form.chckTramaFechaVelocidad && mostrarR) {
 
            for (let i = 0; i < dH.length; i++) {

              if (isNaN(parseFloat(dH[i].distancia))) {
                // console.log("----------DAA---------");
              } else {
                acum1 = acum1 + parseFloat(dH[i].distancia);
                // console.log(acum1 +"  -  "+acum2+"  -  "+parseFloat(dH[i].distancia));
              }

              if ( acum1 > acum2 ) {
                acum1 = 0;
                // console.log(acum1 +"  -  "+ acum2);
                if(this.mapService.map.getBounds().contains(dH[i]._trama.getLatLng())){
                  dH[i]._trama_fecha_velocidad.addTo(this.mapService.map);
                } 
                
              }

            }
            
          } 
        }
    }

  }

  changeShowingGrafico(){
    console.log("--changeShowingGrafico");
    console.log(this.conHistorial);

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
      // //console.log(latlng);

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
            ////console.log(v1,v2);
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
            ////console.log(v1,v2);
            if ( isNaN( parseFloat( v2 ) ) ) {
                paramsObj.push({id:v1,value:v2})
            } else {
                paramsObj.push({id:v1,value:parseFloat(v2)})
            }
        };
        ////console.log(paramsObj);

    };

    // //console.log("**** parametros ****");
    // //console.log(paramsObj);
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
            ////console.log(timeo)
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
      }).bindPopup(contenido,{offset: new L.Point(0, -13)
      });
      // .bindTooltip(
      //   // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
      //   /* '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geopoints[i].geopunto_color+';">'+this.geopoints[i].geopunto_name+'</b>', */
      //   '<b class="" style=" background-color: '+ this.mapService.hexToRGBA('#F00') +'; color: '+ this.mapService.getContrastYIQ('#F00') +';">'+trama.dt_tracker+'<br>'+trama.speed+' km/h</b>',
      //   { permanent: true,
      //     offset: [20, 20],
      //     direction: 'center',
      //     className: 'leaflet-tooltip-own',
      //   });



      return marker;



  }





  get_trama_marker_fecha_velocidad(trama:any){

    //============= LEGENDA
    let marker = L.circleMarker([trama.lat, trama.lng], {
      // pane: 'markers1',
      "radius": 0,
      "fillColor": "#000",//color,
      "fillOpacity": 1,
      "color": "#000",//color,
      "weight": 1,
      "opacity": 1

    }).bindTooltip(
        // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
        /* '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geopoints[i].geopunto_color+';">'+this.geopoints[i].geopunto_name+'</b>', */
        '<b class="" style=" background-color: '+ this.mapService.hexToRGBA('#6633FF') +'; color: '+ this.mapService.getContrastYIQ('#6633FF') +';">'+trama.dt_tracker+' -> '+trama.speed+' km/h</b>',
        { permanent: true,
          offset: [20, 20],
          direction: 'center',
          className: 'leaflet-tooltip-own',
        });



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

  onChkAllEvents(){
    // this.selectedEvents = this.chkAllEvents? [...this.eventList[0].items, ...this.eventList[1].items, ...this.eventList[2].items, ...this.eventList[3].items]: [];
    this.selectedEvents = this.chkAllEvents? [...this.eventList[0].items, ...this.eventList[1].items, ...this.eventList[2].items]: [];

  }
  addMultimediaComponent(event:any){
    if(event.parametros && event.parametros.gps == "cipia" && (event.parametros.has_video != "0" || event.parametros.has_image != "0")){
      console.log("adding multimedia: ", event);
      
      const factory = this.resolver.resolveComponentFactory(SliderMultimediaComponent);
      const componentRef: ComponentRef<any> = this.container.createComponent(factory);
      const params:any = {
        'event': event, 
        'driver': this.VehicleService.vehicles.find(vh => vh.IMEI == event.imei)?.nombre_conductor??'',
        'showMultimediaFirst': true,
        'hasMultimedia':true,
        'showTitle':false
      };
      // Asignar datos al componente si existen
      
      Object.keys(
        params
        ).forEach((key) => {
          componentRef.instance[key] = params[key];
        });
        // Agregar el componente directamente al contenedor del popup
        console.log("componentRef.location.nativeElement",componentRef.location.nativeElement);
        
      const divContainer = document.getElementById('multimedia-'+event.parametros.eventId)!;
      console.log("divContainer",divContainer);
      divContainer.appendChild(componentRef.location.nativeElement);
    }
  }

  clearMultimedia(event :any){
    if (this.EventService.activeEvent) {
      if(this.EventService.activeEvent.id == event.id && event.layer.isPopupOpen()){
        console.log("no hacer nada");
        return;
      }
      this.EventService.activeEvent.layer.closePopup();
      this.EventService.activeEvent.layer.unbindPopup();
      this.EventService.activeEvent.layer.off()
      this.mapService.map.removeLayer(event.layer);
      this.EventService.activeEvent = false;
    }
  }
}
