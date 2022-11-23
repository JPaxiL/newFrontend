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

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  reports: any=[];
  selectedReport: any={};
  vehicles: any=[];
  selectedVehicles: any=[];
  convoys: any=[];
  selectedConvoy: any={};
  groups: any=[];
  selectedGroup: any={};
  checkboxGroup: boolean = false;
  pDropdownGroup: any= [
    { label: 'Convoy', value: false },
    { label: 'Grupo', value: true }
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

	showCard = false;
	showDivHorizontal = false;
	showEvents = false;
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
  };


  //Reporte 6 - Reporte de Eventos
  eV = {
      GPSbateriaBaja:false,
      GPSbateriaDesconectada:false,
      GPSaceleracionBrusca:false,
      GPSfrenadaBrusca:false,
      GPSbloqueoTransmision:false,
      GPSsos:false,
      GPSremolque:false,
      GPSparada: false, // --- NEW
      GPSmotorEncendido: false, // --- NEW
      GPSmotorApagado: false, // --- NEW

      evEntrada:false,
      evSalida:false,
      evEstadia:false,   // --- NEW
      evParada:false,
      evMovSinProgramacion:false,  //  NEW
      evInfraccion:false,
      evExcesoDeVelocidad:false,
      evAnticolisionFrontal:false,
      evColisionConPeatones:false,

      evNoRostro:false,
      evFatigaExtrema:false,
      evDesvioCarrilIzquierda:false,
      evDesvioCarrilDerecha:false,
      evBloqueoVisionMobileye:false,


      AccFatiga:false, // DESACTIVADO
      AccAlcoholemia:false,
      AccIButton: false,  // --- DESACTIVADO
      AccSomnolencia: false,
      AccDistraccion: false,

      OtroTodos:false,
      OtroExVelocidad:false,
    };



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
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private titleService: Title) {
      //this.fullScreenSpinnerMsg = 'Iniciando Módulo de Reportes';
      spinner.show("fullScreenSpinner");
      this.titleService.setTitle('Reportes');
      // this.vehicles=this.vehicleService.vehicles;
      this.vehicleService.dataCompleted.subscribe(vehicles=>{
        if(vehicles){
          this.vehicles = vehicles;
          console.log('Vehicles: ',vehicles);
          this.convoys = _.uniqBy(this.vehicles, 'convoy');
          this.groups = _.uniqBy(this.vehicles, 'grupo');
          this.convoys = this.convoys.map((convoy: { convoy: any; }) => { return convoy.convoy});
          this.convoys = this.convoys.filter((convoy: any) => convoy != "Unidades Sin Convoy");
          this.groups = this.groups.map((grupo: { grupo: any; }) => { return grupo.grupo});
          console.log('Convoys: ',this.convoys);
          console.log('Groups: ',this.groups);
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





    }

  ngOnInit(): void {

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

  selectAllVehicles(){
    this.selectedVehicles = this.chkAllVehicles? this.vehicles: [];
    this.onSelectedVehiclesChange();
  }

  selectAllZones(){
    this.selectedZones = this.chkAllZones? this.zones.map((zone: { id: any; }) => { return zone.id}): [];
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
    console.log(new_tab !== undefined);
    this.reportService.workingOnReport = true;


    var repSubtitle = '';
    var chkDateHour = this.chkDateHour;
    var chkDuracion = this.checkboxDuration;
    var chkOdomV = this.chkOdomVirtual;

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
    this.http.post(environment.apiUrl + param.url, param).subscribe({
      next: data => {
        //console.log(this.selectedConvoy.length);
        //console.log(this.selectedGroup.length);
        //console.log(this.selectedVehicles.length);
        console.log(typeof data);
        console.log(data);
        this.reportService.setParams(param);
        // console.log("MODAL ACTIVATE");
        // this.reportService.modalActive = true;
        var report_data = {
          data: data,
          numRep: param.numRep, // codigo
          repSubtitle: repSubtitle,
          chkDateHour: chkDateHour,
          chkDuracion: chkDuracion,
          chkOdomV: chkOdomV,
          repTitle: reportSelect.value, //this.reports[param.numRep].value,
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
		this.showMovStop = false; //Ver Paradas y Movimiento
		this.showDivHorizontal = false; // Nombre de cabecera del reporte
		this.showLimitTime = false; //Configuracion de rango de tiempo -- true la mayoria
		this.showEvents = false; //Configuracion de rango de tiempo
		this.showTrans1min = false; //Configuracion de duracion de parada >1min
		this.showFatigaOp = false; //Configuracion de opcion de fatiga 2
		this.showBrakeAccel = false; //Configuración Aceleracion y frenada
    this.showFatigaDistraccion = false; //Configuracion Distraccion y posible fatiga
		/* this.showTimeLlegada = false;
		this.showTimePeriodoDia = false; */
    this.showChkSimultaneousTables = false;

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
          this.showLimitTime = true;
				break;
      default: break;
    }
/*     console.log(Object.keys(this.reports[this.selectedReport]).length === 0);
    console.log(_.isEmpty(this.reports[this.selectedReport])); */
    console.log(_.isEmpty(this.selectedReport));
    console.log(this.selectedReport);
    console.log(typeof this.selectedReport);
    console.log("Selected report", this.selectedReport);
    console.log("Grupo", this.checkboxGroup && !_.isEmpty(this.selectedGroup) && this.selectedGroup);
    console.log("Convoy", !this.checkboxGroup && !_.isEmpty(this.selectedConvoy) && this.selectedConvoy);
    console.log("Vehiculos en el Convoy", this.vehicles.filter((vehicle: { convoy: any; }) => vehicle.convoy == this.selectedConvoy));
    console.log("Selected Vehicles", this.selectedVehicles);

  }

  dismissBlockedTabDialog(){
    this.showBlockedTabDialog = false;
    this.toastr.error('', 'No se pudo reportar en nueva pestaña', {
      timeOut: 5000,
    });
  }

  onSelectedVehiclesChange(){
    this.selectedConvoy = {};
    this.selectedGroup = {};
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
    this.eV = {
      GPSbateriaBaja:this.eV.OtroTodos,
      GPSbateriaDesconectada:this.eV.OtroTodos,
      GPSaceleracionBrusca:this.eV.OtroTodos,
      GPSfrenadaBrusca:this.eV.OtroTodos,
      GPSbloqueoTransmision:this.eV.OtroTodos,
      GPSsos:this.eV.OtroTodos,
      GPSremolque:this.eV.OtroTodos,
      GPSparada: this.eV.OtroTodos, // --- NEW
      GPSmotorEncendido: this.eV.OtroTodos, // --- NEW
      GPSmotorApagado: this.eV.OtroTodos, // --- NEW

      evEntrada:this.eV.OtroTodos,
      evSalida:this.eV.OtroTodos,
      evEstadia:this.eV.OtroTodos,   // --- NEW
      evParada:this.eV.OtroTodos,
      evMovSinProgramacion:this.eV.OtroTodos,  //  NEW
      evInfraccion:this.eV.OtroTodos,
      evExcesoDeVelocidad:this.eV.OtroTodos,
      evAnticolisionFrontal:this.eV.OtroTodos,
      evColisionConPeatones:this.eV.OtroTodos,

      evNoRostro:this.eV.OtroTodos,
      evFatigaExtrema:this.eV.OtroTodos,
      evDesvioCarrilIzquierda:this.eV.OtroTodos,
      evDesvioCarrilDerecha:this.eV.OtroTodos,
      evBloqueoVisionMobileye:this.eV.OtroTodos,


      AccFatiga:this.eV.OtroTodos, // DESACTIVADO
      AccAlcoholemia:this.eV.OtroTodos,
      AccIButton: this.eV.OtroTodos,  // --- DESACTIVADO
      AccSomnolencia: this.eV.OtroTodos,
      AccDistraccion: this.eV.OtroTodos,

      OtroTodos:this.eV.OtroTodos,
      OtroExVelocidad:this.eV.OtroTodos,
    };
  }

  onChangeChkEvents(){
    if(!this.eV.GPSbateriaDesconectada) { this.eV.OtroTodos = false; return; }
    if(!this.eV.GPSaceleracionBrusca) { this.eV.OtroTodos = false; return; }
    if(!this.eV.GPSfrenadaBrusca) { this.eV.OtroTodos = false; return; }
    if(!this.eV.GPSsos) { this.eV.OtroTodos = false; return; }
    if(!this.eV.GPSmotorEncendido) { this.eV.OtroTodos = false; return; }
    if(!this.eV.GPSmotorApagado) { this.eV.OtroTodos = false; return; }

    if(!this.eV.evEntrada) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evSalida) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evEstadia) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evParada) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evInfraccion) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evExcesoDeVelocidad) { this.eV.OtroTodos = false; return; }


    if(!this.eV.evNoRostro) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evFatigaExtrema) { this.eV.OtroTodos = false; return; }
    if(!this.eV.AccFatiga) { this.eV.OtroTodos = false; return; }
    if(!this.eV.AccDistraccion) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evAnticolisionFrontal) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evColisionConPeatones) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evDesvioCarrilIzquierda) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evDesvioCarrilDerecha) { this.eV.OtroTodos = false; return; }
    if(!this.eV.evBloqueoVisionMobileye) { this.eV.OtroTodos = false; return; }

    this.eV.OtroTodos = true;
  }

  validateForm(){
    var is_vehicle_selected = (this.selectedVehicles.length != 0 || JSON.stringify(this.selectedConvoy) != '{}' || JSON.stringify(this.selectedGroup) != '{}');
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
    };

    //6. Eventos
    this.eV = {
      GPSbateriaBaja:false,
      GPSbateriaDesconectada:false,
      GPSaceleracionBrusca:false,
      GPSfrenadaBrusca:false,
      GPSbloqueoTransmision:false,
      GPSsos:false,
      GPSremolque:false,
      GPSparada: false, // --- NEW
      GPSmotorEncendido: false, // --- NEW
      GPSmotorApagado: false, // --- NEW

      evEntrada:false,
      evSalida:false,
      evEstadia:false,   // --- NEW
      evParada:false,
      evMovSinProgramacion:false,  //  NEW
      evInfraccion:false,
      evExcesoDeVelocidad:false,
      evAnticolisionFrontal:false,
      evColisionConPeatones:false,

      evNoRostro:false,
      evFatigaExtrema:false,
      evDesvioCarrilIzquierda:false,
      evDesvioCarrilDerecha:false,
      evBloqueoVisionMobileye:false,


      AccFatiga:false, // DESACTIVADO
      AccAlcoholemia:false,
      AccIButton: false,  // --- DESACTIVADO
      AccSomnolencia: false,
      AccDistraccion: false,

      OtroTodos:false,
      OtroExVelocidad:false,
    };

    //Reporte 10
    this.chkFatigaSomnolencia = true;
	  this.chkFatigaDistraccion = true;

    //Se solicitó que las fechas no se reseteen.
    /* this.dateInit = new Date(moment(Date.now()).format("MM/DD/YYYY"));
    this.dateEnd = this.dateInit;
    this.timeInit = new Date('12/03/2018 00:00');
    this.timeEnd = new Date('12/03/2018 23:59');
    this.onTimeChange(); */
  }

  logDropState(){
    console.log(this.chkSimultaneousTables);
  }

}
