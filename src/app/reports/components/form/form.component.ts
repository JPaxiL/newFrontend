import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../vehicles/services/vehicle.service';

import * as moment from 'moment';
import {ConfirmationService} from 'primeng-lts/api';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { ReportService } from '../../services/report.service';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BrowserDetectorService } from '../../services/browser-detector.service';
import { EventService } from 'src/app/events/services/event.service';
import { DriversService } from 'src/app/drivers/services/drivers.service';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

import Swal from 'sweetalert2';
// import { threadId } from 'worker_threads';


declare var google: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  reports: any=[];
  events: any=[];
  selectedReport: any={};
  vehicles: any=[];
  selectedVehicles: any=[];
  convoys: any=[];
  selectedConvoy: any={};
  groups: any=[];
  selectedGroup: any={};
  //para operaciones
  operations: any=[];
  selectedOperation: any={};
	disabledOperation = false;
	disabledGroup = true;
  placeholderOperation = 'Seleccione una Operación ...';
  placeholderGroup = 'Seleccione una Operación Primero...';
  placeholderConvoy = 'Seleccione una Operación Primero...';
	disabledConvoy = true;
  listOptionCheckbox = 'all';
  listOptions: any= [
    { idOption: 'Mostrar Todos los Vehículos', valueOption: 'all' },
    { idOption: 'Operación', valueOption: 'operacion' },
    { idOption: 'Grupo', valueOption: 'grupo' },
    { idOption: 'Convoy', valueOption: 'convoy' }
  ];
  checkboxGroup: boolean = false;
  pDropdownGroup: any= [
    { label: 'Convoy', value: false },
    { label: 'Grupo', value: true },
    { label: 'Operacion', value: false }
  ];
  /* checkboxParada: boolean = true; //Renamed to chkStops
  checkboxMovimiento: boolean = true; */ //Renamed to chkMovements
  // checkboxDuracion: boolean = false; //Renamed to chkDuracion
  dateInit!: Date;
  dateEnd!: Date;
  timeInit!: Date;
  timeEnd!: Date;

	zones: any=[];
	/* changedReport = changedReport();
	onGenerate = onGenerate();
	showConfirm = showConfirm();
	clearSearchTermVehicle = clearSearchTermVehicle();
	clearSearchTermConvoy = clearSearchTermConvoy();
	clearSearchTermGroup = clearSearchTermGroup();
	clearSearchTermZone = clearSearchTermZone();
	checkAllVehicles = checkAllVehicles();
	checkAllConvoys = checkAllConvoys();
	checkAllGroups = checkAllGroups();
	checkAllZones = checkAllZones();
	//checkForGroup = checkForGroup;
	closeSidebar = closeSidebar(); */
	isUserGeneral = true; // usar en caso use reportes para un usuario comun
	//selectedVehicle: any=[];
	//selectedConvoy: any=[];
	//selectedGroup: any=[];
	//selectedZone: any=[]; //Replaced by selectedZones
	//showLimitSpeed = false; //Replaced by showExcVelOpt

	//showZones = false;
	showCheckboxs = false;
  showCheckboxsCipia = false;

	showCard = false;
	showDivHorizontal = false;
	showEvents = false;
  showEventsCipia = false;
  showAtencionEventsCipia = false;

	showSubLimitTime = false;
	showTrans1min = false;
	showFatigaOp = false;
	//showFrenadaAceleracionOp = false; //Renamed to showBrakeAccel
	disableVehicle = false;
	disableConvoy = false;
	disableGroup = false;
	disableButton = false;
	initialDate = new Date();
	finishedDate = new Date();
	initialHour = "00";
	initialMinute = "00";
	finishedHour = "23";
	finishedMinute = "59";
  fullScreenSpinnerMsg: string = 'Finalizando carga...';

  strYearRange: string = '';

  //Popup
  popupIconSrc='./assets/images/popup-icon-chrome.svg';
  popupDialogPosition: string = 'top-right';
  popupDialogInlineStyle: any = {};
  isChrome: boolean = false;
  isFirefox: boolean = false;
  isSafari: boolean = false;
  isOpera: boolean = false;
  isEdge: boolean = false;
  isIEEdge: boolean = false;
  unknownBrowser: boolean = false;

	reportType = "0";
  toggleConvoy = true;
  toggleGrupo = false;
  chkAllVehicles = false;
  chkAllZones = false;
  showBlockedTabDialog = false;

  showLimitTime = false;
  areVehiclesLoaded = false;
  areZonesLoaded = false;
  isUserIdLoaded = false;
  errorFlag = 0;

  //Reporte 0 - Paradas y Movi
	chkStops: boolean = true;
	chkMovements: boolean = true;
  showMovStop = false;

  //Reporte 1 - Exceso de Vel
  showExcVelOpt: boolean = false;
  checkboxDuration: boolean = false;
  minimDur = 15;
  limitSpeed = 90;

  pDropdownDuration: any= [
    { label: 'Límite de Velocidad', value: false },
    { label: 'Duración', value: true }
  ];

  //Reporte 2 - Entrada y Salida
  showZones: boolean = false;
  selectedZones: any =[];

