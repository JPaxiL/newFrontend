import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../vehicles/services/vehicle.service';

import * as moment from 'moment';
import {ConfirmationService} from 'primeng-lts/api';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { ReportService } from '../../services/report.service';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BrowserDetectorService } from '../../services/browser-detector.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  reports: any=[];
  selectedReport: any={};
  vehicles: any=[];
  selectedVehicle: any={};
  selectedVehicles: any=[];
  convoys: any=[];
  selectedConvoy: any={};
  groups: any=[];
  selectedGroup: any={};
  checkboxGroup: boolean = false;
  /* checkboxParada: boolean = true; //Renamed to chkStops
  checkboxMovimiento: boolean = true; */ //Renamed to chkMovements
  // checkboxDuracion: boolean = false; //Renamed to chkDuracion
  checkboxLimitVelocidad: boolean = false;
  dateInit!: Date;
  dateEnd!: Date;
  timeInit!: Date;
  timeEnd!: Date;

  selectedValues: string[] = [];

  //vehiclesArray = [];
	vehiclesArrayOrderByConvoy: any=[];
	vehiclesArrayOrderByGroup: any=[];
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
  formSpinnerMsg: string = 'Cargando';
  fullScreenSpinnerMsg: string = '';

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

  //Reporte 0 - Paradas y Movi
	chkStops: boolean = true;
	chkMovements: boolean = true;
  showMovStop = false;

  //Reporte 1 - Exceso de Vel
  showExcVelOpt: boolean = false;
  checkboxDuration: boolean = false;
  excesoVelocidad: string = 'limVel';
  minimDur = 15;
  limitSpeed = 90;

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
	chkForGroup = false;

	spinnerOptions = false;

  newWindow = false;

  isFormFilled = false;

  chkDateHour = false; //False muestra fecha y h juntas. true separadas
	arrayUsers = [ 472, 204, 483, 467, 360, 394, 364, 445, 489, 491, 503, 504, 515, 522, 537, 554, 552, 555, 573, 587, 529, 590, 591, 595, 613, 620, 621, 734];
  fog = "1";
	userId = 0;

  constructor(
    private browserDetectorService: BrowserDetectorService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private reportService: ReportService,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private titleService: Title) {
      //this.fullScreenSpinnerMsg = 'Iniciando Módulo de Reportes';
      spinner.show("fullScreenSpinner");
      this.titleService.setTitle('Reportes');
      // this.vehicles=this.vehicleService.vehicles;
      this.vehicleService.dataCompleted.subscribe(vehicles=>{
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
      });

      this.reports = [
        {id : 0, value : 'REPORTE DE PARADAS Y MOVIMIENTOS', url: '/api/reports/paradas_movimientos'},
        {id : 1, value : 'REPORTE DE EXCESOS DE VELOCIDAD', url: '/api/reports/exceso_velocidad'},
        {id : 2, value : 'REPORTE DE ENTRADA Y SALIDA', url: '/api/reports/entrada_salida'},
        {id : 3, value : 'REPORTE DE COMBUSTIBLE', url: '/api/reports/combustible'},
        {id : 4, value : 'REPORTE DE EXCESOS EN ZONA'},
        {id : 5, value : 'REPORTE GENERAL'},
        {id : 6, value : 'REPORTE DE EVENTOS', url: '/api/reports/eventos'},
        {id : 7, value : 'REPORTE DE POSICIÓN ', url: '/api/reports/posicion'},
        {id : 8, value : 'REPORTE DE EXCESOS Y TRANSGRESIONES'},
        {id : 9, value : 'REPORTE DE COMBUSTIBLE ODÓMETRO VIRTUAL'},
        {id : 10, value : 'REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)', url: '/api/reports/frenada_aceleracion_brusca'},
        {id : 11, value : 'REPORTE DE DISTRACIÓN Y POSIBLE FATIGA', url: '/api/reports/distraccion_posible_fatiga'},
        {id : 12, value : '-'},
        {id : 13, value : 'REPORTE DE FATIGA EXTREMA', url: '/api/reports/fatiga_extrema'},
        {id : 14, value : 'REPORTE DE ANTICOLISIÓN FRONTAL', url: '/api/reports/anticolision_frontal'},
        {id : 15, value : 'REPORTE DE COLISIÓN CON PEATONES', url: '/api/reports/colision_peatones'},
        {id : 16, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA IZQUIERDA', url: '/api/reports/desvio_carril_izquierda'},
        {id : 17, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA DERECHA', url: '/api/reports/desvio_carril_derecha'},
        {id : 18, value : 'REPORTE DE BLOQUEO DE VISIÓN DE MOBILEYE', url: '/api/reports/bloqueo_vision_mobileye'}
      ];


    }

  ngOnInit(): void {

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

    forkJoin([
      // this.http.get(environment.apiUrl + '/api/tracker'),
      this.http.get(environment.apiUrl + '/api/zone'),
      this.http.get(environment.apiUrl + '/api/userId')
    ]).subscribe((results: {data?: any}[]) => {
      // this.vehicles = results[0];
      this.zones = results[0].data;
      this.userId = parseInt(JSON.stringify(results[1]));

      // console.log("vehicles", this.vehicles);
      console.log("zonas", this.zones);
      console.log("user ID", this.userId);

      /* this.spinnerOptions = false; */

      this.areZonesLoaded = true;
      this.spinner.hide("fullScreenSpinner");
      this.fullScreenSpinnerMsg = '';
    })

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

  showExcVel(){
    console.log(this.excesoVelocidad);
    console.log(this.excesoVelocidad == 'limVel');
    console.log(this.excesoVelocidad == 'durExc');
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
          this.fullScreenSpinnerMsg = 'Generando Reporte...'
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

    var M1 = f1.format("YYYY-MM-DD") + ' ' + h1.format("HH:mm:ss.SSS");
		var M2 = f2.format("YYYY-MM-DD") + ' ' + h2.format("HH:mm:59.999");
		var M2_t = f2.format("YYYY-MM-DD") + ' ' + h2.format("HH:mm:59");
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

    if(cv){
      //Convoy o grupo seleccionado
      var param = {
        fecha_actual:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
				fecha_desde:M1,
        fecha_hasta:M2, // --N
				vehiculos: JSON.stringify(convoyOrGroupArr),
        grupo:this.selectedConvoy,
        zonas:JSON.stringify(this.selectedZones),
				url: this.reports[this.selectedReport].url,
        limitVel: !chkDuracion? this.limitSpeed: false,
        minimDur: chkDuracion? this.minimDur: false,
        chkOdomV: chkOdomV,
				og: JSON.stringify([oG]),
				ev: JSON.stringify([this.eV]),
				chkStops: this.chkStops,
				chkMovements: this.chkMovements,
				chkTrans1min: this.chkTrans1min,
				chkFatigaSomnolencia: this.chkFatigaSomnolencia,
				chkFatigaDistraccion: this.chkFatigaDistraccion,
				chkFrenada: this.chkFrenada,
				chkAceleracion: this.chkAceleracion,
				limit : true,
				numRep: this.reports[this.selectedReport].id
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
        url: this.reports[this.selectedReport].url,
        limitVel: !chkDuracion? this.limitSpeed: false,
        minimDur: chkDuracion? this.minimDur: false,
        chkOdomV: chkOdomV,
        og: JSON.stringify([oG]),
        ev: JSON.stringify([this.eV]),
        chkStops: this.chkStops,
        chkMovements: this.chkMovements,
        chkTrans1min: this.chkTrans1min,
        chkFatigaSomnolencia: this.chkFatigaSomnolencia,
        chkFatigaDistraccion: this.chkFatigaDistraccion,
        chkFrenada: this.chkFrenada,
        chkAceleracion: this.chkAceleracion,

        limit : true,
        numRep: this.reports[this.selectedReport].id
      };
    }

    //console.log(param);
    console.log('Proceso iniciado a las: ', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    console.log(param);
    this.http.post(environment.apiUrl + param.url, param).subscribe({
      next: data => {
        console.log(this.selectedConvoy.length);
        console.log(this.selectedGroup.length);
        console.log(this.selectedVehicles.length);
        console.log(typeof data);
        console.log(data);
        var report_data = {
          data: data,
          numRep: param.numRep,
          repSubtitle: repSubtitle,
          chkDateHour: chkDateHour,
          chkDuracion: chkDuracion,
          chkOdomV: chkOdomV,
          repTitle: this.reports[param.numRep].value,
          period: M1 + ' - ' + M2_t,
          isVehicleReport: !cv,
        }
        if(new_tab === undefined || new_tab == true){
          //Report in the same tab
          this.reportService.showReport.emit(report_data);
          this.isFormFilled = true;
        } else {
          //Report in new tab
          this.spinner.hide("fullScreenSpinner");
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

    switch(this.selectedReport){
      case 0:
        this.showMovStop = true;
        this.showLimitTime = true;
        break;
      case 1:
        this.showExcVelOpt = true;
        this.showLimitTime = true;
        break;
      case 2:
        this.showZones = true;
        this.showLimitTime = true;
        break;
      case 3:
        this.showLimitTime = true;
        this.showOdomOpt = true;
        break;
      case 6:
        this.showLimitTime = true;
        this.showEvents = true;
        break;
      case 7:
        break;
      case 10:
        this.showLimitTime = true;
        this.showBrakeAccel = true;
        break;
      case 11:
        this.showLimitTime = true;
        this.showFatigaDistraccion = true;
        break;
      case 13:
        this.showLimitTime = true;
        break;
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
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
  }

  onSelectedConvoyChange(){
    this.selectedVehicles = [];
    this.selectedGroup = {};
    this.chkAllVehicles = false;
  }

  onSelectedGroupChange(){
    this.selectedVehicles = [];
    this.selectedConvoy = {};
    this.chkAllVehicles = false;
  }

  onChkDateHourChange(){
    console.log(this.chkDateHour);
    this.onTimeChange();
  }

  onTimeChange(){
    console.log('date init', this.dateInit);
    console.log('date end', this.dateEnd);
    console.log('time init', moment(new Date(this.timeInit)).format("HH:mm"));
    console.log('time end', this.timeEnd);
  }

  validateForm(){
    var is_vehicle_selected = (this.selectedVehicles.length != 0 || JSON.stringify(this.selectedConvoy) != '{}' || JSON.stringify(this.selectedGroup) != '{}');
    var is_zone_selected = this.selectedZones.length != 0;

    this.isFormFilled =
      (JSON.stringify(this.selectedReport) != '{}') &&
      (
        (this.selectedReport == 0 && is_vehicle_selected && (this.chkStops || this.chkMovements))
        ||
        (this.selectedReport == 1 && is_vehicle_selected)
        ||
        (this.selectedReport == 2 && is_vehicle_selected && is_zone_selected)
        ||
        (this.selectedReport == 3 && is_vehicle_selected)
        ||
        (this.selectedReport == 6 && is_vehicle_selected)
        ||
        (this.selectedReport == 7 && is_vehicle_selected)
        ||
        (this.selectedReport == 10 && is_vehicle_selected && (this.chkFrenada || this.chkAceleracion))
        ||
        (this.selectedReport == 11 && is_vehicle_selected && (this.chkFatigaDistraccion || this.chkFatigaSomnolencia))
        ||
        (this.selectedReport == 13 && is_vehicle_selected)
        ||
        (this.selectedReport == 14 && is_vehicle_selected)
        ||
        (this.selectedReport == 15 && is_vehicle_selected)
        ||
        (this.selectedReport == 16 && is_vehicle_selected)
        ||
        (this.selectedReport == 17 && is_vehicle_selected)
        ||
        (this.selectedReport == 18 && is_vehicle_selected)
      );
  }
}
