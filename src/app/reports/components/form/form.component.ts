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
	selectedZone: any=[];
	//showLimitSpeed = false; //Replaced by showExcVelOpt
	showLimitTime = false;
	showZones = false;
	showCheckboxs = false;
	showMovStop = false;
	showCard = false;
	showDivHorizontal = false;
	showEvents = false;
	showSubLimitTime = false;
	showTrans1min = false;
	showFatigaOp = false;
	showFrenadaAceleracionOp = false;
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

	reportType = "0";

	chkStops: boolean = true; //Reporte 0 - Paradas y
	chkMovements: boolean = true; //Reporte 0 - Paradas y Movi

  showExcVelOpt: boolean = false; //Reporte 1 - Exceso de Vel
  excesoVelocidad: string = 'limVel'; //Reporte 1 - Exceso de Vel
  minimDur = 15; //Reporte 1 - Exceso de Vel
  limitSpeed = 90;; //Reporte 1 - Exceso de Vel

	chkTrans1min = false;
	chkFatigaSomnolencia = true;
	chkFatigaDistraccion = true;
	chkForGroup = false;
	chkFrenada = true;
	chkAceleracion = true;
	spinnerOptions = false;

  newWindow = false;

  isFormFilled = false;

  chkDateHour = false; //False muestra fecha y h juntas. true separadas
	arrayUsers = [ 472, 204, 483, 467, 360, 394, 364, 445, 489, 491, 503, 504, 515, 522, 537, 554, 552, 555, 573, 587, 529, 590, 591, 595, 613, 620, 621, 734];
  fog = "1";
	userId = 0;

  constructor(
    private reportService: ReportService,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private titleService: Title) {
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

    });

    this.reports = [
      {id : 0, value : 'REPORTE DE PARADAS Y MOVIMIENTOS', url: '/api/reports/paradas_movimientos'},
      {id : 1, value : 'REPORTE DE EXCESOS DE VELOCIDAD', url: '/api/reports/exceso_velocidad'},
      {id : 2, value : 'REPORTE DE EXCESOS EN ZONA'},
      {id : 3, value : 'REPORTE DE ENTRADA Y SALIDA'},
      {id : 4, value : 'REPORTE DE COMBUSTIBLE'},
      {id : 5, value : 'REPORTE GENERAL'},
      {id : 6, value : 'REPORTE DE EVENTOS'},
      {id : 7, value : 'REPORTE DE POSICIÓN ', url: '/api/reports/posicion'},
      {id : 8, value : 'REPORTE DE EXCESOS Y TRANSGRESIONES'},
      {id : 9, value : 'REPORTE DE COMBUSTIBLE ODÓMETRO VIRTUAL'},
      {id : 10, value : 'REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)'},
      {id : 11, value : 'REPORTE DE DISTRACIÓN'},
      {id : 12, value : 'REPORTE DE POSIBLE FATIGA'},
      {id : 13, value : 'REPORTE DE FATIGA EXTREMA'},
      {id : 14, value : 'REPORTE DE ANTICOLISIÓN FRONTAL', url: '/api/reports/anticolision_frontal'},
      {id : 15, value : 'REPORTE DE COLISIÓN CON PEATONES'},
      {id : 16, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA IZQUIERDA'},
      {id : 17, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA DERECHA'},
      {id : 18, value : 'REPORTE DE BLOQUEO DE VISIÓN DE MOBILEYE'}
    ];
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reportes');
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
    ]).subscribe(results => {
      // this.vehicles = results[0];
      this.zones = results[0];
      this.userId = parseInt(JSON.stringify(results[1]));

      // console.log("vehicles", this.vehicles);
      console.log("zonas", this.zones);
      console.log("user ID", this.userId);

      this.spinnerOptions = false;

    })

  }

  showExcVel(){
    console.log(this.excesoVelocidad);
    console.log(this.excesoVelocidad == 'limVel');
    console.log(this.excesoVelocidad == 'durExc');
  }

  confirm() {
          this.confirmationService.confirm({
              key: 'newTabConfirmation',
              message: '¿Desea generar el reporte en una nueva ventana?',
              reject: () => {
                console.log("Reporte en la misma hoja");
                this.reportar();
              },
              accept: () => {
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
    var chkDuracion = this.excesoVelocidad == 'durExc';

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

    var M1 = f1.format("YYYY-MM-DD") + ' ' + h1.format("HH:mm:ss");
		var M2 = f2.format("YYYY-MM-DD") + ' ' + h2.format("HH:mm:ss");
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
    var eV: any=[];

    //selectedZone[i].id

    var zonesArr: any=[];

    if(cv){
      //Convoy o grupo seleccionado
      var param = {
        fecha_actual:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
				fecha_desde:M1,
        fecha_hasta:M2, // --N
				vehiculos: JSON.stringify(convoyOrGroupArr),
        grupo:this.selectedConvoy,
        zonas:JSON.stringify(zonesArr),
				url: this.reports[this.selectedReport].url,
        limitVel: !chkDuracion? this.limitSpeed: false,
        minimDur: chkDuracion? this.minimDur: false,
				og: JSON.stringify([oG]),
				ev: JSON.stringify([eV]),
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
        zonas: JSON.stringify(zonesArr),
        url: this.reports[this.selectedReport].url,
        limitVel: !chkDuracion? this.limitSpeed: false,
        minimDur: chkDuracion? this.minimDur: false,
        og: JSON.stringify([oG]),
        ev: JSON.stringify([eV]),
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
          repTitle: this.reports[param.numRep].value,
          period: M1 + ' - ' + M2,
          isVehicleReport: !cv,
        }
        if(new_tab === undefined || new_tab == true){
          //Report in the same tab

          this.reportService.showReport.emit(report_data);
        } else {
          //Report in new tab
          console.log('Se abrió una nueva pestaña');
          localStorage.setItem("report_data", JSON.stringify(report_data));
          var testing = window.open('/reports/result');
        }


      }

    })





  }

  changedReport(){
    console.log(this.selectedReport);
    console.log(typeof this.selectedReport);

    this.titleService.setTitle(this.reports[this.selectedReport].value);
    this.showSubLimitTime = true;

		this.showCard = false; //Div que contiene [ showExcVelOpt - showMovStop - showZones - showCheckboxs ]
		this.showExcVelOpt = false; //Limite de velocidad
		this.showZones = false; // Seleccionador de geocercas
		this.showCheckboxs = false;// Opciones reporte general
		this.showMovStop = false; //Ver Paradas y Movimiento
		this.showDivHorizontal = false; // Nombre de cabecera del reporte
		this.showLimitTime = false; //Configuracion de rango de tiempo -- true la mayoria
		this.showEvents = false; //Configuracion de rango de tiempo
		this.showTrans1min = false; //Configuracion de duracion de parada >1min
		this.showFatigaOp = false; //Configuracion de opcion de fatiga 2
		this.showFrenadaAceleracionOp = false; //Configuración Aceleracion y frenada
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
      case 7:
        this.showLimitTime = false;
        break;
      case 14:
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


		/* 	$q.all([
		    	api.get('reportsTracker'),
		    	api.get('zone'),
					api.get('userId')
		    ]).then((values: any[]) => {
					console.log("values -- S");
					this.userId = parseInt(values[2]);
		    	console.log(values);
		    	this.vehiclesArray = values[0];
		    	this.zonesArray = values[1];
					reportServices.setuserD(values[2]);
		    	console.log(this.vehiclesArray);
		    	console.log(this.zonesArray);
		    	this.vehiclesArray = this.vehiclesArray.sort((a: { convoy: string; }, b: { convoy: any; }) => a.convoy.localeCompare(b.convoy));

		    	this.vehiclesArrayOrderByConvoy = _.uniq(this.vehiclesArray, function(p: { convoy: any; }){ return p.convoy; });
		    	// console.log(this.vehiclesArrayOrderByConvoy);
		    	for(var i=0; i<this.vehiclesArrayOrderByConvoy.length; i++){
		    		if (this.vehiclesArrayOrderByConvoy[i].convoy == "Unidades Sin Convoy") {
		    			// console.log('entro eliminar unidades sin convoy');
		    			// console.log(i);
		    			this.vehiclesArrayOrderByConvoy.splice(i,1);
		    		}
		    	}

					this.vehiclesArrayGroup = this.vehiclesArray.sort((a: { grupo: string; }, b: { grupo: any; }) => a.grupo.localeCompare(b.grupo));

					this.vehiclesArrayOrderByGroup = _.uniq(this.vehiclesArrayGroup, function(p: { grupo: any; }){ return p.grupo; });
		    	// console.log(this.vehiclesArrayOrderByConvoy);
		    	for(var i=0; i<this.vehiclesArrayOrderByGroup.length; i++){
		    		if (this.vehiclesArrayOrderByGroup[i].grupo == "Unidades Sin Grupo") {
		    			// console.log('entro eliminar unidades sin convoy');
		    			// console.log(i);
		    			this.vehiclesArrayOrderByGroup.splice(i,1);
		    		}
		    	}

		    	console.log(this.vehiclesArrayOrderByConvoy);
					console.log(this.vehiclesArrayOrderByGroup);

		    	this.spinnerOptions = false;
		    }); */


  /* optionUser = function(){
    return  parseInt(reportServices.getuserD());
  } */


  onSelectedVehiclesChange(){
    this.selectedConvoy = {};
    this.selectedGroup = {};
  }

  onSelectedConvoyChange(){
    this.selectedVehicles = [];
    this.selectedGroup = {};
  }

  onSelectedGroupChange(){
    this.selectedVehicles = [];
    this.selectedConvoy = {};
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

    this.isFormFilled =
      (JSON.stringify(this.selectedReport) != '{}') &&
      (
        (this.selectedReport == 0 && is_vehicle_selected)
        ||
        (this.selectedReport == 1 && is_vehicle_selected)
        ||
        (this.selectedReport == 7 && is_vehicle_selected)
        ||
        (this.selectedReport == 14 && is_vehicle_selected)
      );
  }
}