//Reporte 3 - Combustible
  showOdomOpt: boolean = false;
  chkOdomVirtual: boolean = false;
  odometroVirtual: number= 0;

  //Reporte 4 - Frenada y Aceleracion Brusca
  showBrakeAccel: boolean = false;
  chkFrenada = true;
	chkAceleracion = true;

  //Reporte 5 - Reporte General
  oG = {
    DUOT2state:false, // --- NEW2
    RPMAlta:false,
    RxM:false,
    aBrusca:false,
    alcoholemia:false,
    altitud:false,
    angulo:false,
    cMotor:false,
    cRestante: false, // --- NEW
    fBrusca:false,
    fExBrusca:false,
    fServidor:false,   // --- NEW
    fatiga:false,
    cNivel:false,  //  NEW
    odometro:false,
    onOff:false,
    pCercano:false,
    parametros: false,  // --- NEW
    recFacial:false,
    referencia:false,
    ubicacion:false,
    velCAN:false,
    velECO:false,
    velGPS:false,
    velGPS_speed:false,
    velMobileye_ME460:false,
    //NEW 24-01
    alimentGps:false,
    nivelBateria:false,
    nivelCobertura:false,
    temperaturaGps:false,
    satelite:false,
  };

  // PARA CONTROLADR CUALES EVENTOS MOSTRAR
  eventsTypes: any[] = [
    { name: 'gps', active: false, label: 'GPS', selectAll: false },
    { name: 'platform', active: false, label: 'PLATAFORMA', selectAll: false },
    { name: 'security', active: false, label: 'SEGURIDAD VEHICULAR', selectAll: false },
    { name: 'mobile', active: false, label: 'SOLUCIONES MÓVILES', selectAll: false },
    { name: '360', active: false, label: 'FATIGA 360', selectAll: false },
  ];
  //LISTA DE EVENTOS MARCADOS POR DEFECTO
  evCheckDefault = {
    AccFatiga: true,
    // AccTest: true,
  };
  //Reporte 6 - Reporte de Eventos
  eV: { [key: string]: boolean } = {};

  // eV = {
      // GPSbateriaBaja:false,
      // GPSbateriaDesconectada:false,
      // GPSaceleracionBrusca:false,
      // GPSfrenadaBrusca:false,
      // GPSbloqueoTransmision:false,
      // GPSsos:false,
      // GPSremolque:false,
      // GPSparada: false, // --- NEW
      // GPSmotorEncendido: false, // --- NEW
      // GPSmotorApagado: false, // --- NEW
      // GPSextremAceleracionBrusca:false, // --New aceleracion extremadamente brusca
      // GPSextremFrenadaBrusca:false, // --NEW frenada extremadamente brusca
      // GPSdriverDetected:false, // --NEW conductor identificado
      // GPSdriverNotDetected:false, // --NEW conductor no identificado
      // GPSmanipuled:false, // --NEW manipulacion de GPS
      // GPSjamming:false, // --NEW jamming?
      // GPSantenaOff:false, // --NEW antena gps desconectada
      
      // // EVENTOS PLATAFORMA
      // evEntrada:false, // zona de entrada
      // evSalida:false, // zona de salida
      // evEstadia:false,   // --- tiempo de estadia en zona
      // evParada:false,   // --- para en zona no autorizada
      // evMovSinProgramacion:false,  //  YA NO SE USA
      // evInfraccion:false, // infraccion
      // evExcesoDeVelocidad:false, // exceso de velocidad

      // //EVENTOS SEGURIDAD VEHICULAR
      // evAnticolisionFrontal:false, // anticolision frontal
      // evColisionConPeatones:false, // colision con peatones

      // evNoRostro:false, // no rostro
      // evFatigaExtrema:false, //fatiga extrema
      // evDesvioCarrilIzquierda:false, // Desvío de carril hacia la izquierda
      // evDesvioCarrilDerecha:false, // Desvío de carril hacia la derecha
      // evBloqueoVisionMobileye:false, //Bloqueo de visión del Mobileye
      // AccFatiga:false, // DESACTIVADO 
      // AccAlcoholemia:false, // Alcoholemia
      // AccIButton: false,  // --- DESACTIVADO
      // AccSomnolencia: false, //Posible Fatiga
      // AccDistraccion: false, //Distracción
      // evVibracionSensorFatiga: false, //Vibración de Fatiga

  //     AccFatiga:false, // DESACTIVADO
  //     AccAlcoholemia:false,
  //     AccIButton: false,  // --- DESACTIVADO
  //     AccSomnolencia: false,
  //     AccDistraccion: false,

  //     OtroTodos:false,
  //     OtroExVelocidad:false,

  //     //==========================

  //     evConductorAdormitado360:false,
  //     evConductorSomnoliento360:false,
  //     evDistraccionDetectada360:false,
  //     evCinturonNoDetectado360:false,
  //     evCigarroDetectado:false,
  //     evCelularDetectado360:false,
  //     evErrorDeCamara:false,
  //     evDeteccionDeManipulacion360:false,

  //   };
  
  //Reporte 6 - Reporte de Eventos , Seleccion de Campo
  eC = {
    Fecha :true,
    FechaServidor :false,
    Evento :true,
    Codigo :true,
    Placa :true,
    TipoUnidad :false,
    IdConductor :false,
    Conductor :false,

    FechaEvaluacion : false,
    CriterioEvaluacion : false,
    Observacion : false,
    Validacion: false,

    VelMobileye :false,
    VelGPS :true,
    VelCAN :false,
    VelECO :false,
    VelGPSspeed :false,

    Zona :false,
    PuntoCercano :false,
    Ubicacion :false,
    Referencia :false,
    EnlaceArchivo :false,
    Parametros : false,

    OperadorMonitoreo : false,  // R. Atención de Eventos
  }


  //Reporte 10 - Distraccion y Posible Fatiga
  showFatigaDistraccion: boolean = false;

	chkFatigaSomnolencia = true;
	chkFatigaDistraccion = true;

  chkTrans1min = false;

	spinnerOptions = false;

  newWindow = false;

  isFormFilled = false;
  areDatesValid = true;
  areHoursValid = true;

  chkSimultaneousTables: boolean = true;
  showChkSimultaneousTables: boolean = false;
  singleTableReportIDs = ['R008', 'R020', 'R021'];

  //Removido del formulario
  chkDateHour = true; //False muestra fecha y h juntas. true separadas
	arrayUsers = [ 472, 204, 483, 467, 360, 394, 364, 445, 489, 491, 503, 504, 515, 522, 537, 554, 552, 555, 573, 587, 529, 590, 591, 595, 613, 620, 621, 734];
  fog = "1";
	userId = 0;

  isEverythingLoaded: boolean = false;

  constructor(
    private browserDetectorService: BrowserDetectorService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public reportService: ReportService,
    private vehicleService: VehicleService,
    private userDataService: UserDataService,
    public confirmationService: ConfirmationService,
    public eventService:EventService,
    private http: HttpClient,
    private driversService: DriversService,
    private titleService: Title) {
      //INICIAR EL VEHICLE SERVICE PARA REPORTES
      vehicleService.initialize();
      this.userDataService.getUserData();
      this.userDataService.userDataCompleted.subscribe(res=>{
        this.driversService.initialize(); //NECESITA INFO DE USER DATA
        // this.driversService.getHistoryAll(); // YA NO ES NECESARIO EL ESCUCHA LO HACE
        this.driversService.getIbuttonAll(); // LISTA LAS LLAVES DISPONIBLES
      })
      //this.fullScreenSpinnerMsg = 'Iniciando Módulo de Reportes';
      spinner.show("fullScreenSpinner");
      this.titleService.setTitle('Reportes');
      // this.vehicles=this.vehicleService.vehicles;
      this.vehicleService.dataCompleted.subscribe(vehicles=>{
        if(vehicles){
          this.vehicles = vehicles;
          console.log('Vehicles: ',vehicles);
          // this.convoys = _.uniqBy(this.vehicles, 'nameconvoy');
          // this.groups = _.uniqBy(this.vehicles, 'namegrupo');
          // this.convoys = this.convoys.map((convoy: { convoy: any; }) => { return convoy.convoy});
          // this.convoys = this.convoys.filter((convoy: any) => convoy != "Unidades Sin Convoy");
          // this.groups = this.groups.map((grupo: { grupo: any; }) => { return grupo.grupo});
          
          //lista de Operaciones Grupos Convoys existentes con vehiculos
          
          this.areVehiclesLoaded = true;
        } else {
          console.log('Fallo al obtener vehiculos');
          this.errorFlag++;
        }
        this.endInit();
      });
      


      this.http.post(environment.apiUrl + '/api/getReports', {}).subscribe({
        next: data => {
          // console.log(this.selectedConvoy.length);
          console.log("----------------data");
          console.log(data);
          this.reports = data;
        },
        error: () => {
          console.log('Hubo un error al procesar la solicitud');
        }
      });

      // bol_eliminado: false
      // codigo: "R008"
      // descripcion: ""
      // id: 3
      // url: "/api/reports/posicion"
      // value: "REPORTE DE POSICIÓN"

      // this.reports = [
      //   {id : 0, value : 'REPORTE DE PARADAS Y MOVIMIENTOS', url: '/api/reports/paradas_movimientos'},
      //   {id : 1, value : 'REPORTE DE EXCESOS DE VELOCIDAD', url: '/api/reports/exceso_velocidad'},
      //   {id : 2, value : 'REPORTE DE ENTRADA Y SALIDA', url: '/api/reports/entrada_salida'},
      //   {id : 3, value : 'REPORTE DE COMBUSTIBLE', url: '/api/reports/combustible'},
      //   {id : 4, value : 'REPORTE DE EXCESOS EN ZONA', url: '/api/reports/exceso_en_zona'},
      //   {id : 5, value : 'REPORTE GENERAL', url: '/api/reports/general'},
      //   {id : 6, value : 'REPORTE DE EVENTOS', url: '/api/reports/eventos'},
      //   {id : 7, value : 'REPORTE DE POSICIÓN ', url: '/api/reports/posicion'},
      //   {id : 8, value : 'REPORTE DE EXCESOS Y TRANSGRESIONES'},
      //   {id : 9, value : 'REPORTE DE COMBUSTIBLE ODÓMETRO VIRTUAL'},
      //   {id : 10, value : 'REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)', url: '/api/reports/frenada_aceleracion_brusca'},
      //   {id : 11, value : 'REPORTE DE DISTRACIÓN Y POSIBLE FATIGA', url: '/api/reports/distraccion_posible_fatiga'},
      //   {id : 12, value : 'REPORTE DE CALIFICACION DE MANEJO', url: '/api/reports/calificacion_manejo'},
      //   {id : 13, value : 'REPORTE DE FATIGA EXTREMA', url: '/api/reports/fatiga_extrema'},
      //   {id : 14, value : 'REPORTE DE ANTICOLISIÓN FRONTAL', url: '/api/reports/anticolision_frontal'},
      //   {id : 15, value : 'REPORTE DE COLISIÓN CON PEATONES', url: '/api/reports/colision_peatones'},
      //   {id : 16, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA IZQUIERDA', url: '/api/reports/desvio_carril_izquierda'},
      //   {id : 17, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA DERECHA', url: '/api/reports/desvio_carril_derecha'},
      //   {id : 18, value : 'REPORTE DE BLOQUEO DE VISIÓN DE MOBILEYE', url: '/api/reports/bloqueo_vision_mobileye'},
      //   {id : 19, value : 'REPORTE GERENCIAL (Cuenta cruzdelsur)', url: '/api/reports/gerencial_grafico_distraccion_fatiga'},
      //   {id : 20, value : 'REPORTE DE EXCESOS DE VELOCIDAD (FORMATO EXTENDIDO)', url: '/api/reports/exceso_velocidad_zona_formato_extendido'},
      //   {id : 21, value : 'REPORTE DE SOMNOLENCIA Y/O DISTRACCIÓN - PROLOINT', url: '/api/reports/somnolencia_proloint'},
      //   {id : 22, value : 'REPORTE DE MANTENIMIENTO FISICO', url: '/api/reports/mantenimiento_fisico'},

      // ];


// 0 - R001	REPORTE DE PARADAS Y MOVIMIENTOS
// 1 - R002	REPORTE DE EXCESOS DE VELOCIDAD
// 2 - R003	REPORTE DE ENTRADA Y SALIDA
// 3 - R004	REPORTE DE COMBUSTIBLE
// 4 - R005	REPORTE DE EXCESOS EN ZONA
// 5 - R006	REPORTE GENERAL
// 6 - R007	REPORTE DE EVENTOS
// 7 - R008	REPORTE DE POSICIÓN
// 8 - R009	REPORTE DE EXCESOS Y TRANSGRESIONES
// 9 - R010	REPORTE DE COMBUSTIBLE ODÓMETRO VIRTUAL
// 10 -R011	REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)
// 11 -R012	REPORTE DE DISTRACIÓN Y POSIBLE FATIGA
// 12 -R013	REPORTE DE CALIFICACION DE MANEJO
// 13 -R014	REPORTE DE FATIGA EXTREMA
// 14 -R015	REPORTE DE ANTICOLISIÓN FRONTAL
// 15 -R016	REPORTE DE COLISIÓN CON PEATONES
// 16 -R017	REPORTE DE DESVÍO DE CARRIL HACIA LA IZQUIERDA
// 17 -R018	REPORTE DE DESVÍO DE CARRIL HACIA LA DERECHA
// 18 -R019	REPORTE DE BLOQUEO DE VISIÓN DE MOBILEYE
// 19 -R020	REPORTE GERENCIAL (Cuenta cruzdelsur)
// 20 -R021	REPORTE DE EXCESOS DE VELOCIDAD (FORMATO EXTENDIDO)
// 21 -R022	REPORTE DE SOMNOLENCIA Y/O DISTRACCIÓN - PROLOINT
// 22 -R023	REPORTE DE MANTENIMIENTO FISICO
//    -R024	REPORTE DE NO ROSTRO




    }

  ngOnInit(): void {
    //LISTA DE EVENTOS
    this.eventService.getEventsForUser().subscribe(
      async (data) => {
        // Aquí puedes trabajar con los datos obtenidos
        console.log('EVENTOS DEL USUARIO OBTENIDOS: 1vez', data);
        // Realiza cualquier acción con los datos recibidos
        if (data.success){
          this.events = data.data;
          this.events = this.events.map((event: any) => {
            return { ...event, active: false };
          });
          this.updateShowTypeEvents();
        }else{
          this.events = [];
          console.log('EL USUARIO NO TIENE EVENTOS');
        }
      },
      (error) => {
        // Maneja los errores si ocurre alguno durante la solicitud
        console.error('Error al obtener los eventos:', error);
      }
    );
    this.strYearRange = '2000:' + new Date().getFullYear();
    console.log(this.selectedReport);
    console.log(JSON.stringify(this.selectedReport) == '{}');
    // console.log(this.selectedReport.keys().length);
    // console.log(this.selectedReport.keys().length === 0);
    console.log(typeof this.selectedReport);
    const hoy = Date.now();
    this.dateInit = new Date(moment(hoy).format("MM/DD/YYYY"));
    // this.dateEnd = new Date(moment(hoy).format("MM/DD/YYYY"));
    this.dateEnd = this.dateInit;
    console.log('time',new Date('12/03/2018'));
    this.timeInit = new Date('12/03/2018 00:00');
    this.timeEnd = new Date('12/03/2018 23:59');
    // this.timeInit = '00:00';

    console.log('funcion on init');
		console.log(this.reportType);
		this.spinnerOptions = true;

    this.http.get<any>(environment.apiUrl + '/api/zone').subscribe({
      next: data => {
        this.zones = data.data;
        console.log("zonas", this.zones);
        this.areZonesLoaded = true;
        this.endInit();
      },
      error: () => {
        console.log('Fallo al obtener zonas');
        this.errorFlag++;
        this.endInit();
      }
    });

    this.http.get(environment.apiUrl + '/api/userId').subscribe({
      next: data => {
        this.userId = parseInt(JSON.stringify(data));
        this.reportService.setUserId(this.userId);
        console.log("user ID", this.userId);
        this.isUserIdLoaded = true;

        // ================= CAMPO PARA COLOCAR LOS REPORTES =========================
        // this.reports = [
        //   {id : 0, value : 'REPORTE DE PARADAS Y MOVIMIENTOS', url: '/api/reports/paradas_movimientos'},
        //   {id : 1, value : 'REPORTE DE EXCESOS DE VELOCIDAD', url: '/api/reports/exceso_velocidad'},
        // ];



        // ================= CAMPO PARA COLOCAR LOS REPORTES =========================

        this.endInit();
      },
      error: () => {
        console.log('Fallo al obtener userId');
        this.errorFlag++;
        this.endInit();
      }
    });

    if(this.browserDetectorService.isChromium()){
      if(this.browserDetectorService.isOpera()){
        this.isOpera = true;
      } else if (this.browserDetectorService.isChEdge()) {
        this.isEdge = true;
      } else {
        this.isChrome = true;
      }
      this.popupDialogPosition = 'top-right';
      this.popupDialogInlineStyle = {'width': '20vw', 'min-width': '275px', 'max-width': '325px'};
    } else if (this.browserDetectorService.isFirefox()){
      this.isFirefox = true;
      this.popupDialogPosition = 'top-left';
      this.popupDialogInlineStyle = {'width': '45vw', 'min-width': '275px', 'max-width': '550px'};
    } else if (this.browserDetectorService.isSafari()){
      console.log('arrives here');
      this.isSafari = true;
      this.popupDialogPosition = 'top';
      this.popupDialogInlineStyle = {'width': '40vw', 'min-width': '225px'};
    } else {
      this.unknownBrowser = true;
      this.popupDialogPosition = 'center';
      this.popupDialogInlineStyle = {'width': '50vw', 'min-width': '275px', 'max-width': '550px'};
    }

    console.log("Es chrome ? " + this.isChrome);
    console.log("Es opera ? " + this.isOpera);
    console.log("Es IE edge ? " + this.isIEEdge);
    console.log("Es Ch Edge ? " + this.isEdge);
    console.log("Es firefox ? " + this.isFirefox);
    console.log("Es safari ? " + this.isSafari);


      //this.reportService.eC = this.eC;

    	// // console.log("fnc_direccion--xDs");
			// var f = new google.maps.Geocoder();
			// // var h = new google.maps.LatLng(trama.lat, trama.lng);
			// var h = new google.maps.LatLng(-16.406578,-71.560808);

			// f.geocode({
			// 		'latLng': h
			// },  (a:any, b:any) => {
			// 		console.log("*********************1");
			// 		console.log(a);
			// 		console.log(b);
			// 		console.log("*********************2");
			// 		if (b == "REQUEST_DENIED") {
			// 			// vm.chkApiGoogle = false;
			// 		} else {
      //       this.reportService.setApiGoogle(true);
			// 		}
			// });


  }

  updateCheckDefaultEvents() {
    // Itera sobre las propiedades del objeto evCheckDefault si existe
    if (this.evCheckDefault) {
      for (const index in this.evCheckDefault) {
        const eventsToUpdate = this.events.find((ev: { name_form: string; }) => ev.name_form == index);
        if (eventsToUpdate) {
          eventsToUpdate.active = true;
        }
      }
      this.onChangeChkEvents();
    }
  }
  
  onSelectAllChange(type: any): void {
    const filteredEvents = this.events.filter((event: { event_category: any; }) => event.event_category === type.name);
    for (const event of filteredEvents) {
      event.active = type.selectAll;
    }
    this.onChangeChkEvents();
  }
  
  updateShowTypeEvents() {
    this.events.forEach((event: any) => {
      const eventsTypesToUpdate = this.eventsTypes.find(type => type.name === event.event_category);
      if (eventsTypesToUpdate) {
        eventsTypesToUpdate.active = true;
      }
    });
    console.log('test types -->',this.eventsTypes,this.events);
  }
  endInit(){
    if(this.errorFlag == 1){
      this.spinner.hide("fullScreenSpinner");
      console.log('Hubo un error al obtener los datos');
      Swal.fire({
        title: 'Error',
        text: `Hubo un error al obtener la información. Por favor, actualiza la página`,
        icon: 'error',
        allowOutsideClick: false,
        confirmButtonText: 'Actualizar Página',
      }).then((data) => {
        if (data.isConfirmed) {
          this.spinner.show('reloadSpinner');
          window.location.reload();
        }
      });
      return;
    }
    if(this.errorFlag == 0 && this.areVehiclesLoaded && this.areZonesLoaded && this.isUserIdLoaded){
      this.isEverythingLoaded = true;
      this.spinner.hide("fullScreenSpinner");
      this.fullScreenSpinnerMsg = '';
    }
  }
  //funciones para operaciones / grupos / convoys

  onOptionSelected(){
    
    let aux: any[] = [];
    aux = this.vehicleService.vehicles
    for (const vehicle of aux) {
      const id_operation = vehicle.idoperation;
      // const id_grupo = vehicle.idgrupo;
      // const id_convoy = vehicle.idconvoy;
      const filteredOperation = {
        idoperation: vehicle.idoperation,
        nameoperation: vehicle.nameoperation,
      };
      // const filteredConvoy = {
      //   idconvoy: vehicle.idconvoy,
      //   nameconvoy: vehicle.nameconvoy,
      //   idgrupo: vehicle.idgrupo,
      //   namegrupo: vehicle.namegrupo,
      //   idoperation: vehicle.idoperation,
      //   nameoperation: vehicle.nameoperation,
      // };
      // const filteredGroup = {
      //   idgrupo: vehicle.idgrupo,
      //   namegrupo: vehicle.namegrupo,
      //   idoperation: vehicle.idoperation,
      //   nameoperation: vehicle.nameoperation,
      // };
      if (!this.operations.some((op:any) => op.idoperation === id_operation)) {
        this.operations.push(filteredOperation);
      }
      // if (!this.convoys.some((cv:any) => cv.idconvoy === id_convoy)) {
      //   this.convoys.push(filteredConvoy);
      // }
      // if (!this.groups.some((gp:any) => gp.idgrupo === id_grupo)) {
      //   this.groups.push(filteredGroup);
      // }
    }
    this.operations.sort((a: { idoperation: number; }, b: { idoperation: number; }) => a.idoperation - b.idoperation);
    // this.groups.sort((a: { idgrupo: number; }, b: { idgrupo: number; }) => a.idgrupo - b.idgrupo);
    // this.convoys.sort((a: { idconvoy: number; }, b: { idconvoy: number; }) => a.idconvoy - b.idconvoy);
    console.log('Operations: ',this.operations);
    // console.log('Convoys: ',this.convoys);
    // console.log('Groups: ',this.groups);

    //actualizar lista de vehiculos
    this.vehicles = this.vehicleService.vehicles;
    this.disabledGroup = true;
    this.disabledConvoy = true;
    this.groups = [];
    this.convoys = [];
    this.selectedOperation = '';
    this.selectedGroup = '';
    this.selectedConvoy = '';
    this.placeholderOperation = 'Seleccione una Operación ...';
    this.placeholderGroup = 'Seleccione una Operación Primero...';
    this.placeholderConvoy = 'Seleccione una Operación Primero...';
  }
  onChangeOperation(){
    this.selectedGroup = '';
    this.selectedConvoy = '';
    this.groups = [];
    this.convoys = [];
    this.vehicles = [];
    this.selectedVehicles = [];
    let aux:any[] =[];
    let aux2:any[] =[];
    
    if (this.listOptionCheckbox == 'grupo' || this.listOptionCheckbox == 'convoy'){
       //filtrar grupos en base a operacion seleccionada
      aux = this.vehicleService.vehicles.filter((gp:any) => gp.idoperation==this.selectedOperation);
      for (const vehicle of aux) {
        const id_grupo = vehicle.idgrupo;
        const filteredGroup = {
          idgrupo: vehicle.idgrupo,
          namegrupo: vehicle.namegrupo,
          idconvoy: vehicle.idconvoy,
          nameconvoy: vehicle.nameconvoy,
          idoperation: vehicle.idoperation,
          nameoperation: vehicle.nameoperation,
        };
        if (!this.groups.some((gp:any) => gp.idgrupo === id_grupo)) {
          this.groups.push(filteredGroup);
        }
      }
      this.groups.sort((a: { idgrupo: number; }, b: { idgrupo: number; }) => a.idgrupo - b.idgrupo);

      this.disabledGroup = false;
      this.placeholderGroup = 'Seleccione un Grupo...';
      this.placeholderConvoy = 'Seleccione un Grupo Primero...';
    }
    //filtrar vehiculos
    aux2 = this.vehicleService.vehicles.filter((vh:any) => vh.idoperation == this.selectedOperation);
    this.vehicles = aux2;

    this.chkAllVehicles = false;
    this.showChkSimultaneousTables = this.vehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1;
  
    console.log('Groups: ',this.groups);
    console.log('Vehicles: ',this.vehicles);

  }
  onChangeGroup(){
    this.selectedConvoy = '';
    this.convoys = [];
    this.vehicles = [];
    this.selectedVehicles = [];

    let aux:any[] =[];
    let aux2:any[] =[];
    
    if (this.listOptionCheckbox == 'convoy'){
       //filtrar grupos en base a operacion seleccionada
      aux = this.vehicleService.vehicles.filter((cv:any) => cv.idgrupo==this.selectedGroup && cv.idoperation == this.selectedOperation);
      for (const vehicle of aux) {
        const id_convoy = vehicle.idconvoy;
        const filteredGroup = {
          idgrupo: vehicle.idgrupo,
          namegrupo: vehicle.namegrupo,
          idconvoy: vehicle.idconvoy,
          nameconvoy: vehicle.nameconvoy,
        };
        if (!this.convoys.some((cv:any) =>cv.idconvoy === id_convoy)) {
          this.convoys.push(filteredGroup);
        }
      }
      this.disabledConvoy = false;
      this.placeholderConvoy = 'Seleccione un Convoy..';
      this.convoys.sort((a: { idconvoy: number; }, b: { idconvoy: number; }) => a.idconvoy - b.idconvoy);
    }

    //filtrar vehiculos
    aux2 = this.vehicleService.vehicles.filter((vh:any) => vh.idgrupo == this.selectedGroup && vh.idoperation == this.selectedOperation);
    this.vehicles = aux2;
    // for (const vehicle of aux2) {
    //   const id_operation = vehicle.idoperation;

    //   if (!this.vehicles.some((vh:any) => vh.idoperation === id_operation)) {
    //     this.vehicles.push(vehicle);
    //   }
    // }
    this.chkAllVehicles = false;
    this.showChkSimultaneousTables = this.vehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1;
  
    console.log('Convoys: ',this.convoys);
    console.log('Vehicles: ',this.vehicles);
  }
  onChangeConvoy(){
    this.vehicles = [];
    this.selectedVehicles = [];
    let aux:any[] =[];
    aux = this.vehicleService.vehicles.filter((vh:any) => vh.idconvoy == this.selectedConvoy && vh.idgrupo == this.selectedGroup && vh.idoperation == this.selectedOperation);
    this.vehicles = aux;

    this.chkAllVehicles = false;
    this.showChkSimultaneousTables = this.vehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1;
  
    console.log('Vehicles: ',this.vehicles);
  }

  selectAllVehicles(){
    this.selectedVehicles = this.chkAllVehicles? this.vehicles: [];
    this.onSelectedVehiclesChange();
  }

  selectAllZones(){
    this.selectedZones = this.chkAllZones? this.zones.map((zone: { id: any; }) => { return zone.id}): [];
  }

  

  getConfirm() {
    this.isFormFilled = false;
    Swal.fire({
      // title: 'Título de la Alerta',
      text: '¿Desea generar el reporte en una nueva ventana?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#30a9d9',
      cancelButtonText: 'No',
      cancelButtonColor: '#e3e3e3',
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('Sí');
        this.fullScreenSpinnerMsg = 'Generando Reporte...';
        this.spinner.show("fullScreenSpinner");
        console.log("Se acepta una nueva hoja");
        console.log('Cargando...');
        this.reportar(false);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // console.log('No');
        this.spinner.show("reportSpinner");
        console.log("Reporte en la misma hoja");
        this.reportar();
      } else {
        //CUANDO ES ESC O X
        console.log('Cancel');
        this.isFormFilled = true;
      }
    });
  }

  confirm() {
    this.isFormFilled = false;
    this.confirmationService.confirm({
        key: 'newTabConfirmation',
        /* header: 'Confirmación',
        acceptLabel: 'Sí',
        rejectLabel: 'No', */
        message: '¿Desea generar el reporte en una nueva ventana?',
        reject: () => {
          this.spinner.show("reportSpinner");
          console.log("Reporte en la misma hoja");
          this.reportar();
        },
        accept: () => {
          this.fullScreenSpinnerMsg = 'Generando Reporte...';
          this.spinner.show("fullScreenSpinner");
            console.log("Se acepta una nueva hoja");
            console.log('Cargando...');
            //undefined o true reportan en la misma pestaña. false reporta en nueva pestaña
            this.reportar(false);
        }
    });
  }

  reportar(new_tab?: any){

    this.reportService.eC = JSON.parse(JSON.stringify(this.eC));

    console.log(new_tab !== undefined);
    this.reportService.workingOnReport = true;

    var repSubtitle = '';
    var chkDateHour = this.chkDateHour;
    var chkFatigaSomnolencia = this.chkFatigaSomnolencia;
    var chkFatigaDistraccion = this.chkFatigaDistraccion;

    var chkDuracion = this.checkboxDuration;
    var chkOdomV = this.chkOdomVirtual;
    var chkFrenada = this.chkFrenada;
    var chkAceleracion = this.chkAceleracion;


    var f1 = moment(new Date(this.dateInit));
		var f2 = moment(new Date(this.dateEnd));
		var h1 = moment(new Date(this.timeInit));
		var h2 = moment(new Date(this.timeEnd));

    var cv:boolean;

    // ------ SI SE SELECCIONA UN CONVOY, SE PROCEDERA A PASAR CREAR EL ARRAY DE LOS VEHICULOS PERTENECIENTES A DICHO CONVOY.
    if(!this.checkboxGroup && !_.isEmpty(this.selectedConvoy) && this.selectedConvoy){
      cv = true;
      repSubtitle = 'CONVOY: ' + this.selectedConvoy;
      var convoyOrGroupArr = this.vehicles.filter((vehicle: { convoy: any; }) => vehicle.convoy == this.selectedConvoy);
      console.log(repSubtitle, convoyOrGroupArr);
    } else if (this.checkboxGroup && !_.isEmpty(this.selectedGroup) && this.selectedGroup) {
      cv = true;
      repSubtitle = 'GRUPO: ' + this.selectedGroup;
      var convoyOrGroupArr = this.vehicles.filter((vehicle: { grupo: any; }) => vehicle.grupo == this.selectedGroup);
      console.log(repSubtitle, convoyOrGroupArr);
    } else {
      repSubtitle = 'VEHÍCULOS';
      cv = false;
      console.log(this.selectedVehicles);
    }




    var M1 = f1.format("YYYY-MM-DD") + 'T' + h1.format("HH:mm") + ':00-05:00';
		var M2 = f2.format("YYYY-MM-DD") + 'T' + h2.format("HH:mm") + ':00-05:00';
    var M1_t = f1.format("YYYY-MM-DD") + ' ' + h1.format("HH:mm:00");
		var M2_t = f2.format("YYYY-MM-DD") + ' ' + h2.format("HH:mm:00");
    /* var M1 = f1.format("YYYY-MM-DD") + 'T' + this.timeInit + ':00-05:00';
		var M2 = f2.format("YYYY-MM-DD") + 'T' + this.timeEnd + ':00-05:00'; */
/* 		var M1_t = f1.format("YYYY-MM-DD") + ' ' + this.timeInit + ':00';
		var M2_t = f2.format("YYYY-MM-DD") + ' ' + this.timeEnd + ':00'; */

		var diffTime = moment( new Date( M2 ) ).diff( new Date( M1 ) );
		var duration = moment.duration(diffTime);
		var years = duration.years(),
			days = duration.days(),
			hrs = duration.hours(),
		  mins = duration.minutes(),
		  secs = duration.seconds();
		var D1 = ( days * 24 + hrs ) + ":" + (mins>9? mins:"0"+mins) + ":" + (secs>9? secs:"0"+secs);

    //Opciones a incluir en el reporte
    //oG checkboxes
    var oG: any=[];

    //eventos a incluir en el reporte
    //eV checkboxes
    //var eV: any=[];

    //selectedZone[i].id
    //var zonesArr: any=[];

    let reportSelect = _.find(this.reports, (rep:any) => { if (rep.codigo == this.selectedReport) { return true;} else {return false} });  
    console.log(reportSelect);
    
    if(cv){
      //Convoy o grupo seleccionado
      var param = {
        fecha_actual:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
				fecha_desde:M1,
        fecha_hasta:M2, // --N
				vehiculos: JSON.stringify(convoyOrGroupArr),
        grupo:this.selectedConvoy,
        zonas:JSON.stringify(this.selectedZones),
				url: reportSelect.url, //this.reports[this.selectedReport].url,
        limitVel: !chkDuracion? this.limitSpeed: false,
        minimDur: chkDuracion? this.minimDur: false,
        chkOdomV: chkOdomV,
				og: JSON.stringify([this.oG]),
				ev: JSON.stringify([this.eV]),
        ec: JSON.stringify([this.eC]),
				chkStops: this.chkStops,
				chkMovements: this.chkMovements,
				chkTrans1min: this.chkTrans1min,
				chkFatigaSomnolencia: this.chkFatigaSomnolencia,
				chkFatigaDistraccion: this.chkFatigaDistraccion,
				chkFrenada: this.chkFrenada,
				chkAceleracion: this.chkAceleracion,
				limit : true,
				numRep: reportSelect.codigo,//this.reports[this.selectedReport].codigo,//this.reports[this.selectedReport].id,
      }
    } else {
      var param = {
        fecha_actual:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        fecha_desde:M1,
        fecha_hasta:M2, // --N
        //vehiculos: JSON.stringify(vm.selectedVehicle), grupos:vm.selectedConvoy, zonas:JSON.stringify(array_zona),
        vehiculos: JSON.stringify(this.selectedVehicles),
        grupo: this.selectedConvoy,
        zonas: JSON.stringify(this.selectedZones),
        url: reportSelect.url, //this.reports[this.selectedReport].url,
        limitVel: !chkDuracion? this.limitSpeed: false,
        minimDur: chkDuracion? this.minimDur: false,
        chkOdomV: chkOdomV,
        og: JSON.stringify([this.oG]),
        ev: JSON.stringify([this.eV]),
        ec: JSON.stringify([this.eC]),
        chkStops: this.chkStops,
        chkMovements: this.chkMovements,
        chkTrans1min: this.chkTrans1min,
        chkFatigaSomnolencia: this.chkFatigaSomnolencia,
        chkFatigaDistraccion: this.chkFatigaDistraccion,
        chkFrenada: this.chkFrenada,
        chkAceleracion: this.chkAceleracion,
        limit : true,
        numRep: reportSelect.codigo, //this.reports[this.selectedReport].codigo,//this.reports[this.selectedReport].id,
      };
    }

    //console.log(param);
    console.log('Proceso iniciado a las: ', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    console.log(param);


    //CONFIGURACION DE TITULOS  
    var repTitle = reportSelect.value;


    if (param.numRep == 'R012' || param.numRep == 'R022') {
      //REPORTE DE DISTRACIÓN Y POSIBLE FATIGA
      if (chkFatigaSomnolencia && chkFatigaDistraccion) {
        repTitle = reportSelect.value;
      } else {
        if (chkFatigaSomnolencia) {
          repTitle = 'REPORTE DE POSIBLE FATIGA';
        }
        if (chkFatigaDistraccion) {
          repTitle = 'REPORTE DE DISTRACIÓN';
        }
      }

    } else if(param.numRep == 'R011') {
      //REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)
      if (chkFrenada && chkAceleracion) {
        repTitle = reportSelect.value;
      } else {
        if (chkFrenada) {
          repTitle = 'REPORTE DE FRENADA BRUSCA';
        }
        if (chkAceleracion) {
          repTitle = 'REPORTE DE ACELERACIÓN BRUSCA';
        }
      }

    } else {
      repTitle = reportSelect.value;
    }
    console.log('API: ',environment.apiUrl + param.url, param);
    this.http.post(environment.apiUrl + param.url, param).subscribe({
      next: data => {
        //console.log(this.selectedConvoy.length);
        //console.log(this.selectedGroup.length);
        //console.log(this.selectedVehicles.length);
        console.log(typeof data);
        console.log(data);
        this.reportService.setDatos(data);
        this.reportService.setParams(param);
        // console.log("MODAL ACTIVATE");
        // this.reportService.modalActive = true;
        this.setNameDriver(data);
        var report_data = {
          data: data,
          numRep: param.numRep, // codigo
          repSubtitle: repSubtitle,
          chkDateHour: chkDateHour,
          chkFatigaSomnolencia: chkFatigaSomnolencia,
          chkFatigaDistraccion: chkFatigaDistraccion,
          chkFrenada: chkFrenada,
          chkAceleracion: chkAceleracion,

          chkDuracion: chkDuracion,
          chkOdomV: chkOdomV,
          repTitle: repTitle, //reportSelect.value, //this.reports[param.numRep].value,
          period: M1_t + ' - ' + M2_t,
          isVehicleReport: !cv,
          chkTableDropdown: !this.chkSimultaneousTables,
          params : this.reportService.getParams(),
        }
        if(new_tab === undefined || new_tab == true){
          //Report in the same tab
          this.reportService.showReport.emit(report_data);
          this.isFormFilled = true;
        } else {
          //Report in new tab
          this.spinner.hide("fullScreenSpinner");
          this.reportService.workingOnReport = false;
          this.isFormFilled = true;
          console.log('Se abrió una nueva pestaña');
          localStorage.setItem("report_data", JSON.stringify(report_data));
          var report_tab = window.open('/reports/result');
          if(report_tab == null){
            this.showBlockedTabDialog = true;
            /* this.toastr.error('', 'No se pudo reportar en nueva pestaña', {
              timeOut: 5000,
            }); */
          } else {
            this.toastr.success('', 'Reporte en nueva pestaña exitoso', {
              timeOut: 5000,
            });
          }
        }
      },
      error: (err) => {
        console.log(err);
        //console.log('Hubo un error al procesar la solicitud');
        this.spinner.hide("reportSpinner");
        Swal.fire({
          title: 'Error',
          text: `Hubo un error al generar el reporte.
          Por favor, actualiza la página`,
          icon: 'error',
          allowOutsideClick: false,
          confirmButtonText: 'Actualizar Página',
        }).then((data) => {
          if (data.isConfirmed) {
            this.spinner.show('reloadSpinner');
            window.location.reload();
          }
        });
      }
    });
  }

  setNameDriver(data:any){
    //PARA REPORTES R008 - POSICION
    if (this.selectedReport == 'R008'){
      //PARA REPORTES QUE SOLO TIENEN UN ARRAY
      for(let index of data){
        // console.log(index);
        if(index.conductor == 0){
          index.conductor = 'No Especificado';
        }else{
          if(index.conductor != '-' && index.conductor){
            const nameDriver = this.driversService.getDriverById(index.conductor)
            if(nameDriver!='No Especificado'){
              index.conductor = nameDriver;
            }else{
              index.conductor = '-';
            }
          }
        }
        if(index.idConductor != '-' && index.idConductor){ //OBTIENE LA IBUTTON COMPLETA
          index.idConductor = this.driversService.getIbutton(index.idConductor);
        }
      }
    }else if(this.selectedReport == 'R037' || this.selectedReport == 'R038' || 
      this.selectedReport=='R040' || this.selectedReport == 'R039' || this.selectedReport == 'R020'){
      //PARA REPORTES QUE SOLO TIENEN DOS ARRAY
      //PARA REPORTES QUE TIENEN CONDUCTOR Y IDCONDUCTOR
      for(let index of data){
        for (let subindex of index[1]) {
          // console.log(subindex);
          if(subindex.conductor == 0){
            subindex.conductor = '-';
          }else{
            const nameDriver = this.driversService.getDriverById(subindex.conductor)
            if(nameDriver == 'No Especificado'){
              subindex.conductor = '-';
            }else{
              subindex.conductor = nameDriver;
            }
          }
          if(subindex.idConductor != '-' && subindex.idConductor){ //OBTIENE LA IBUTTON COMPLETA
            subindex.idConductor = this.driversService.getIbutton(subindex.idConductor);
            if(subindex.conductor == '-'){
              subindex.conductor = 'No Especificado';
            }
          }else{
            subindex.idConductor = '-';
          }
          // console.log('SUBINDEX IDCONDUCTOR',subindex.idConductor);
        }
      }
    }else{
      //NO MUESTRA CONDUCTOR...
    }
  }
  
  changedReport(){
    console.log(this.selectedReport);
    console.log(typeof this.selectedReport);

    //this.titleService.setTitle(this.reports[this.selectedReport].value);
    this.showSubLimitTime = true;

		this.showCard = false; //Div que contiene [ showExcVelOpt - showMovStop - showZones - showCheckboxs ]
		this.showExcVelOpt = false; //Limite de velocidad
    this.showOdomOpt = false; // Combustible
		this.showZones = false; // Seleccionador de geocercas
		this.showCheckboxs = false;// Opciones reporte general
    this.showCheckboxsCipia = false;// Opciones reporte general CIPIA
		this.showMovStop = false; //Ver Paradas y Movimiento
		this.showDivHorizontal = false; // Nombre de cabecera del reporte
		this.showLimitTime = false; //Configuracion de rango de tiempo -- true la mayoria
		this.showEvents = false; //Configuracion
    this.showEventsCipia = false; //Configuracion
    this.showAtencionEventsCipia = false;
		this.showTrans1min = false; //Configuracion de duracion de parada >1min
		this.showFatigaOp = false; //Configuracion de opcion de fatiga 2
		this.showBrakeAccel = false; //Configuración Aceleracion y frenada
    this.showFatigaDistraccion = false; //Configuracion Distraccion y posible fatiga
		/* this.showTimeLlegada = false;
		this.showTimePeriodoDia = false; */
    
    let aux_convoy = this.vehicles.filter((vehicle: { idconvoy: any; }) => vehicle.idconvoy == this.selectedConvoy);
    let aux_group = this.vehicles.filter((vehicle: { idgrupo: any; }) => vehicle.idgrupo == this.selectedGroup);

    this.showChkSimultaneousTables = 
      (this.selectedVehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1) || 
      (aux_convoy.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1) ||
      (aux_group.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1);
    
    // this.showChkSimultaneousTables = this.selectedVehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1

    switch(this.selectedReport){
      case 'R001': // 0 - R001	REPORTE DE PARADAS Y MOVIMIENTOS
        this.showMovStop = true;
        this.showLimitTime = true;
        break;
      case 'R002': // 1 - R002	REPORTE DE EXCESOS DE VELOCIDAD
        this.showExcVelOpt = true;
        this.showLimitTime = true;
        break;
      case 'R003': // 2 - R003	REPORTE DE ENTRADA Y SALIDA
        this.showZones = true;
        this.showLimitTime = true;
        break;
      case 'R004': // 3 - R004	REPORTE DE COMBUSTIBLE
        this.showLimitTime = true;
        this.showOdomOpt = true;
        break;
      case 'R005': // 4 - R005	REPORTE DE EXCESOS EN ZONA
        this.showLimitTime = true;
        break;
      case 'R006': // 5 - R006	REPORTE GENERAL
        this.showLimitTime = true;
        this.showCheckboxs = true;
        break;
      case 'R007': // 6 - R007	REPORTE DE EVENTOS
        this.showLimitTime = true;
        this.showEvents = true;
        break;
      case 'R008': // 7 - R008	REPORTE DE POSICIÓN
        break;
      case 'R011':  // 10 -R011	REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)
        this.showLimitTime = true;
        this.showBrakeAccel = true;
        break;
      case 'R012': // 11 -R012	REPORTE DE DISTRACIÓN Y POSIBLE FATIGA
        this.showLimitTime = true;
        this.showFatigaDistraccion = true;
        break;
      case 'R013': // 12 -R013	REPORTE DE CALIFICACION DE MANEJO
        this.showLimitTime = true;
        break;
      case 'R014':  // 13 -R014	REPORTE DE FATIGA EXTREMA
        this.showLimitTime = true;
        break;
      case 'R015':  // 14 -R015	REPORTE DE ANTICOLISIÓN FRONTAL
      case 'R016':  // 15 -R016	REPORTE DE COLISIÓN CON PEATONES
      case 'R017':  // 16 -R017	REPORTE DE DESVÍO DE CARRIL HACIA LA IZQUIERDA
      case 'R018':  // 17 -R018	REPORTE DE DESVÍO DE CARRIL HACIA LA DERECHA
      case 'R019':  // 18 -R019	REPORTE DE BLOQUEO DE VISIÓN DE MOBILEYE
      case 'R020':  // 19 -R020	REPORTE GERENCIAL (Cuenta cruzdelsur)
      case 'R021':  // 20 -R021	REPORTE DE EXCESOS DE VELOCIDAD (FORMATO EXTENDIDO)
      case 'R022':  // 21 -R022	REPORTE DE SOMNOLENCIA Y/O DISTRACCIÓN - PROLOINT
      case 'R023':  // 22 -R023	REPORTE DE MANTENIMIENTO FISICO
      case 'R024':  //    -R024	REPORTE DE NO ROSTRO
      case 'R025':  //    -R025 NEW 1
      case 'R026':  //    -R026 NEW 2
      case 'R027':  //    -
      case 'R028':  //    -
      case 'R029':  //    -
      case 'R030':  //    -
      case 'R031':  //    -
      case 'R032':  //    -
          this.showLimitTime = true;
				break;
      case 'R033':  //    -
          this.showZones = true;
        break;
      case 'R034':  //    -
      case 'R035':  //    -
          //this.showZones = true;
      break;
      case 'R036':  //   - R036	REPORTE GENERAL CIPIA
          this.showLimitTime = true;
          this.showCheckboxsCipia = true;
          // this.showCheckboxs = true;
      break;
      case 'R037':  //   - R037	REPORTE DE EVENTOS CIPIA
          this.showLimitTime = true;
          this.showEventsCipia = true;
          // this.showEvents = true;

          this.eC = {
            Fecha :true,
            FechaServidor :false,
            Evento :true,
            Codigo :true,
            Placa :true,
            TipoUnidad :true,
            IdConductor :true,
            Conductor :true,
        
            FechaEvaluacion : false,
            CriterioEvaluacion : false,
            Observacion : false,
            Validacion: false,
        
            VelMobileye :false,
            VelGPS :true,
            VelCAN :false,
            VelECO :false,
            VelGPSspeed :false,
        
            Zona :true,
            PuntoCercano :true,
            Ubicacion :true,
            Referencia :false,
            EnlaceArchivo :false,
            Parametros : false,
        
            OperadorMonitoreo : false,  // R. Atención de Eventos
          }

      break;
      case 'R038':  //   - R038	REPORTE DE ATENCION DE EVENTOS CIPIA
          this.showLimitTime = true;
          this.showAtencionEventsCipia = true;
          // this.showEvents = true;
          this.updateCheckDefaultEvents();
          this.eC = {
            Fecha :true,
            FechaServidor :true,
            Evento :true,
            Codigo :true,
            Placa :true,
            TipoUnidad :true,
            IdConductor :true,
            Conductor :true,
        
            FechaEvaluacion : true,
            CriterioEvaluacion : true,
            Observacion : true,
            Validacion: true,
        
            VelMobileye :false,
            VelGPS :true,
            VelCAN :true,
            VelECO :false,
            VelGPSspeed :false,
        
            Zona :true,
            PuntoCercano :true,
            Ubicacion :true,
            Referencia :true,
            EnlaceArchivo :false,
            Parametros : false,
        
            OperadorMonitoreo : true,  // R. Atención de Eventos
          }

      break;
      case 'R039': //  - R039	REPORTE DE EXCESOS DE VELOCIDAD (NUEVO FORMATO)
        this.showLimitTime = true;
      break;
      case 'R040':  //   - R040	REPORTE DE EVENTOS CIPIA INTERNO
          this.showLimitTime = true;
          this.showEventsCipia = true;
          // this.showEvents = true;

          this.eC = {
            Fecha :true,
            FechaServidor :false,
            Evento :true,
            Codigo :true,
            Placa :true,
            TipoUnidad :true,
            IdConductor :true,
            Conductor :true,
        
            FechaEvaluacion : false,
            CriterioEvaluacion : false,
            Observacion : false,
            Validacion: false,
        
            VelMobileye :false,
            VelGPS :true,
            VelCAN :false,
            VelECO :false,
            VelGPSspeed :false,
        
            Zona :true,
            PuntoCercano :true,
            Ubicacion :true,
            Referencia :false,
            EnlaceArchivo :false,
            Parametros : false,
        
            OperadorMonitoreo : false,  // R. Atención de Eventos
          }

      break;

      default: break;
    }
    /*  console.log(Object.keys(this.reports[this.selectedReport]).length === 0);
    console.log(_.isEmpty(this.reports[this.selectedReport])); */
    console.log(_.isEmpty(this.selectedReport));
    console.log(this.selectedReport);
    console.log(typeof this.selectedReport);
    console.log("Selected report", this.selectedReport);
    // console.log("Grupo", this.checkboxGroup && !_.isEmpty(this.selectedGroup) && this.selectedGroup);
    // console.log("Convoy", !this.checkboxGroup && !_.isEmpty(this.selectedConvoy) && this.selectedConvoy);
    console.log("Vehiculos en el Convoy", this.vehicles.filter((vehicle: { nameconvoy: any; }) => vehicle.nameconvoy == this.selectedConvoy));
    console.log("Selected Vehicles", this.selectedVehicles);

  }

  dismissBlockedTabDialog(){
    this.showBlockedTabDialog = false;
    this.toastr.error('', 'No se pudo reportar en nueva pestaña', {
      timeOut: 5000,
    });
  }

  onSelectedVehiclesChange(){
    // this.selectedConvoy = {};
    // this.selectedGroup = {};
    this.chkAllVehicles = this.selectedVehicles.length == this.vehicles.length;
    this.showChkSimultaneousTables = this.selectedVehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1;
  }

  onSelectedConvoyChange(){
    this.selectedVehicles = [];
    this.selectedGroup = {};
    this.chkAllVehicles = false;

    let aux_vehicles = this.vehicles.filter((vehicle: { convoy: any; }) => vehicle.convoy == this.selectedConvoy);
    this.showChkSimultaneousTables = aux_vehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1;
  }

  onSelectedGroupChange(){
    this.selectedVehicles = [];
    this.selectedConvoy = {};
    this.chkAllVehicles = false;

    let aux_vehicles = this.vehicles.filter((vehicle: { grupo: any; }) => vehicle.grupo == this.selectedGroup);
    this.showChkSimultaneousTables = aux_vehicles.length > 1 && this.singleTableReportIDs.indexOf(this.selectedReport) == -1;
  }

  onSelectedGeofenceschange(){
    this.chkAllZones = this.zones.length == this.selectedZones.length;
  }

  onChkDateHourChange(){
    console.log(this.chkDateHour);
    this.onTimeChange();
  }

  onTimeChange(){
    let date_init = parseInt(moment(this.dateInit).format('YYYYMMDD'));
    let date_end = parseInt(moment(this.dateEnd).format('YYYYMMDD'));
    let time_init = parseInt(moment(this.timeInit).format('HHmm'));
    let time_end = parseInt(moment(this.timeEnd).format('HHmm'));
    console.log('date init', parseInt(moment(this.dateInit).format('YYYYMMDD')));
    console.log('date end', this.dateEnd);
    console.log('time init', moment(new Date(this.timeInit)).format("HH:mm"));
    console.log('time end', this.timeEnd);
    if(this.dateInit != null && this.dateEnd != null && this.timeInit != null && this.timeEnd != null){
      console.log(date_init, date_end);
      console.log(time_init, time_end);
      if(date_init < date_end){
        this.areHoursValid = true;
        this.areDatesValid = true;
      } else if(date_init == date_end) {
        this.areHoursValid = time_init <= time_end;
        this.areDatesValid = this.areHoursValid;
      } else {
        this.areHoursValid = false;
        this.areDatesValid = false;
      }
    } else {
      this.areHoursValid = true;
      this.areDatesValid = false;
    }
    console.log(this.areHoursValid);
    console.log(this.areDatesValid);
  }

  onChkAllEvents(){
    // this.eV = {
    //   GPSbateriaBaja:this.eV.OtroTodos,
    //   GPSbateriaDesconectada:this.eV.OtroTodos,
    //   GPSaceleracionBrusca:this.eV.OtroTodos,
    //   GPSfrenadaBrusca:this.eV.OtroTodos,
    //   GPSbloqueoTransmision:this.eV.OtroTodos,
    //   GPSsos:this.eV.OtroTodos,
    //   GPSremolque:this.eV.OtroTodos,
    //   GPSparada: this.eV.OtroTodos, // --- NEW
    //   GPSmotorEncendido: this.eV.OtroTodos, // --- NEW
    //   GPSmotorApagado: this.eV.OtroTodos, // --- NEW

    //   GPSextremAceleracionBrusca:this.eV.OtroTodos, // --New aceleracion extremadamente brusca
    //   GPSextremFrenadaBrusca:this.eV.OtroTodos, // --NEW frenada extremadamente brusca
    //   GPSdriverDetected:this.eV.OtroTodos, // --NEW conductor identificado
    //   GPSdriverNotDetected:this.eV.OtroTodos, // --NEW conductor no identificado
    //   GPSmanipuled:this.eV.OtroTodos, // --NEW manipulacion de GPS
    //   GPSjamming:this.eV.OtroTodos, // --NEW jamming?
    //   GPSantenaOff:this.eV.OtroTodos, // --NEW antena gps desconectada

    //   // EVENTOS PLATAFORMA
    //   evEntrada:this.eV.OtroTodos,
    //   evSalida:this.eV.OtroTodos,
    //   evEstadia:this.eV.OtroTodos,   // --- NEW
    //   evParada:this.eV.OtroTodos,
    //   evMovSinProgramacion:this.eV.OtroTodos,  //  NEW
    //   evInfraccion:this.eV.OtroTodos,
    //   evExcesoDeVelocidad:this.eV.OtroTodos,

    //   //EVENTOS SEGURIDAD VEHICULAR
    //   evAnticolisionFrontal:this.eV.OtroTodos,
    //   evColisionConPeatones:this.eV.OtroTodos,

    //   evNoRostro:this.eV.OtroTodos,
    //   evFatigaExtrema:this.eV.OtroTodos,
    //   evDesvioCarrilIzquierda:this.eV.OtroTodos,
    //   evDesvioCarrilDerecha:this.eV.OtroTodos,
    //   evBloqueoVisionMobileye:this.eV.OtroTodos,

    //   AccFatiga:this.eV.OtroTodos, // DESACTIVADO
    //   AccAlcoholemia:this.eV.OtroTodos,
    //   AccIButton: this.eV.OtroTodos,  // --- DESACTIVADO
    //   AccSomnolencia: this.eV.OtroTodos,
    //   AccDistraccion: this.eV.OtroTodos,
    //   evVibracionSensorFatiga: this.eV.OtroTodos, //Vibración de Fatiga

    //   //EVENTOS SOLUCIONES MOVILES
    //   evDvrOperativo: this.eV.OtroTodos, //DVR Operativo
    //   evDvrInoperativo: this.eV.OtroTodos, //DVR Inoperativo

    //   OtroTodos:this.eV.OtroTodos,
    //   OtroExVelocidad:this.eV.OtroTodos,


    //   //==========================
    //   //EVENTOS FATIGA 360
    //   evConductorAdormitado360: this.eV.OtroTodos,
    //   evConductorSomnoliento360: this.eV.OtroTodos,
    //   evDistraccionDetectada360: this.eV.OtroTodos,
    //   evCinturonNoDetectado360: this.eV.OtroTodos,
    //   evCigarroDetectado: this.eV.OtroTodos,
    //   evCelularDetectado360: this.eV.OtroTodos,
    //   evErrorDeCamara: this.eV.OtroTodos,
    //   evDeteccionDeManipulacion360: this.eV.OtroTodos,

    //   evActualizacionEstadoGps360: this.eV.OtroTodos,// Actualización de Estado del Gps 360
    //   evActualizacionFwComplete360: this.eV.OtroTodos,// Actualizacion FW Completada 360
    //   evActualizacionFwFailed360:this.eV.OtroTodos,// Actualizacion FW Fallida 360
    //   evActualizacionFwStart360: this.eV.OtroTodos,// Actualizacion FW Iniciada 360
    //   evAdvertenciaCambioCarril360: this.eV.OtroTodos,// Advertencia de Cambio de Carril 360
    //   evColisionWithPeaton360: this.eV.OtroTodos,// Advertencia de Colisión con Peatones 360
    //   evColisionFrontal360: this.eV.OtroTodos,// Advertencia de Colisión Frontal 360
    //   evColisionFrontalUrbana360: this.eV.OtroTodos,// Advertencia de Colisión Frontal Urbana 360
    //   evCalibracionComplete360: this.eV.OtroTodos,// Calibracion Completada 360
    //   evCalibracionAcelerometro3D360: this.eV.OtroTodos,// Calibración del acelerómetro 3D completada 360
    //   evCalibracionFailed360: this.eV.OtroTodos,// Calibracion Fallida 360
    //   evChangeDriver360: this.eV.OtroTodos,// Cambio de Conductor 360
    //   evDriverIdUpdated360: this.eV.OtroTodos,// Conductor ID Actualizado 360
    //   evDriverIdentified360: this.eV.OtroTodos,// Conductor Identificado 360
    //   evDriverAusent360: this.eV.OtroTodos,// Conductor no detectado 360
    //   evDriverNotIdentified360: this.eV.OtroTodos,// Conductor No Identificado 360
      
    //   evErrorAplication360: this.eV.OtroTodos,// Error de aplicación 360
    //   evErrorSystem360: this.eV.OtroTodos,// Error del sistema 360
    //   evEventExterno360: this.eV.OtroTodos,// Evento Externo Solicitado 360
    //   evExcessVelocity360: this.eV.OtroTodos,// Exceso de Velocidad 360
    //   evFailedStartSystem360: this.eV.OtroTodos,// Fallo en Inicio del sistema 360
    //   evIgnicionOn360: this.eV.OtroTodos,// Ignición Activada 360
    //   evIgnicionOff360: this.eV.OtroTodos,// Ignición Desactivada 360
    //   evStartSystem360: this.eV.OtroTodos,// Inicio del sistema 360
    //   evMculog360: this.eV.OtroTodos,// MCULOG 360
    //   evReposoIn360: this.eV.OtroTodos,// Modo de Reposo Ingresado 360
    //   evMonitoreoAvance360: this.eV.OtroTodos,// Monitoreo y Advertencia de Avance 360
    //   evMovementStop360: this.eV.OtroTodos,// Movimiento Detenido 360
    //   evMovementStart360: this.eV.OtroTodos,// Movimiento Iniciado 360
    //   evSkipRedLight360: this.eV.OtroTodos,// Saltarse Semáforo en Rojo 360
    //   evSystemOk360: this.eV.OtroTodos,// Sistema OK 360
    //   evsystemReset360: this.eV.OtroTodos,// Sistema Reiniciado 360
    //   evStopIgnored:false,// Stop Desobedecido 360

    // };

    this.events.forEach((event: {name_form: any; active: boolean;}) => {
      event.active = this.eV.OtroTodos;
      this.eV[event.name_form] = event.active;
    });

    this.eventsTypes.forEach((type: {selectAll: boolean;}) => {
      type.selectAll = this.eV.OtroTodos;
    });
    console.log(this.eV);
  }

  onChangeChkEvents(){
  //   if(!this.eV.GPSbateriaDesconectada) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.GPSaceleracionBrusca) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.GPSfrenadaBrusca) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.GPSsos) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.GPSmotorEncendido) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.GPSmotorApagado) { this.eV.OtroTodos = false; return; }

  //   if(!this.eV.evEntrada) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evSalida) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evEstadia) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evParada) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evInfraccion) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evExcesoDeVelocidad) { this.eV.OtroTodos = false; return; }


  //   if(!this.eV.evNoRostro) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evFatigaExtrema) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.AccFatiga) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.AccDistraccion) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evAnticolisionFrontal) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evColisionConPeatones) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evDesvioCarrilIzquierda) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evDesvioCarrilDerecha) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evBloqueoVisionMobileye) { this.eV.OtroTodos = false; return; }

  //   //ULTIMOS CHANGES CIPIA
  //   if(!this.eV.evConductorAdormitado360) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evConductorSomnoliento360) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evDistraccionDetectada360) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evCinturonNoDetectado360) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evCigarroDetectado) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evCelularDetectado360) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evErrorDeCamara) { this.eV.OtroTodos = false; return; }
  //   if(!this.eV.evDeteccionDeManipulacion360) { this.eV.OtroTodos = false; return; }

  //   this.eV.OtroTodos = true;
  // Ahora, para actualizar this.ev con data de this.events:
  this.events.forEach((event: { name_form: string | number; active: boolean; }) => {
    this.eV[event.name_form] = event.active;
  });
  // Verificar si al menos un event.active es false
  const alMenosUnFalse = this.events.some((event: { active: boolean; }) => event.active === false);
  // Actualizar this.ev.OtroTodos
  this.eV.OtroTodos = !alMenosUnFalse;

  console.log(this.eV); 
    
  }

  validateForm(){
    var is_vehicle_selected = (this.selectedVehicles.length != 0 || JSON.stringify(this.selectedOperation) != '{}' || JSON.stringify(this.selectedConvoy) != '{}' || JSON.stringify(this.selectedGroup) != '{}');
    var is_zone_selected = this.selectedZones.length != 0;

    this.isFormFilled =
      (JSON.stringify(this.selectedReport) != '{}') &&
      this.areDatesValid &&
      (

        (this.selectedReport == 'R001' && is_vehicle_selected && (this.chkStops || this.chkMovements))
        ||
        (this.selectedReport == 'R002' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R003' && is_vehicle_selected && is_zone_selected)
        ||
        (this.selectedReport == 'R004' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R005' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R006' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R007' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R008' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R011' && is_vehicle_selected && (this.chkFrenada || this.chkAceleracion))
        ||
        (this.selectedReport == 'R012' && is_vehicle_selected && (this.chkFatigaDistraccion || this.chkFatigaSomnolencia))
        ||
        (this.selectedReport == 'R013' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R014' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R015' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R016' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R017' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R018' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R019' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R020' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R021' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R022' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R023' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R024' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R025' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R026' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R027' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R028' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R029' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R030' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R031' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R032' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R033')
        ||
        (this.selectedReport == 'R034')
        ||
        (this.selectedReport == 'R035')
        ||
        (this.selectedReport == 'R036' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R037' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R038' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R039' && is_vehicle_selected)
        ||
        (this.selectedReport == 'R040' && is_vehicle_selected)
      );
  }

  resetAllFields(){
    //Se solicitó que los vehículos no se reseteen.
    /* this.selectedVehicles =[];
    this.chkAllVehicles = false;
    this.selectedConvoy ={};
    this.selectedGroup ={};
    this.checkboxGroup  = false;
 */
    this.chkOdomVirtual = false;
    this.chkStops = false;
    this.chkMovements = false;
    this.chkFrenada = false;
    this.chkAceleracion = false;

    //0. Paradas y Movimientos
    this.chkStops = true;
	  this.chkMovements = true;

    //1. Exceso de velocidad
    this.checkboxDuration = false;
    this.minimDur = 15;
    this.limitSpeed = 90;

    //2. Entrada y Salida
    //Se solicitó que las geocercas no se reseteen.
    /* this.selectedZones = [];
    this.chkAllZones = false; */

    //3. Combustible
    this.chkOdomVirtual = false;
    this.odometroVirtual = 0;

    //4. Frenada y Acel Brusca
    this.chkFrenada = true;
	  this.chkAceleracion = true;

    //5. General
    this.oG = {
      DUOT2state:false, // --- NEW2
      RPMAlta:false,
      RxM:false,
      aBrusca:false,
      alcoholemia:false,
      altitud:false,
      angulo:false,
      cMotor:false,
      cRestante: false, // --- NEW
      fBrusca:false,
      fExBrusca:false,
      fServidor:false,   // --- NEW
      fatiga:false,
      cNivel:false,  //  NEW
      odometro:false,
      onOff:false,
      pCercano:false,
      parametros: false,  // --- NEW
      recFacial:false,
      referencia:false,
      ubicacion:false,
      velCAN:false,
      velECO:false,
      velGPS:false,
      velGPS_speed:false,
      velMobileye_ME460:false,
      //NEW 24-01
      alimentGps:false,
      nivelBateria:false,
      nivelCobertura:false,
      temperaturaGps:false,
      satelite:false,
    };

    
    //6. Eventos
    this.events.forEach((event: {name_form: any; active: boolean;}) => {
      event.active = false;
      this.eV[event.name_form] = false;
    });
    // this.eV = {
    //   GPSbateriaBaja:false,
    //   GPSbateriaDesconectada:false,
    //   GPSaceleracionBrusca:false,
    //   GPSfrenadaBrusca:false,
    //   GPSbloqueoTransmision:false,
    //   GPSsos:false,
    //   GPSremolque:false,
    //   GPSparada: false, // --- NEW
    //   GPSmotorEncendido: false, // --- NEW
    //   GPSmotorApagado: false, // --- NEW

    //   GPSextremAceleracionBrusca:false, // --New aceleracion extremadamente brusca
    //   GPSextremFrenadaBrusca:false, // --NEW frenada extremadamente brusca
    //   GPSdriverDetected:false, // --NEW conductor identificado
    //   GPSdriverNotDetected:false, // --NEW conductor no identificado
    //   GPSmanipuled:false, // --NEW manipulacion de GPS
    //   GPSjamming:false, // --NEW jamming?
    //   GPSantenaOff:false, // --NEW antena gps desconectada

    //   // EVENTOS PLATAFORMA
    //   evEntrada:false,
    //   evSalida:false,
    //   evEstadia:false,   // --- NEW
    //   evParada:false,
    //   evMovSinProgramacion:false,  //  NEW
    //   evInfraccion:false,
    //   evExcesoDeVelocidad:false,

    //   //EVENTOS SEGURIDAD VEHICULAR
    //   evAnticolisionFrontal:false,
    //   evColisionConPeatones:false,

    //   evNoRostro:false,
    //   evFatigaExtrema:false,
    //   evDesvioCarrilIzquierda:false,
    //   evDesvioCarrilDerecha:false,
    //   evBloqueoVisionMobileye:false,


    //   AccFatiga:false, // DESACTIVADO
    //   AccAlcoholemia:false,
    //   AccIButton: false,  // --- DESACTIVADO
    //   AccSomnolencia: false,
    //   AccDistraccion: false,
    //   evVibracionSensorFatiga: false, //Vibración de Fatiga
    //   OtroTodos:false,
    //   OtroExVelocidad:false,

    //   //EVENTOS SOLUCIONES MOVILES
    //   evDvrOperativo: false, //DVR Operativo
    //   evDvrInoperativo: false, //DVR Inoperativo
    //   //==========================
      
    //   evConductorAdormitado360:false,
    //   evConductorSomnoliento360:false,
    //   evDistraccionDetectada360:false,
    //   evCinturonNoDetectado360:false,
    //   evCigarroDetectado:false,
    //   evCelularDetectado360:false,
    //   evErrorDeCamara:false,
    //   evDeteccionDeManipulacion360:false,
      
    //   evActualizacionEstadoGps360:false,// Actualización de Estado del Gps 360
    //   evActualizacionFwComplete360:false,// Actualizacion FW Completada 360
    //   evActualizacionFwFailed360:false,// Actualizacion FW Fallida 360
    //   evActualizacionFwStart360:false,// Actualizacion FW Iniciada 360
    //   evAdvertenciaCambioCarril360:false,// Advertencia de Cambio de Carril 360
    //   evColisionWithPeaton360:false,// Advertencia de Colisión con Peatones 360
    //   evColisionFrontal360:false,// Advertencia de Colisión Frontal 360
    //   evColisionFrontalUrbana360:false,// Advertencia de Colisión Frontal Urbana 360
    //   evCalibracionComplete360:false,// Calibracion Completada 360
    //   evCalibracionAcelerometro3D360:false,// Calibración del acelerómetro 3D completada 360
    //   evCalibracionFailed360:false,// Calibracion Fallida 360
    //   evChangeDriver360:false,// Cambio de Conductor 360
    //   evDriverIdUpdated360:false,// Conductor ID Actualizado 360
    //   evDriverIdentified360:false,// Conductor Identificado 360
    //   evDriverAusent360:false,// Conductor no detectado 360
    //   evDriverNotIdentified360:false,// Conductor No Identificado 360
      
    //   evErrorAplication360:false,// Error de aplicación 360
    //   evErrorSystem360:false,// Error del sistema 360
    //   evEventExterno360:false,// Evento Externo Solicitado 360
    //   evExcessVelocity360:false,// Exceso de Velocidad 360
    //   evFailedStartSystem360:false,// Fallo en Inicio del sistema 360
    //   evIgnicionOn360:false,// Ignición Activada 360
    //   evIgnicionOff360:false,// Ignición Desactivada 360
    //   evStartSystem360:false,// Inicio del sistema 360
    //   evMculog360:false,// MCULOG 360
    //   evReposoIn360:false,// Modo de Reposo Ingresado 360
    //   evMonitoreoAvance360:false,// Monitoreo y Advertencia de Avance 360
    //   evMovementStop360:false,// Movimiento Detenido 360
    //   evMovementStart360:false,// Movimiento Iniciado 360
    //   evSkipRedLight360:false,// Saltarse Semáforo en Rojo 360
    //   evSystemOk360:false,// Sistema OK 360
    //   evsystemReset360:false,// Sistema Reiniciado 360
    //   evStopIgnored:false,// Stop Desobedecido 360
    // };

    //Reporte 10
    this.chkFatigaSomnolencia = true;
	  this.chkFatigaDistraccion = true;

    //Se solicitó que las fechas no se reseteen.
    /* this.dateInit = new Date(moment(Date.now()).format("MM/DD/YYYY"));
    this.dateEnd = this.dateInit;
    this.timeInit = new Date('12/03/2018 00:00');
    this.timeEnd = new Date('12/03/2018 23:59');
    this.onTimeChange(); */

    // this.updateCheckDefaultEvents();
    // Reiniciar Check All Type EVent
    this.eventsTypes.forEach((evType: any) => {
      evType.selectAll =false;
    });
  }

  logDropState(){
    console.log(this.chkSimultaneousTables);
  }

}

