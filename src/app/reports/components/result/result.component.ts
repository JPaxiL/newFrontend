import { HttpClient } from '@angular/common/http';
import { NgModule, Component, ViewChild , OnInit, OnDestroy, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportService } from '../../services/report.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng-lts/api';
import { NgxSpinnerService } from 'ngx-spinner';
import {DialogModule} from 'primeng-lts/dialog';

import * as moment from 'moment';
// import { AnyARecord } from 'dns';
// declare var $: any;
declare var $j: any;

declare var pdfMake: any;

declare var kendo: any

export interface AllRows{
  cells?: {
    value?: string | number;
    bold?: boolean;
    color?: string;
    background?: string;
    format?: string;
    vAlign?: string;
    hAlign?: string;
    fontSize?: any;
    colSpan?: number;
    formula?: string;
    wrap?: boolean;
  }[];
  height?: number;
}

export interface Columns{
  width?: number;
  autoWidth?: boolean;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject<any>();
  data: any;
  table_hide = 'd-none';
  num_rep: any;
  rep_title: any;
  rep_subtitle: any;
  period: string='';
  table_headers: any;
  table_data: any;
  chkDateHour: any;
  chkDuracion: any;
  chkOdomV: any;
  Math = Math;

  //@Output() localStorageReportData = new EventEmitter();
  is_new_tab: boolean = false;
  dt_completed = 0;


  dtRendered = localStorage.getItem("report_data") !== null;

  /* EXPORTAR */
  t1=18; // Titulo Principal
  t2=16; // Sub titulos
  t3=14; // Cabeceras
  c1=12; // Cuerpo
  r1=12; // RESUMEN

  t1_2=18; // Titulo Principal
  tt1_2=16; // Titulo Principal linea 2
  t2_2=15; // Sub titulos
  c1_2=12; // Cuerpo del nuevo formato

  /* ANCHOS COLUMNAS */
  //NOTA: width * 1.28 (aprox) = Ancho de columna en excel
  w_item = 50; // index
  w_date_hour = 94;
  w_date_and_hour = 172;
  w_codigo = 80;
  w_placa = 70;
  w_velocidad = 96;
  w_velocidad_gps_can = 130;
  w_velocidad_gps_can_short = 88;
  w_odometro = 110;
  w_duracion = 173;
  w_lat_long = 190;

  char_to_px = 10; // Ancho de un caracter en pixeles

  isChromium = window.chrome? true:false;
	winNav = window.navigator;
	vendorName = this.winNav.vendor;
	isOpera = typeof window.opr !== "undefined";
	isIEedge = this.winNav.userAgent.indexOf("Edge") > -1;
	isIOSChrome = this.winNav.userAgent.match("CriOS");
	isChrome = false;
  isFirefox = false;
  isSafari = false;
  isEdge = false;

  constructor(
    private spinner: NgxSpinnerService,
    private http:HttpClient,
    private reportService:ReportService,
    private titleService:Title,
    private toastr:ToastrService,
    private confirmationService:ConfirmationService,
  ){

  }

  ngOnInit(){
    const isIndependentWindow = document.getElementById('vehicle_label') === null;
    if(isIndependentWindow){
      //Verificar si reporte es una ventana o componente
      var report_data = JSON.parse(localStorage.getItem('report_data')!);
    }
    localStorage.removeItem('report_data');

    console.log('Iniciando result component');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      language:{
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
      },
      dom: 'lfrtip',
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
      /* buttons: ['excel'], */
      buttons: [{
        extend: 'excel',
        text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Exportar a Excel',
        className: 'btn btn-success'
      }],
      initComplete: () => {
        this.dt_completed++;
        console.log('Terminado de cargar y popular tabla ' + this.dt_completed);
        if(this.dt_completed == document.querySelectorAll('table[datatable]').length){
          this.wrapElements(document.querySelectorAll('table[datatable]'));
          this.table_hide = '';
          if(!isIndependentWindow){
            this.spinner.hide("reportSpinner");
          }
        }
        if (this.num_rep == 19) {
            this.runReportGerencial(1);
            setTimeout(() => {
              this.runReportGerencial(1);
            }, 1000);
        }
      },
      destroy: true
    };

    if(!isIndependentWindow){
      this.reportService.showReport.subscribe(data => {
        console.log('Recibiendo data en result', data);

        this.dt_completed = 0;

        this.data = data.data;
        this.num_rep = data.numRep;
        this.rep_title = data.repTitle;
        this.rep_subtitle = data.repSubtitle;
        this.chkDateHour = data.chkDateHour;
        this.chkDuracion = data.chkDuracion;
        this.chkOdomV = data.chkOdomV;
        this.period = data.period;

        //Check if this is the first time loading
        if(this.dtElement !== undefined && "dtInstance" in this.dtElement){
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.dtRendered = false;
            this.dtTrigger = new Subject<any>();
          });
          console.log('saliendo del then');
        }
        setTimeout(() => {
          this.dtRendered = true;
        });
        console.log('dtRendered es ', this.dtRendered);

        console.log('antes de next');
        setTimeout(() => {
          this.dtTrigger.next();
        });

        console.log('despues de next');
        //this.table_hide = '';

        console.log('Proceso terminado a las: ', new Date());

      })
    } else {
      console.log('Se abrirá una nueva pestaña')
      localStorage.removeItem('report_data');
      this.data = report_data.data;
      this.num_rep = report_data.numRep;
      this.rep_title = report_data.repTitle;
      this.rep_subtitle = report_data.repSubtitle;
      this.chkDateHour = report_data.chkDateHour;
      this.chkDuracion = report_data.chkDuracion;
      this.chkOdomV = report_data.chkOdomV;
      this.period = report_data.period;
      document.querySelector('body')!.style.backgroundColor = 'rgb(250,250,250)';
      document.querySelector('body')!.style.padding = '0.8rem';
      this.titleService.setTitle(this.rep_title);
      //this.dtTrigger.next();
      setTimeout(() => {
        this.dtTrigger.next();
      });

      //this.table_hide = '';

      console.log('Proceso terminado a las: ', new Date());
    }

    if (this.isIOSChrome) {
      // is Google Chrome on IOS
      this.isChrome = true;
    } else if(
      this.isChromium !== null &&
      typeof this.isChromium !== "undefined" &&
      this.vendorName === "Google Inc." &&
      this.isOpera === false &&
      this.isIEedge === false
    ) {
        // is Google Chrome
        this.isChrome = true;
    } else {
        // not Google Chrome
        this.isChrome = false;
    }

  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('report_data');
  }

  filterMovimientos(a: any[]): any[] {
    return a.filter((row: { esInt: number; }) => row.esInt == 1);
  }

  filterParadas(a: any[]): any[] {
    return a.filter((row: { esInt: number; }) => row.esInt == 0);
  }

  // Se ejecuta DESPUES de que todas las tablas hayan cargado
  wrapElements(elements: any){
    const htmlWrapper = `<div style="display: block; overflow: auto; width:100%;"></div>`;
    for(let element of elements){
      let auxEl = document.createElement('div');
      auxEl.innerHTML = htmlWrapper.trim();
      let wrapperEl = auxEl.firstElementChild;
      let datatable_wrapper = element.parentNode;
      datatable_wrapper.insertBefore(wrapperEl, element);
      wrapperEl!.appendChild(element);
    }
  }

  isNumber(val: any):boolean{
    return (typeof val) == 'number';
  }

  isChe(date:any) {
    if (this.isChrome) {
      if (this.chkDateHour) {
        var fh = date.split(" ");
        return fh[0];
      } else {
        return date;
      }
    } else {
      return new Date(date);
    }
  }

  isChs(date:any) {
      if (this.isChrome) {
        if (this.chkDateHour) {
          var fh = date.split(" ");
          return fh[1];
        } else {
          return date; // never
        }
      } else {
        return new Date(date);
      }
  }


  showSelectExcel(fn_name: string){
    this.confirmationService.confirm({
      key: 'showSelectExcelConfirmation',
      //message: 'Are you sure that you want to perform this action?',
      reject: () => {
        console.log("Reporte de Excel Unido (cascada)");
        this[fn_name as keyof ResultComponent](2);
      },
      accept: () => {
        console.log("Reporte de Excel por separado (hojas)");
        this[fn_name as keyof ResultComponent](1);
      }
    });
  }

  puntuacion(idx:number){
    // console.log("puntuacion---------------");

    // console.log(idx);
    // console.log(vm.datos[idx][1]);
    // console.log(vm.datos[idx][1][0]);
    // console.log(vm.datos[idx][1][0].C12);

    var item = this.data[idx][1][0];
    //console.log("retornar :: ");


    // console.log(item);
    // console.log(this.data);
    //console.log("100 - ( ("+item.C01+"*(50/100)) +("+item.C02+"*(40/100)) + ("+item.C03+"*(50/100)) + ("+item.C04+"*(30/100))+ ("+item.C05+"*(2000/100)) + ("+item.C06+"*(2500/100)) + ("+item.C07+"*(100/100)) + ("+item.C08+"*(50/100)) + ("+item.C09+"*(500/100)) + ("+item.C10+"*(50/100)) + ("+item.C11+"*(50/100)) + ("+item.C12+"*(2000/100)) )");

    //console.log(100 - ( (item.C01*(50/100)) + (item.C02*(40/100)) + (item.C03*(50/100)) + (item.C04*(30/100))+ (item.C05*(2000/100)) + (item.C06*(2500/100)) + (item.C07*(100/100)) + (item.C08*(50/100)) + (item.C09*(500/100)) + (item.C10*(50/100)) + (item.C11*(50/100)) + (item.C12*(2000/100)) ) );

    this.data[idx][1][0].puntuacion =(100 - ( (item.C01*(40/100)) + (item.C02*(50/100)) + (item.C03*(30/100))+ (item.C04*(2000/100)) + (item.C05*(2500/100)) + (item.C06*(100/100)) + (item.C07*(50/100)) + (item.C08*(500/100)) + (item.C09*(50/100)) + (item.C10*(50/100)) + (item.C11*(2000/100)) ) );

    // console.log(this.data[idx][1][0].puntuacion);

  };

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  verTodos(periodo:any, imei:any, dateHour:any, vehiculo:any) {
    console.log("===========================================");
    console.log(periodo);
    console.log(imei);
    console.log(dateHour);
    console.log(vehiculo);


    this.spinner.show("reportSpinner");

    var dataParam = this.reportService.getParams();
    console.log(dataParam);
    dataParam['limit'] = false;
    dataParam['findImei'] = imei;
    console.log(dataParam);

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide("reportSpinner");
    // }, 5000);

    this.http.post(environment.apiUrl + dataParam.url, dataParam).subscribe({
      next: data => {
        // console.log(this.selectedConvoy.length);
        // console.log(this.selectedGroup.length);
        // console.log(this.selectedVehicles.length);
        console.log(typeof data);
        console.log(data);

        this.reportService.objGeneral.data = data;
        this.reportService.objGeneral.periodo = periodo;//this.period;
        this.reportService.objGeneral.vehiculo = vehiculo;//this.period;
        this.reportService.objGeneral.dateHour = dateHour;//this.period;

        this.spinner.hide("reportSpinner");

        console.log("MODAL ACTIVATE");

        this.reportService.modalActive = true;

        // var report_data = {
        //   data: data,
        //   numRep: param.numRep,
        //   repSubtitle: repSubtitle,
        //   chkDateHour: chkDateHour,
        //   chkDuracion: chkDuracion,
        //   chkOdomV: chkOdomV,
        //   repTitle: this.reports[param.numRep].value,
        //   period: M1 + ' - ' + M2_t,
        //   isVehicleReport: !cv,
        // }
        // if(new_tab === undefined || new_tab == true){
        //   //Report in the same tab
        //   this.reportService.showReport.emit(report_data);
        //   this.isFormFilled = true;
        // } else {
        //   //Report in new tab
        //   this.spinner.hide("fullScreenSpinner");
        //   this.isFormFilled = true;
        //   console.log('Se abrió una nueva pestaña');
        //   localStorage.setItem("report_data", JSON.stringify(report_data));
        //   var report_tab = window.open('/reports/result');
        //   if(report_tab == null){
        //     this.showBlockedTabDialog = true;
        //     /* this.toastr.error('', 'No se pudo reportar en nueva pestaña', {
        //       timeOut: 5000,
        //     }); */
        //   } else {
        //     this.toastr.success('', 'Reporte en nueva pestaña exitoso', {
        //       timeOut: 5000,
        //     });
        //   }
        // }
      }
    });




    // reportServices.setSpinnerValue(true);
    // dataParam =  reportServices.getParam();
    // dataParam['limit'] = false;
    // dataParam['findImei'] = imei;






    // reportServices.setSpinnerValue(true);
    // dataParam =  reportServices.getParam();
    // dataParam['limit'] = false;
    // dataParam['findImei'] = imei;

    // $q.all([
    //     api.post('informes/informes_general_uni',dataParam),
    //   ]).then(values => {



    //     var modalInstance = $uibModal.open({
    //       backdrop: false,
    //       component: 'reporteModalAll',
    //       resolve: {
    //       'datos'    : function() { return values[0]; },
    //       'periodo'  : function() { return periodo;},
    //       'vehiculo' : function() { return values[0][0][0][1];},
    //       'dateHour' : function() { return dateHour;},
    //       'lang'     : function() { return lang;}

    //     },
    //       size: 'lg'
    //     });
    //     reportServices.setSpinnerValue(false);
    //   });

  }





  /* EXPORTAR */
  exportExcelParadasMovimientos(vrs: number) {
    /* vm.dateHour() y datee; //Obtiene el chkDateHour para separar las columnas de fecha y hora*/

    var exportFileEx = [];
    var bol_datos_ex = false;
    var column_config:Columns[] = [];
    var p_cercano_max_width = 155;
    var referencia_max_width = 165;

    var nom_inf = "REPORTE DE PARADAS Y MOVIMIENTOS";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf = "REPORTE DE LUMINARIAS";
    } */

    var allRows: AllRows[] = [
        {},
        {
          cells: [
            { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ],
          height: 30,
        }
    ];

    var cc = 0;

    var chk_par:boolean;
    var chk_mov:boolean;
    var table_width;

    this.data.forEach((table_data: any) => {
      if(table_data[1].length > 0){
        column_config = [];
        var p_cercano_width = 155;
        var referencia_width = 165;

        bol_datos_ex = true;

        var nom_vehi = table_data[0][1];
        var ruta = "";
        /* if (vm.optionR() == 28) {
            vm.period = data[3][10];
            ruta  = "RUTA : " + data[3][11];

            if (vrs == 1) {
                cc = cc + 1;
                nom_vehi = nom_vehi + " - " +cc;
            }
        } */

        table_width = 2 + (this.chkDateHour? 4:2) + 1 + (table_data[2].Paradas? 3:0) + (table_data[2].Movimientos? 3:0);
        var vehiculo_width = table_width<=8? 3:4;
        var ruta_width = table_width<=5? 1: table_width<=8? 3: 4;
        /* var vehiculo_width = table_width<=8? 2:3;
        var col_spacer = table_width<=5? 0: table_width<=8? 1: 2; */

        var rows: AllRows[] = [
          {},
          {
            cells: [
              { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
            ],
            height: 30,
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + table_data[0][1], bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: vehiculo_width },
              { value: ruta	,											 bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: ruta==""? 1: ruta_width },
              { value: "PERIODO : " + this.period,  bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width - (vehiculo_width +(ruta==""? 1:ruta_width)) },
            /* cells: [
              { value: "VEHÍCULO : " + data[0][1], bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: vehiculo_width },
              { value: ruta	,											 bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: col_spacer },
              { value: "PERIODO : " + this.period,  bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width - (col_spacer + vehiculo_width) }, */
            ]
          },
          {}
        ];

        console.log("************** DD");
        console.log(table_data);
        console.log("************** DD");

        var cellsCampos = [];

        //----------- CABECERA ------------
        cellsCampos.push({ value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        cellsCampos.push({ value: "Estado", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        if (this.chkDateHour) {
          cellsCampos.push({ value: "Fecha de Inicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Hora de Inicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Fecha de Fin", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Hora de Fin", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        } else {
          cellsCampos.push({ value: "Inicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Fin", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        }

        cellsCampos.push({ value: "Duración", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        /* if (vm.optionUser() == 445 ) {  cellsCampos.push({ value: "H.Acumuladas", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });  }; */

        if ( table_data[2].Paradas == true) 		{ cellsCampos.push({ value: "Posición detenida", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });  };
        if ( table_data[2].Movimientos == true) { cellsCampos.push({ value: "Recorrido", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });					};
        if ( table_data[2].Movimientos == true) { cellsCampos.push({ value: "Velocidad máxima", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });		};
        if ( table_data[2].Paradas == true)			{ cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); 			};
        if ( table_data[2].Movimientos == true) { cellsCampos.push({ value: "Velocidad Promedio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });	};
        if ( table_data[2].Paradas == true)			{ cellsCampos.push({ value: "Referencia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); 			};

        // <td ng-if="dato[2].ubicacion" ><a href="http://maps.google.com/maps?q={{dat.lat.toFixed(6)}},{{dat.lng.toFixed(6)}}&amp;t=m" target="_blank">{{dat.lat.toFixed(6)}},{{dat.lng.toFixed(6)}}</a></td>

        rows.push({
          cells: cellsCampos
        });

        console.log(table_data[2].Paradas+"   --- x --   "+table_data[2].Movimientos);

        if ( table_data[2].Paradas == true && table_data[2].Movimientos == true ) {

          table_data[1].forEach((item: { latitud: number; longitud: number; estado: any; fecha: any; fechasig: any; duracion: any; h_acumuladas: any; esInt: number; pCercano: any; referencia: any; recorrido: any; maxima_velocidad: any; vel_max_can: any; vel_promedio: any; vel_prom_can: any; }, index: number) => {
                var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
                var cellsCuerpo = [];
                p_cercano_width = Math.max(p_cercano_width, item.pCercano.length * this.char_to_px);
                referencia_width = Math.max(referencia_width, item.referencia.length * this.char_to_px);

                cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                cellsCuerpo.push({ value: item.estado, vAlign: "center", hAlign: "center", fontSize: this.c1 });

                if (this.chkDateHour) {
                  // var fh = item.fecha.split(" ");
                  // var fh2 = item.fechasig.split(" ");

                  cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                  cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                  cellsCuerpo.push({ value: this.isChe(item.fechasig), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                  cellsCuerpo.push({ value: this.isChs(item.fechasig), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });

                } else {
                  cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                  cellsCuerpo.push({ value: this.isChe(item.fechasig), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                }

                cellsCuerpo.push({ value: item.duracion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                /* if (vm.optionUser() == 445 ) {  cellsCuerpo.push({ value: item.h_acumuladas, vAlign: "center", hAlign: "center", fontSize: this.c1 });  }; */

                if (item.esInt == 0) {
                    cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.pCercano, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.referencia, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                }

                if (item.esInt == 1) {
                    cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.recorrido, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.maxima_velocidad, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.vel_promedio, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                }

                rows.push({
                  cells:cellsCuerpo
                });
            });
        }

        if ( table_data[2].Paradas == true && table_data[2].Movimientos == false ) {

          table_data[1].forEach((item: { esInt: number; latitud: number; longitud: number; estado: any; fecha: any; fechasig: any; duracion: any; h_acumuladas: any; pCercano: any; referencia: any; }, index: number) => {
                if (item.esInt==0) {
                    var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
                    var cellsCuerpo = [];
                    p_cercano_width = Math.max(p_cercano_width, item.pCercano.length * this.char_to_px);
                    referencia_width = Math.max(referencia_width, item.referencia.length * this.char_to_px);

                    cellsCuerpo.push({ value: ( Math.floor(index/2) + 1 ), vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.estado, vAlign: "center", hAlign: "center", fontSize: this.c1 });

                    if (this.chkDateHour) {
                      cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChe(item.fechasig), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChs(item.fechasig), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });

                    } else {
                      cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChe(item.fechasig), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    }

                    cellsCuerpo.push({ value: item.duracion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    /* if (vm.optionUser() == 445 ) {  cellsCuerpo.push({ value: item.h_acumuladas, vAlign: "center", hAlign: "center", fontSize: this.c1 });  }; */

                    cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    // cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    // cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.pCercano, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    // cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.referencia, vAlign: "center", hAlign: "center", fontSize: this.c1 });

                    rows.push({
                      cells:cellsCuerpo
                    });
                }

            });
        }


        if (  table_data[2].Paradas == false && table_data[2].Movimientos == true ) {

          table_data[1].forEach((item: { esInt: number; latitud: number; longitud: number; estado: any; fecha: any; fechasig: any; duracion: any; h_acumuladas: any; recorrido: any; maxima_velocidad: any; vel_max_can: any; vel_promedio: any; vel_prom_can: any; }, index: number) => {

                if (item.esInt == 1) {
                    var cellsCuerpo = [];

                    cellsCuerpo.push({ value: ( Math.floor(index/2) + 1 ), vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.estado, vAlign: "center", hAlign: "center", fontSize: this.c1 });

                    if (this.chkDateHour) {
                      cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChe(item.fechasig), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChs(item.fechasig), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    } else {
                      cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                      cellsCuerpo.push({ value: this.isChe(item.fechasig), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    }

                    cellsCuerpo.push({ value: item.duracion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    /* if (vm.optionUser() == 445 ) {  cellsCuerpo.push({ value: item.h_acumuladas, vAlign: "center", hAlign: "center", fontSize: this.c1 });  }; */

                    // cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.recorrido, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.maxima_velocidad, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    // cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    cellsCuerpo.push({ value: item.vel_promedio, vAlign: "center", hAlign: "center", fontSize: this.c1 });
                    // cellsCuerpo.push({ value: "--", vAlign: "center", hAlign: "center", fontSize: this.c1 });

                    rows.push({
                      cells:cellsCuerpo
                    });
                }

            });
        }

        // //************************** RESUMEN*******************

        rows.push({},
          {
            cells: [
              { value: "LONGITUD DE RUTA : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[3][0], vAlign: "center", hAlign: "center", fontSize: this.r1 }
            ]
          },
          {
            cells: [
              { value: "DURACIÓN DE MOVIMIENTO : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[3][1], vAlign: "center", hAlign: "center", fontSize: this.r1 }
            ]
          },
          {
            cells: [
              { value: "DURACIÓN DETENIDO : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[3][2], vAlign: "center", hAlign: "center", fontSize: this.r1 }
            ]
          },
          {
            cells: [
              { value: "VELOCIDAD MÁS ALTA : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[3][3], vAlign: "center", hAlign: "center", fontSize: this.r1 }
            ]
          },
          {
            cells: [
              { value: "VELOCIDAD PROMEDIO : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[3][4], vAlign: "center", hAlign: "center", fontSize: this.r1 }
            ]
          }
        );
        /* if (vm.optionUser() == 445 ) {
          rows.push(
            {
              cells: [
                { value: "HORAS TRABAJADAS EN EL PERIODO: ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                { value: data[3][5], vAlign: "center", hAlign: "center", fontSize: this.r1 }
              ]
            },
            {
              cells: [
                { value: "TOTAL DE HORAS TRABAJADAS : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                { value: data[3][6], vAlign: "center", hAlign: "center", fontSize: this.r1 }
              ]
            }
          )
        };
        */

        // //********************************************* excel version 2 *********************************
        if ( vrs == 2 ) {
          if( chk_par === undefined || chk_mov === undefined ) {
            chk_par = table_data[2].Paradas;
            chk_mov = table_data[2].Movimientos;
          }
          p_cercano_max_width = Math.max(p_cercano_max_width, p_cercano_width);
          referencia_max_width = Math.max(referencia_max_width, referencia_width);
          rows.splice(1, 1);
          allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************

        // //********************************************* excel version 1 *********************************

        /* Ancho de Columnas */

        if( vrs == 1 ){
          column_config = [
            { width: this.w_item },
            { width: 120 },
          ];
          if(this.chkDateHour){
            column_config.push(
              { width: this.w_date_hour },
              { width: this.w_date_hour },
              { width: this.w_date_hour },
              { width: this.w_date_hour },
            )
          } else {
            column_config.push(
              { width: this.w_date_and_hour },
              { width: this.w_date_and_hour },
            )
          }
          column_config.push({ width: this.w_duracion});
          if( table_data[2].Paradas && table_data[2].Movimientos ){
            column_config.push(
              { width: 190 },
              { width: 90 },
              { width: 150 },
              { width: Math.floor( p_cercano_width / 1.28 ) },
              { width: 165 },
              { width: Math.floor( referencia_width / 1.28 ) },
            )
          }
          if( !table_data[2].Paradas && table_data[2].Movimientos ){
            column_config.push(
              { width: 90 },
              { width: 150 },
              { width: 165 },
            )
          }
          if( table_data[2].Paradas && !table_data[2].Movimientos ){
            column_config.push(
              { width: this.w_lat_long },
              { width: Math.floor( p_cercano_width / 1.28 ) },
              { width: Math.floor( referencia_width / 1.28 ) },
            )
          }

          /* Fin Ancho de Columnas */

          exportFileEx.push({
            freezePane: {
                rowSplit: 6
              },
            columns: column_config,
            title: nom_vehi,
            rows: rows
          });
        }

        // //********************************************* excel version 1 *********************************



      } // if si hay datos del vehiculo
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      allRows[1].cells![0].colSpan = table_width;

      column_config = [
        { width: this.w_item },
        { width: 120 },
      ];
      if(this.chkDateHour){
        column_config.push(
          { width: this.w_date_hour },
          { width: this.w_date_hour },
          { width: this.w_date_hour },
          { width: this.w_date_hour },
        )
      } else {
        column_config.push(
          { width: this.w_date_and_hour },
          { width: this.w_date_and_hour },
        )
      }
      column_config.push({ width: this.w_duracion});
      if( chk_par! && chk_mov! ){
        column_config.push(
          { width: 190 },
          { width: 90 },
          { width: 150 },
          { width: Math.floor( p_cercano_max_width / 1.28 ) },
          { width: 165 },
          { width: Math.floor( referencia_max_width / 1.28 ) },
        )
      }
      if( !chk_par! && chk_mov! ){
        column_config.push(
          { width: 90 },
          { width: 150 },
          { width: 165 },
        )
      }
      if( chk_par! && !chk_mov! ){
        column_config.push(
          { width: this.w_lat_long },
          { width: Math.floor( p_cercano_max_width / 1.28 ) },
          { width: Math.floor( referencia_max_width / 1.28 ) },
        )
      }

      exportFileEx.push({
        freezePane: {
            rowSplit: 2
          },
        columns: column_config,
        title: "Resultado",//data[0][1],
        rows: allRows
      });
        /* exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 50 },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },
            { autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },
            { autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },
            { autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },
            { autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true },{ autoWidth: true }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        }); */
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    var nom_inf_xls = "ReporteParadasMovimientos.xlsx";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf_xls = "ReporteLuminarias.xlsx";
    } */

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: nom_inf_xls
      });

    } else {
      this.toastr.error("No se han encontrado datos para exportar");
      /* alert('No se han encontrado datos para exportar'); */
    }
  }

  exportExcelExcesosVelocidad(vrs: number) {
    /* vm.dateHour() y datee; //Obtiene el chkDateHour para separar las columnas de fecha y hora*/

    var exportFileEx = [];
    var bol_datos_ex = false;
    var column_config:Columns[] = [];
    var p_cercano_max_width = 155;
    var z_cercana_max_width = 165;

    var nom_inf = "REPORTE DE EXCESOS DE VELOCIDAD";

    var allRows: AllRows[] = [
        {},
        {
          cells: [
            { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 3 }
          ],
          height: 30,
        }
    ];

    var table_width;

    this.data.forEach((table_data: any) => {
      if(table_data[1].length > 0){
        column_config = [];
        var p_cercano_width = 155;
        var z_cercana_width = 165;

        bol_datos_ex = true;

        var nom_vehi = table_data[0][1];
        /* if (vm.optionR() == 28) {
            vm.period = data[3][10];
            ruta  = "RUTA : " + data[3][11];

            if (vrs == 1) {
                cc = cc + 1;
                nom_vehi = nom_vehi + " - " +cc;
            }
        } */

        table_width = this.chkDuracion? (1 + (this.chkDateHour? 4:2) + 8): (2 + (this.chkDateHour? 2:1) + 3);
        var vehiculo_width = this.chkDuracion? ((this.chkDateHour? 6:4)): (this.chkDateHour? 4:3);


        /* Table Header */

        var rows: AllRows[] = [
          {},
          {
            cells: [
              { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
            ],
            height: 36,
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + table_data[0][1], bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: vehiculo_width },
              { value: "PERIODO : " + this.period,  bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width - vehiculo_width },
            ]
          },
          {}
        ];

        /* Table Body */

        var cellsCampos = [];

        //----------- CABECERA ------------
        if(this.chkDuracion){

          cellsCampos.push({ value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          if (this.chkDateHour) {
            cellsCampos.push({ value: "Fecha de Inicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
            cellsCampos.push({ value: "Hora de Inicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
            cellsCampos.push({ value: "Fecha de Fin", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
            cellsCampos.push({ value: "Hora de Fin", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          } else {
            cellsCampos.push({ value: "Inicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
            cellsCampos.push({ value: "Fin", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          }

          cellsCampos.push({ value: "Duración", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Cant. de Tramas", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
          cellsCampos.push({ value: "Tramas", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Vel. Min.", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Vel. Máx.", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Zona Cercana", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        } else {

          cellsCampos.push({ value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Nombre", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

          if (this.chkDateHour) {
            cellsCampos.push({ value: "Fecha", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
            cellsCampos.push({ value: "Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          } else {
            cellsCampos.push({ value: "Fecha y Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          }

          cellsCampos.push({ value: "Máxima Velocidad", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        }

        rows.push({
          cells: cellsCampos,
          height: 50,
        });

        //----------- CONTENIDO / FILAS ------------

        if(this.chkDuracion){

          table_data[1].forEach((item: { latitud: number; longitud: number; nombre: any; fecha_inicial: any; fecha_final: any; PC: any; ZC: any; vel_min: any; vel_max: any; vel_min_can: any; vel_max_can: any; cant_tramas: string; string_tramas: any; duracion: string; }, index: number) => {
            var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
            var cellsCuerpo = [];

            p_cercano_width = Math.max(p_cercano_width, item.PC.length * this.char_to_px);
            z_cercana_width = Math.max(z_cercana_width, item.ZC.length * this.char_to_px);

            cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });

            if (this.chkDateHour) {
              cellsCuerpo.push({ value: this.isChe(item.fecha_inicial), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              cellsCuerpo.push({ value: this.isChs(item.fecha_inicial), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              cellsCuerpo.push({ value: this.isChe(item.fecha_final), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              cellsCuerpo.push({ value: this.isChs(item.fecha_final), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            } else {
              cellsCuerpo.push({ value: this.isChe(item.fecha_inicial), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              cellsCuerpo.push({ value: this.isChe(item.fecha_final), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            }
            cellsCuerpo.push({ value: item.duracion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.cant_tramas, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.string_tramas, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.vel_min, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.vel_max, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.ZC, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });

            rows.push({
              cells:cellsCuerpo
            });
          });

        } else {

          table_data[1].forEach((item: { latitud: number; longitud: number; nombre: any; fecha: any; PC: any; referencia: any; maxima_velocidad: any; vel_max_can: any; vel_promedio: any; vel_prom_can: any; }, index: number) => {
            var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
            var cellsCuerpo = [];

            p_cercano_width = Math.max(p_cercano_width, item.PC.length * this.char_to_px);

            cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.nombre, vAlign: "center", hAlign: "center", fontSize: this.c1 });

            if (this.chkDateHour) {
              cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            } else {
              cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            }
            cellsCuerpo.push({ value: item.maxima_velocidad, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 });

            rows.push({
              cells:cellsCuerpo
            });
          });

        }



        // //********************************************* excel version 2 *********************************
        if ( vrs == 2 ) {
          p_cercano_max_width = Math.max(p_cercano_max_width, p_cercano_width);
          z_cercana_max_width = Math.max(z_cercana_max_width, z_cercana_width);
          rows.splice(1, 1);
          allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************

        // //********************************************* excel version 1 *********************************

        /* Ancho de Columnas */

        if( vrs == 1 ){
          if(this.chkDuracion){

            column_config = [
              { width: this.w_item },
            ];
            if(this.chkDateHour){
              column_config.push(
                { width: this.w_date_hour },
                { width: this.w_date_hour },
                { width: this.w_date_hour },
                { width: this.w_date_hour },
              )
            } else {
              column_config.push(
                { width: this.w_date_and_hour },
                { width: this.w_date_and_hour },
              )
            }
            column_config.push(
              { width: 120 },
              { width: 120 },
              { width: 600 },
              { width: 120 },
              { width: 120 },
              { width: Math.floor(p_cercano_width / 1.28) },
              { width: Math.floor(z_cercana_width / 1.28) },
              { width: this.w_lat_long },
            )

          } else {

            column_config = [
              { width: this.w_item },
              { width: 120 },
            ];
            if(this.chkDateHour){
              column_config.push(
                { width: this.w_date_hour },
                { width: this.w_date_hour },
              )
            } else {
              column_config.push(
                { width: this.w_date_and_hour },
              )
            }
            column_config.push(
              { width: 160 },
              { width: this.w_lat_long },
              { width: Math.floor( p_cercano_width / 1.28 ) },
            )

          }

          /* Fin Ancho de Columnas */

          exportFileEx.push({
            freezePane: {
                rowSplit: 6
              },
            columns: column_config,
            title: nom_vehi,
            rows: rows
          });
        }
        // //********************************************* excel version 1 *********************************



      } // if si hay datos del vehiculo
    });

    //NOTA: width * 1.28 (aprox) = Ancho de columna en excel

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      allRows[1].cells![0].colSpan = table_width;

      if(this.chkDuracion){

        column_config = [
          { width: this.w_item },
        ];
        if(this.chkDateHour){
          column_config.push(
            { width: this.w_date_hour },
            { width: this.w_date_hour },
            { width: this.w_date_hour },
            { width: this.w_date_hour },
          )
        } else {
          column_config.push(
            { width: this.w_date_and_hour },
            { width: this.w_date_and_hour },
          )
        }
        column_config.push(
          { width: 120 },
          { width: 120 },
          { width: 400 },
          { width: 120 },
          { width: 120 },
          { width: Math.floor(p_cercano_max_width / 1.28) },
          { width: Math.floor(z_cercana_max_width / 1.28) },
          { width: this.w_lat_long },
        )

      } else {

        column_config = [
          { width: this.w_item },
          { width: 120 },
        ];
        if(this.chkDateHour){
          column_config.push(
            { width: this.w_date_hour },
            { width: this.w_date_hour },
          )
        } else {
          column_config.push(
            { width: this.w_date_and_hour },
          )
        }
        column_config.push(
          { width: 160 },
          { width: this.w_lat_long },
          { width: Math.floor( p_cercano_max_width / 1.28 ) },
        )

      }

      exportFileEx.push({
        freezePane: {
            rowSplit: 2
          },
        columns: column_config,
        title: "Resultado",//data[0][1],
        rows: allRows
      });

    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    var nom_inf_xls = "ReporteExcesosVelocidad.xlsx";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf_xls = "ReporteLuminarias.xlsx";
    } */

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: nom_inf_xls
      });

    } else {
      this.toastr.error("No se han encontrado datos para exportar");
      /* alert('No se han encontrado datos para exportar'); */
    }
  }

  exportExcelEntradaSalida(vrs: number) {
    var exportFileEx = [];
    var bol_datos_ex = false;
    var column_config:Columns[] = [];
    var p_cercano_max_width = 155;
    var z_nombre_max_width = 165;

    var nom_inf = "REPORTE DE ENTRADA Y SALIDA";

    var allRows: AllRows[] = [
        {},
        {
          cells: [
            { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 3 }
          ],
          height: 30,
        }
    ];

    var table_width;

    this.data.forEach((table_data: any) => {
      if(table_data[1].length > 0){
        column_config = [];
        var p_cercano_width = 155;
        var z_nombre_width = 165;

        bol_datos_ex = true;

        var nom_vehi = table_data[0][1];

        table_width = 1 + (this.chkDateHour? 4:2) + 4;
        var vehiculo_width = (this.chkDateHour? 4:3);


        /* Table Header */

        var rows: AllRows[] = [
          {},
          {
            cells: [
              { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
            ],
            height: 36,
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + table_data[0][1], bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: vehiculo_width },
              { value: "PERIODO : " + this.period,  bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width - vehiculo_width },
            ]
          },
          {}
        ];

        /* Table Body */

        var cellsCampos = [];

        //----------- CABECERA ------------
        cellsCampos.push({ value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        if (this.chkDateHour) {
          cellsCampos.push({ value: "Fecha de Entrada", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Hora de Entrada", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Fecha de Salida", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Hora de Salida", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        } else {
          cellsCampos.push({ value: "Fecha de Entrada", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Fecha de Salida", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        }

        cellsCampos.push({ value: "Duración", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        cellsCampos.push({ value: "Nombre de Zona", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        cellsCampos.push({ value: "Posición de Zona", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        rows.push({
          cells: cellsCampos,
        });

        //----------- CONTENIDO / FILAS ------------
        table_data[1].forEach((item: { latitud: number; longitud: number; nombre_zona: any; fecha: any; fecha_out: any; PC: any; duracion: string; }, index: number) => {

          var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
          var cellsCuerpo = [];

          p_cercano_width = Math.max(p_cercano_width, item.PC.length * this.char_to_px);
          z_nombre_width = Math.max(z_nombre_width, item.nombre_zona.length * this.char_to_px);

          cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });

          if (this.chkDateHour) {
            cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: this.isChe(item.fecha_out), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: this.isChs(item.fecha_out), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
          } else {
            cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: this.isChe(item.fecha_out), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
          }
          cellsCuerpo.push({ value: item.duracion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.nombre_zona, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 });

          rows.push({
            cells:cellsCuerpo
          });
        });

        // //********************************************* excel version 2 *********************************
        if ( vrs == 2 ) {
          p_cercano_max_width = Math.max(p_cercano_max_width, p_cercano_width);
          z_nombre_max_width = Math.max(z_nombre_max_width, z_nombre_width);
          rows.splice(1, 1);
          allRows = allRows.concat(rows);
        }

        // //********************************************* excel version 1 *********************************

        /* Ancho de Columnas */

        if( vrs == 1 ){
          column_config = [
            { width: this.w_item },
          ];
          if(this.chkDateHour){
            column_config.push(
              { width: this.w_date_hour },
              { width: this.w_date_hour },
              { width: this.w_date_hour },
              { width: this.w_date_hour },
            )
          } else {
            column_config.push(
              { width: this.w_date_and_hour },
              { width: this.w_date_and_hour },
            )
          }
          column_config.push(
            { width: 120 },
            { width: Math.floor(z_nombre_width / 1.28) },
            { width: this.w_lat_long },
            { width: Math.floor(p_cercano_width / 1.28) },
          );

          /* Fin Ancho de Columnas */

          exportFileEx.push({
            freezePane: {
                rowSplit: 6
              },
            columns: column_config,
            title: nom_vehi,
            rows: rows
          });
        }

      } // if si hay datos del vehiculo
    });

    //NOTA: width * 1.28 (aprox) = Ancho de columna en excel

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      allRows[1].cells![0].colSpan = table_width;

      column_config = [
        { width: this.w_item },
      ];
      if(this.chkDateHour){
        column_config.push(
          { width: this.w_date_hour },
          { width: this.w_date_hour },
          { width: this.w_date_hour },
          { width: this.w_date_hour },
        )
      } else {
        column_config.push(
          { width: this.w_date_and_hour },
          { width: this.w_date_and_hour },
        )
      }
      column_config.push(
        { width: 120 },
        { width: Math.floor(z_nombre_max_width / 1.28) },
        { width: this.w_lat_long },
        { width: Math.floor(p_cercano_max_width / 1.28) },
      );

      exportFileEx.push({
        freezePane: {
            rowSplit: 2
          },
        columns: column_config,
        title: "Resultado",//data[0][1],
        rows: allRows
      });

    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    var nom_inf_xls = "ReporteEntradaSalida.xlsx";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf_xls = "ReporteLuminarias.xlsx";
    } */

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: nom_inf_xls
      });

    } else {
      this.toastr.error("No se han encontrado datos para exportar");
      /* alert('No se han encontrado datos para exportar'); */
    }
  }

  exportExcelCombustible(vrs: number) {
    var exportFileEx = [];
    var bol_datos_ex = false;
    var column_config:Columns[] = [];

    var nom_inf = "REPORTE DE COMBUSTIBLE";

    var allRows: AllRows[] = [
        {},
        {
          cells: [
            { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 3 }
          ],
          height: 30,
        }
    ];

    var cc = 0;

    var table_width;

    this.data.forEach((table_data: any) => {
      if(table_data[1].length > 0){
        column_config = [];

        bol_datos_ex = true;

        var nom_vehi = table_data[0][1];

        table_width = 1 + (this.chkDateHour? 2:1) + 12;
        var vehiculo_width = (this.chkDateHour? 7:5);


        /* Table Header */

        var rows: AllRows[] = [
          {},
          {
            cells: [
              { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
            ],
            height: 36,
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + table_data[0][1], bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: vehiculo_width },
              { value: "PERIODO : " + this.period,  bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width - vehiculo_width },
            ]
          },
          {}
        ];

        /* Table Body */

        var cellsCampos = [];

        //----------- CABECERA ------------
        cellsCampos.push({ value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        cellsCampos.push({ value: "Fecha", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        if (this.chkDateHour) {
          cellsCampos.push({ value: "Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        }

        cellsCampos.push({ value: "Velocidad (km/h)", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Nivel de Combustible", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Consumo de Combustible (litros)", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Consumo HRFC (litros)", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Combustible Restante (galones)", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Contacto de Motor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });

        if(this.chkOdomV){
          cellsCampos.push({ value: "Odómetro Virtual", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        } else {
          cellsCampos.push({ value: "Odómetro", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3});
        }

        cellsCampos.push({ value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3});
        cellsCampos.push({ value: "Mensaje de Alerta", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true});
        cellsCampos.push({ value: "Combustible Alerta (galones)", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true});
        cellsCampos.push({ value: "can_rpm", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3});
        cellsCampos.push({ value: "Altitud", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3});

        rows.push({
          cells: cellsCampos,
        });

        //----------- CONTENIDO / FILAS ------------
        table_data[1].forEach((item: { latitud: number; longitud: number; can_speed: any; fuel_level: any; fuel_used: any; can_HRFC: any; combusrestante: any; di4: any; can_dist: any; alerta: any; combustiblealerta: any; can_rpm: any; altitude: any; fecha: any; }, index: number) => {

          var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
          var cellsCuerpo = [];

          cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });

          if (this.chkDateHour) {
            cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
          } else {
            cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
          }
          cellsCuerpo.push({ value: item.can_speed, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: this.isNumber(item.fuel_level)? item.fuel_level.toFixed(2): item.fuel_level, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.fuel_used, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.can_HRFC, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.combusrestante, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.di4 == 0? 'Cerrado': (item.di4 == 1? 'Abierto': '-'), vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: this.isNumber(item.can_dist)? item.can_dist.toFixed(2): item.can_dist, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.alerta, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.combustiblealerta, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.can_rpm, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.altitude, vAlign: "center", hAlign: "center", fontSize: this.c1 });

          rows.push({
            cells:cellsCuerpo
          });
        });

        rows.push({},
          {
            cells: [
              { value: "TOTAL DE DISTANCIA RECORRIDA : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[2][0], vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 2 }
            ]
          },
          {
            cells: [
              { value: "TOTAL DE COMBUSTIBLE CONSUMIDO : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[2][1], vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 2 }
            ]
          },
          {
            cells: [
              { value: "TOTAL DE COMBUSTIBLE HRFC CONSUMIDO : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[2][2], vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 2 }
            ]
          },
          {
            cells: [
              { value: "RENDIMIENTO POR GALÓN : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
              { value: table_data[2][3], vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 2 }
            ]
          }
        );

        // //********************************************* excel version 2 *********************************
        if ( vrs == 2 ) {
          rows.splice(1, 1);
          allRows = allRows.concat(rows);
        }

        // //********************************************* excel version 1 *********************************

        /* Ancho de Columnas */

        if( vrs == 1 ){
          column_config = [
            { width: this.w_item },
          ];
          if(this.chkDateHour){
            column_config.push(
              { width: this.w_date_hour },
              { width: this.w_date_hour },
            )
          } else {
            column_config.push(
              { width: this.w_date_and_hour },
            )
          }
          column_config.push(
            { width: this.w_velocidad },
            { width: 116 },
            { width: 120 },
            { width: 120 },
            { width: 120 },
            { width: 120 },
            { width: this.w_odometro },
            { width: this.w_lat_long },
            { width: 120 },
            { width: 120 },
            { width: 80 },
            { width: 80 },
          );

          /* Fin Ancho de Columnas */

          exportFileEx.push({
            freezePane: {
                rowSplit: 6
              },
            columns: column_config,
            title: nom_vehi,
            rows: rows
          });
        }

      } // if si hay datos del vehiculo
    });

    //NOTA: width * 1.28 (aprox) = Ancho de columna en excel

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      allRows[1].cells![0].colSpan = table_width;

      column_config = [
        { width: this.w_item },
      ];
      if(this.chkDateHour){
        column_config.push(
          { width: this.w_date_hour },
          { width: this.w_date_hour },
        )
      } else {
        column_config.push(
          { width: this.w_date_and_hour },
        )
      }
      column_config.push(
        { width: this.w_velocidad },
        { width: 116 },
        { width: 120 },
        { width: 120 },
        { width: 120 },
        { width: 120 },
        { width: this.w_odometro },
        { width: this.w_lat_long },
        { width: 120 },
        { width: 120 },
        { width: 80 },
        { width: 80 },
      );

      exportFileEx.push({
        freezePane: {
            rowSplit: 2
          },
        columns: column_config,
        title: "Resultado",//data[0][1],
        rows: allRows
      });

    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    var nom_inf_xls = "ReporteCombustible.xlsx";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf_xls = "ReporteLuminarias.xlsx";
    } */

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: nom_inf_xls
      });

    } else {
      this.toastr.error("No se han encontrado datos para exportar");
      /* alert('No se han encontrado datos para exportar'); */
    }
  }

  exportExcelGeneral(vrs: number) {
    //vm.dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    var allRows: AllRows[] = [
        {}, {
          cells: [
            { value: "REPORTE GENERAL", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE GENERAL", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        //=================CABECERA =================
        var cellsCampos :any = [];

        cellsCampos.push({ value: "Item", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        if(this.chkDateHour) {
            cellsCampos.push({ value: "Fecha", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
            cellsCampos.push({ value: "Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        } else {
            cellsCampos.push({ value: "Fecha", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        }

        if (data[2].fServidor) {
                if(this.chkDateHour) {
                    cellsCampos.push({ value: "Fecha servidor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
                    cellsCampos.push({ value: "Hora servidor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
                } else {
                    cellsCampos.push({ value: "Fecha servidor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
                }

        };
        if (data[2].ubicacion) { cellsCampos.push({ value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velGPS) { cellsCampos.push({ value: "Velocidad GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velECO) { cellsCampos.push({ value: "Velocidad ECO", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velGPS_speed) { cellsCampos.push({ value: "Velocidad GPS speed", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };

        if (data[2].altitud) { cellsCampos.push({ value: "Altitud", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].angulo) { cellsCampos.push({ value: "Angulo", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].fatiga) { cellsCampos.push({ value: "Fatiga", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].fExBrusca) { cellsCampos.push({ value: "Frenada Extrema Brusca", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].fBrusca) { cellsCampos.push({ value: "Frenada Brusca", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].aBrusca) { cellsCampos.push({ value: "Aceleración Brusca", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].RPMAlta) { cellsCampos.push({ value: "RPM Alta", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };

        if (data[2].alcoholemia) { cellsCampos.push({ value: "Alcoholemia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].parametros) { cellsCampos.push({ value: "Parámetros", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].cNivel) { cellsCampos.push({ value: "Nivel de Combustible", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].cRestante) { cellsCampos.push({ value: "C.Restante", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].cMotor) { cellsCampos.push({ value: "C.Motor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].odometro) { cellsCampos.push({ value: "Odómetro", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].onOff) { cellsCampos.push({ value: "On/Off", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].RxM) { cellsCampos.push({ value: "Rev.X.Min", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].recFacial) { cellsCampos.push({ value: "Reconocimiento Facial", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velCAN) { cellsCampos.push({ value: "Velocidad CAN", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].pCercano) { cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].referencia) { cellsCampos.push({ value: "Referencia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].DUOT2state) { cellsCampos.push({ value: "DUOT2 state", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };

        rows.push({
            cells: cellsCampos
        });

        //================= FIN CABECERA =================

        //====================  CUERPO =============================
        data[1].forEach((item: { fecha: number;  lat: number; lng: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any;
          vel_gps_speed: any; vel_can: any; tramo: string; PC: any;
        referencia:any; fServidor:any; velGPS:any; velECO:any; velGPS_speed:any; altitud:any; angulo:any; fatiga:any; fExBrusca:any; fBrusca:any; aBrusca:any; RPMAlta:any;
        alcohol_nombre:any; parametros:any; cNivel:any; cRestante:any; cMotor:any; odometro:any; onOff:any; RxM:any; recFacial:any; velCAN:any; pCercano:any; DUOT2state:any;
        }, index: number) => {


            var ubicacion = item.lat + "," + item.lng + "";
            var rreeff = ((item.referencia == "NN") ? '' : item.referencia);

            var cellsCuerpo = [];
            cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });
            if(this.chkDateHour) {
                cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                cellsCuerpo.push({ value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            } else {
                cellsCuerpo.push({ value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            }


            if (data[2].fServidor) {
              if(this.chkDateHour) {
                  //var fh2 = item.fServidor.split(" ");
                  cellsCuerpo.push({ value: this.isChe(item.fServidor), type: 'date', format: "yyyy/MM/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
                  cellsCuerpo.push({ value: this.isChs(item.fServidor), type: 'date', format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              } else {
                  cellsCuerpo.push({ value: this.isChe(item.fServidor), type: 'date', format: "yyyy/MM/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
              }
            };

            if (data[2].ubicacion) { cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velGPS) { cellsCuerpo.push({ value: item.velGPS, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velECO) { cellsCuerpo.push({ value: item.velECO, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velGPS_speed) { cellsCuerpo.push({ value: item.velGPS_speed, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };


            if (data[2].altitud) { cellsCuerpo.push({ value: item.altitud, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].angulo) { cellsCuerpo.push({ value: item.angulo, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].fatiga) { cellsCuerpo.push({ value: item.fatiga, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].fExBrusca) { cellsCuerpo.push({ value: item.fExBrusca, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].fBrusca) { cellsCuerpo.push({ value: item.fBrusca, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].aBrusca) { cellsCuerpo.push({ value: item.aBrusca, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].RPMAlta) { cellsCuerpo.push({ value: item.RPMAlta, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };

            if (data[2].alcoholemia) { cellsCuerpo.push({ value: item.alcohol_nombre, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].parametros) { cellsCuerpo.push({ value: item.parametros, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].cNivel) { cellsCuerpo.push({ value: item.cNivel, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].cRestante) { cellsCuerpo.push({ value: item.cRestante, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].cMotor) { cellsCuerpo.push({ value: item.cMotor, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].odometro) { cellsCuerpo.push({ value: item.odometro, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].onOff) { cellsCuerpo.push({ value: item.onOff, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].RxM) { cellsCuerpo.push({ value: item.RxM, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].recFacial) { cellsCuerpo.push({ value: item.recFacial, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velCAN) { cellsCuerpo.push({ value: item.velCAN, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].pCercano) { cellsCuerpo.push({ value: item.pCercano, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].referencia) { cellsCuerpo.push({ value: rreeff, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };

            if (data[2].DUOT2state) { cellsCuerpo.push({ value: item.DUOT2state, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };

            rows.push({
                cells:cellsCuerpo
            });

        });
        //==================== FIN CUERPO =============================

        //==================== RESUMEN =============================
        rows.push({});

        rows.push({cells:[
          { value: "TOTAL de Excesos de Velocidad(GPS) : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
          { value: data[3][0], vAlign: "center", hAlign: "center", fontSize: this.r1 }  ]});

        rows.push({cells: [
                { value: "TOTAL de Excesos de Velocidad(ECO) : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                { value: data[3][1], vAlign: "center", hAlign: "center", fontSize: this.r1 }  ]});

        rows.push({cells: [
                { value: "TOTAL de Excesos de Velocidad(CAN) : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                { value: data[3][2], vAlign: "center", hAlign: "center", fontSize: this.r1 }  ]});

        if (data[2].fatiga) {
                rows.push({cells: [
                        { value: "TOTAL de Fatigas : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                        { value: data[3][3], vAlign: "center", hAlign: "center", fontSize: this.r1 }   ]});
        }
        if (data[2].fExBrusca) {
                rows.push({cells: [
                        { value: "TOTAL de Frenada Extremadamente Brusca : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                        { value: data[3][4], vAlign: "center", hAlign: "center", fontSize: this.r1 }   ]});
        }
        if (data[2].fBrusca) {
                rows.push({cells: [
                        { value: "TOTAL de Frenada Brusca : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                        { value: data[3][5], vAlign: "center", hAlign: "center", fontSize: this.r1 }   ]});
        }
        if (data[2].RPMAlta) {
                rows.push({cells: [
                        { value: "TOTAL RPM Alta : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                        { value: data[3][6], vAlign: "center", hAlign: "center", fontSize: this.r1 }   ]});
        }
        if (data[2].alcoholemia) {
                rows.push({cells: [
                        { value: "TOTAL de alerta de alcohol en la sangre : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                        { value: data[3][7], vAlign: "center", hAlign: "center", fontSize: this.r1 }   ]});
        }

        rows.push({cells: [
                { value: " ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
                { value: " ", vAlign: "center", hAlign: "center", fontSize: this.r1 }  ]});

        //======================= FIN RESUMEN =======================================================


        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
          exportFileEx.push({
          freezePane: {
            rowSplit: 6
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: data[0][1],
          rows: rows
          });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
          rows.splice(1, 1);
          allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************
      }

    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      exportFileEx.push({
        freezePane: {
          rowSplit: 2
        },
        columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
        ],
        title: "Resultado",//data[0][1],
        rows: allRows
      });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "ReporteGeneral.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }


  exportExcelEventos(vrs: number) {
    // dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    // var allRows = [
    var allRows: AllRows[] = [

        {}, {
          cells: [
            { value: "REPORTE DE EVENTOS", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];


    //this.data.forEach((table_data: any) => {

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        // var rows = [
        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE EVENTOS", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        if(this.chkDateHour) {


          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Evento", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Velocidad GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Velocidad CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Geocerca", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Referencia", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }
            ]
          });

          // data[1].forEach(function(item:any, index:any){

          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; nombre_objeto: any; descripcion_evento: any; fecha_tracker: any; velocidad: any; vel_can: any; nombre_zona: any; referencia: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({
              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.nombre_objeto, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.descripcion_evento, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: this.isChe(item.fecha_tracker), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha_tracker), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.velocidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.nombre_zona, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.referencia, vAlign: "center", hAlign: "center", fontSize: this.c1 },
              ]
            });
          });




        } else {

          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Evento", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha/Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Velocidad GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Velocidad CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Geocerca", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Referencia", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }

            ]
          });

          // data[1].forEach(function(item:any, index:any){
            data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; nombre_objeto: any; descripcion_evento: any; fecha_tracker: any; velocidad: any; vel_can: any; nombre_zona: any; referencia: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.nombre_objeto, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.descripcion_evento, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha_tracker), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.velocidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.nombre_zona, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.referencia, vAlign: "center", hAlign: "center", fontSize: this.c1 }
              ]

            });
          });

        }

        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: [
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
              ],
              title: data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
           rows.splice(1, 1);
           allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelEventos.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }


  exportExcelPosicion(vrs: number) {

    var exportFileEx = [];
    var bol_datos_ex = false;
    var column_config:Columns[] = [];

    var table_width = this.chkDateHour? 11:10;

    var nom_inf = "REPORTE DE POSICIÓN";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf = "REPORTE DE LUMINARIAS";
    } */

    var allRows: AllRows[] = [
        {},
        {
          cells: [
            { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
          ],
          height: 30,
        }
    ];

    var cc = 0;
    var status_cell_width = 83;
    var referencia_cell_width = 160;

    if(this.data.length > 0) {
        bol_datos_ex = true;
        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
            ]
          },
          {},
          {
            cells: [
              { value: this.rep_subtitle , color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width },
              // { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              // { value: "PERIODO : " + vm.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        if(this.chkDateHour) {
          rows.push({
            cells: [
              { value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

/*               { value: "Servicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Origen", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Destino", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }, */

              { value: "Fecha", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Status", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Velocidad GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Velocidad CAN", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Odómetro", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Referencia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              /* { value: "Zona Cercana", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Latitud/Longitud", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 } */

            ]
          });
          this.data.forEach((item: { latitud: number; longitud: number; codigo: any; placa: any; convoy: any; origen: any; destino: any; fecha: any; estado: any; velocidad: string; velocidad_can: any; odometro:any; zonaCercana: any; }, index: number) => {
            //var fh = item.fecha_final.split(" ");
            var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6);

            status_cell_width = Math.max(status_cell_width, item.estado.length * 11);
            referencia_cell_width = Math.max(referencia_cell_width, item.zonaCercana.length * 11);

            rows.push({
              cells: [
                { value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                /* { value: item.convoy, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.origen, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.destino, vAlign: "center", hAlign: "center", fontSize: this.c1 }, */

                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.estado, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velocidad+" km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velocidad_can+" km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.odometro, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { formula:  '=HYPERLINK("http://maps.google.com/maps?q='+ubicacion+'&amp;t=m","'+ubicacion+'")', vAlign: "center", hAlign: "center", fontSize: this.c1_2 },
                { value: item.zonaCercana, vAlign: "center", hAlign: "center", fontSize: this.c1 },
              ]
            });
          });

          //********************** RESUMEN ****************************

        } else {
          rows.push({
            cells: [
              { value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              /* { value: "Servicio", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Origen", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Destino", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }, */

              { value: "Fecha y Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Status", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Velocidad GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Velocidad CAN", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Odómetro", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Referencia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
            ]
          });

          this.data.forEach((item: { latitud: number; longitud: number; referencia: string; codigo: any; placa: any; convoy: any; origen: any; destino: any; fecha: any; estado: any; velocidad: string; velocidad_can: any; odometro:any; zonaCercana: any; }, index: number) => {
            var ubicacion = item.latitud + "," + item.longitud;
            var rreeff = ((item.referencia == "NN") ? '' : item.referencia);

            status_cell_width = Math.max(status_cell_width, item.estado.length * 11);
            referencia_cell_width = Math.max(referencia_cell_width, item.zonaCercana.length * 11);

            rows.push({
              cells: [
                { value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                /* { value: item.convoy, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.origen, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.destino, vAlign: "center", hAlign: "center", fontSize: this.c1 }, */

                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.estado, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velocidad+" km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velocidad_can+" km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.odometro, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { formula:  '=HYPERLINK("http://maps.google.com/maps?q='+ubicacion+'&amp;t=m","'+ubicacion+'")', vAlign: "center", hAlign: "center", fontSize: this.c1_2 },
                { value: item.zonaCercana, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

          //********************** RESUMEN ****************************

        }

        column_config = [
          { width: this.w_item },
          { width: this.w_codigo },
          { width: this.w_placa },
        ];
        if(this.chkDateHour){
          column_config.push(
            { width: this.w_date_hour },
            { width: this.w_date_hour },
          )
        } else {
          column_config.push(
            { width: this.w_date_and_hour },
          )
        }
        column_config.push({ width: status_cell_width});
        column_config.push({ width: this.w_velocidad_gps_can});
        column_config.push({ width: this.w_velocidad_gps_can});
        column_config.push({ width: this.w_odometro});
        column_config.push({ width: this.w_lat_long});
        column_config.push({ width: Math.floor(referencia_cell_width / 1.28)});

        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: column_config,
              title: "Resultado",//data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
           rows.splice(1, 1);
           allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


    };

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************
    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "ReportePosicion.xlsx"
      });

    } else {
      this.toastr.error("No se han encontrado datos para exportar");
    }
  }

  exportExcelFrenadaAceleracionBrusca(vrs: number) {
    var exportFileEx = [];
    var bol_datos_ex = false;
    var column_config:Columns[] = [];

    var p_cercano_max_width = 155;
    var tramo_max_width = 165;

    var nom_inf = "REPORTE DE FRENADA Y ACELERACIÓN BRUSCA";

    var allRows: AllRows[] = [
        {},
        {
          cells: [
            { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 3 }
          ],
          height: 30,
        }
    ];

    var cc = 0;

    var table_width;

    this.data.forEach((table_data: any) => {
      if(table_data[1].length > 0){
        column_config = [];

        var p_cercano_width = 155;
        var tramo_width = 165;

        bol_datos_ex = true;

        var nom_vehi = table_data[0][1];

        table_width = 1 + (this.chkDateHour? 2:1) + 9;
        var vehiculo_width = (this.chkDateHour? 5:4);


        /* Table Header */

        var rows: AllRows[] = [
          {},
          {
            cells: [
              { value: nom_inf, bold: true, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: table_width }
            ],
            height: 36,
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + table_data[0][1], bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: vehiculo_width },
              { value: "PERIODO : " + this.period,  bold: false, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: table_width - vehiculo_width },
            ]
          },
          {}
        ];

        /* Table Body */

        var cellsCampos = [];

        //----------- CABECERA ------------
        cellsCampos.push({ value: "Ítem", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });

        if (this.chkDateHour) {
          cellsCampos.push({ value: "Fecha", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
          cellsCampos.push({ value: "Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        } else {
          cellsCampos.push({ value: "Fecha / Hora", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 });
        }

        cellsCampos.push({ value: "Tipo Unidad", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "ID Conductor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Conductor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Vel. GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Vel. CAN", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Descripción", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Tramo", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });
        cellsCampos.push({ value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3, wrap: true });

        rows.push({
          cells: cellsCampos,
        });

        //----------- CONTENIDO / FILAS ------------
        table_data[1].forEach((item: { latitud: number; longitud: number; tipo_unidad: any; id_conductor: any; nombre_conductor: any; tipo_frenada: any; tramo: any; vel_final: any; vel_can: any; PC: any; fecha_final: any; }, index: number) => {

          p_cercano_width = Math.max(p_cercano_width, item.PC.length * this.char_to_px);
          tramo_width = Math.max(tramo_width, item.tramo.length * this.char_to_px);

          var ubicacion = item.latitud.toFixed(6) + "," + item.longitud.toFixed(6) + "";
          var cellsCuerpo = [];

          cellsCuerpo.push({ value: index + 1, vAlign: "center", hAlign: "center", fontSize: this.c1 });

          if (this.chkDateHour) {
            cellsCuerpo.push({ value: this.isChe(item.fecha_final), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 });
            cellsCuerpo.push({ value: this.isChs(item.fecha_final), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
          } else {
            cellsCuerpo.push({ value: this.isChe(item.fecha_final), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 });
          }
          cellsCuerpo.push({ value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.id_conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.nombre_conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.vel_final, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.vel_can, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.tipo_frenada, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 });
          cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 });

          rows.push({
            cells:cellsCuerpo
          });
        });

        // //********************************************* excel version 2 *********************************
        if ( vrs == 2 ) {
          p_cercano_max_width = Math.max(p_cercano_max_width, p_cercano_width);
          tramo_max_width = Math.max(tramo_max_width, tramo_width);
          rows.splice(1, 1);
          allRows = allRows.concat(rows);
        }

        // //********************************************* excel version 1 *********************************

        /* Ancho de Columnas */

        if( vrs == 1 ){
          column_config = [
            { width: this.w_item },
          ];
          if(this.chkDateHour){
            column_config.push(
              { width: this.w_date_hour },
              { width: this.w_date_hour },
            )
          } else {
            column_config.push(
              { width: this.w_date_and_hour },
            )
          }
          column_config.push(
            { width: 100 },
            { width: 116 },
            { width: 100 },
            { width: this.w_velocidad_gps_can_short },
            { width: this.w_velocidad_gps_can_short },
            { width: 116 },
            { width: Math.floor(tramo_width / 1.28) },
            { width: Math.floor(p_cercano_width / 1.28) },
            { width: this.w_lat_long },
          );

          /* Fin Ancho de Columnas */

          exportFileEx.push({
            freezePane: {
                rowSplit: 6
              },
            columns: column_config,
            title: nom_vehi,
            rows: rows
          });
        }

      } // if si hay datos del vehiculo
    });

    //NOTA: width * 1.28 (aprox) = Ancho de columna en excel

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      allRows[1].cells![0].colSpan = table_width;

      column_config = [
        { width: this.w_item },
      ];
      if(this.chkDateHour){
        column_config.push(
          { width: this.w_date_hour },
          { width: this.w_date_hour },
        )
      } else {
        column_config.push(
          { width: this.w_date_and_hour },
        )
      }
      column_config.push(
        { width: 100 },
        { width: 116 },
        { width: 100 },
        { width: this.w_velocidad_gps_can_short },
        { width: this.w_velocidad_gps_can_short },
        { width: 116 },
        { width: Math.floor(tramo_max_width / 1.28) },
        { width: Math.floor(p_cercano_max_width / 1.28) },
        { width: this.w_lat_long },
      );

      exportFileEx.push({
        freezePane: {
            rowSplit: 2
          },
        columns: column_config,
        title: "Resultado",//data[0][1],
        rows: allRows
      });

    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    var nom_inf_xls = "ReporteFrenadaAceleracionBrusca.xlsx";
    /* if (vm.optionUser() == 445 ) {
      var nom_inf_xls = "ReporteLuminarias.xlsx";
    } */

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: nom_inf_xls
      });

    } else {
      this.toastr.error("No se han encontrado datos para exportar");
      /* alert('No se han encontrado datos para exportar'); */
    }
  }

  exportExcelDistraccionPosibleFatiga(vrs: number) {
    // dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    // var allRows = [
    var allRows: AllRows[] = [

        {}, {
          cells: [
            { value: "REPORTE DE DISTRACCIÓN Y POSIBLE FATIGA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];


    //this.data.forEach((table_data: any) => {

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        // var rows = [
        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE DISTRACCIÓN Y POSIBLE FATIGA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        if(this.chkDateHour) {


          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Descripción", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Reconocimiento Facial (ai1x)", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          // data[1].forEach(function(item:any, index:any){


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; velGPS: any; vel_can: any; descripcion: string; ai1x: number; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            if (item.ai1x > 1000) {
                var rec_facial = "Rostro detectado (" + item.ai1x + ")";
            } else {
                var rec_facial = "Rostro ausente (" + item.ai1x + ")";
            }

            rows.push({
              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velGPS+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.descripcion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: rec_facial, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });


        } else {

          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Descripción", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Reconocimiento Facial (ai1x)", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });



          // data[1].forEach(function(item:any, index:any){
            data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; velGPS: any; vel_can: any; descripcion: string; ai1x: number; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;
            if (item.ai1x > 1000) {
                var rec_facial = "Rostro detectado (" + item.ai1x + ")";
            } else {
                var rec_facial = "Rostro ausente (" + item.ai1x + ")";
            }

            rows.push({

              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velGPS+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.descripcion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: rec_facial, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]

            });
          });

        }


        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: [
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
              ],
              title: data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
           rows.splice(1, 1);
           allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "ReporteDistraccionPosibleFatiga.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }

  exportExcelCalificacionManejo(vrs: number) {
    // dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    // var allRows = [
    var allRows: AllRows[] = [

        {}, {
          cells: [
            { value: "REPORTE DE CALIFICACION DE MANEJO", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];


    //this.data.forEach((table_data: any) => {

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        // var rows = [
        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE CALIFICACION DE MANEJO", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        if(this.chkDateHour) {


          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha Fin", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora Fin", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "C01", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C02", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C03", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C04", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C05", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C06", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C07", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C08", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C09", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C10", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C11", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Calificación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });

          // data[1].forEach(function(item:any, index:any){

          data[1].forEach((item: { fecha: number;  fecha_fin: number; codigo: any; placa: any; tipo_unidad: any; C01: any; C02: any; C03: any; C04: any; C05: any; C06: any; C07: any; C08: any;C09: any; C10: any; C11: any; puntuacion: any;}, index: number) => {

            rows.push({
              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha_fin), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha_fin), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.C01, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C02, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C03, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C04, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C05, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.C06, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C07, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C08, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C09, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C10, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C11, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.puntuacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });



        } else {

          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha Fin", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "C01", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C02", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C03", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C04", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C05", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C06", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C07", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C08", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C09", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C10", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "C11", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Calificación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });

          // data[1].forEach(function(item:any, index:any){
          data[1].forEach((item: { fecha: number;  fecha_fin: number; codigo: any; placa: any; tipo_unidad: any; C01: any; C02: any; C03: any; C04: any; C05: any; C06: any; C07: any; C08: any;C09: any; C10: any; C11: any; puntuacion: any;}, index: number) => {

            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha_fin), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.C01, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C02, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C03, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C04, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C05, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.C06, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C07, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C08, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C09, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C10, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.C11, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.puntuacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]

            });
          });

        }


        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: [
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
              ],
              title: data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
           rows.splice(1, 1);
           allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelCalificacionManejo.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }


  exportExcelFatigaExtrema(vrs: number) {
    // dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    // var allRows = [
    var allRows: AllRows[] = [

        {}, {
          cells: [
            { value: "REPORTE DE FATIGA EXTREMA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];


    //this.data.forEach((table_data: any) => {

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        // var rows = [
        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE FATIGA EXTREMA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        if(this.chkDateHour) {


          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Reconocimiento Facial (ai1x)", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          // data[1].forEach(function(item:any, index:any){


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; velGPS: any; vel_can: any; descripcion: string; ai1x: number; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            if (item.ai1x > 1000) {
                var rec_facial = "Rostro detectado (" + item.ai1x + ")";
            } else {
                var rec_facial = "Rostro ausente (" + item.ai1x + ")";
            }

            rows.push({
              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velGPS+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: rec_facial, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });


        } else {

          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Reconocimiento Facial (ai1x)", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });



          // data[1].forEach(function(item:any, index:any){
            data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; velGPS: any; vel_can: any; descripcion: string; ai1x: number; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;
            if (item.ai1x > 1000) {
                var rec_facial = "Rostro detectado (" + item.ai1x + ")";
            } else {
                var rec_facial = "Rostro ausente (" + item.ai1x + ")";
            }

            rows.push({

              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velGPS+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: rec_facial, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]

            });
          });

        }


        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: [
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
              ],
              title: data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
           rows.splice(1, 1);
           allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelFatigaExtrema.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }

  exportExcelAnticolisionFrontal(vrs: number) {
    // dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    // var allRows = [
    var allRows: AllRows[] = [

        {}, {
          cells: [
            { value: "REPORTE ANTICOLISION FRONTAL", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];


    //this.data.forEach((table_data: any) => {

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        // var rows = [
        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE ANTICOLISION FRONTAL", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];


        if(this.chkDateHour) {


          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          // data[1].forEach(function(item:any, index:any){


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({
              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });



        } else {

          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });

          // data[1].forEach(function(item:any, index:any){
            data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({

              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]

            });
          });

        }

        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: [
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
              ],
              title: data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
           rows.splice(1, 1);
           allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelAnticolisionFrontal.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }

  exportExcelColisionConPeatones(vrs: number) {
    // this.dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    var allRows: AllRows[] = [
        {}, {
          cells: [
            { value: "REPORTE DE COLISION CON PEATONES", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];

    this.data.forEach((data: any,idx:any) => {
      if(data[1].length > 0){
        bol_datos_ex = true;

        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE COLISION CON PEATONES", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];

        if(this.chkDateHour) {
          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          //data[1].forEach(function(item, index){
          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;


            rows.push({
              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },


                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });



        } else {

          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });

          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;
            // if (item.di4x > 0) {
            // 	var acc = "Activado (" + item.di4x + ")";
            // } else {
            // 	var acc = "Desactivado (" + item.di4x + ")";
            // }
            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]

            });
          });

        }

        // //********************************************* excel version 1 *********************************
        if (vrs == 1) {
            exportFileEx.push({
              freezePane: {
                  rowSplit: 6
                },
              columns: [
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
                { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
              ],
              title: data[0][1],
              rows: rows
            });
        }
        // //********************************************* excel version 1 *********************************

        // //********************************************* excel version 2 *********************************
        if (vrs == 2) {
            rows.splice(1, 1);
            allRows = allRows.concat(rows);
        }
        // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
        exportFileEx.push({
          freezePane: {
              rowSplit: 2
            },
          columns: [
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
            { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
          ],
          title: "Resultado",//data[0][1],
          rows: allRows
        });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelColisionConPeatones.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }


  exportExcelDesvioCarrilIzquierda(vrs: number) {
    //vm.dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    // var allRows = [
    var allRows: AllRows[] = [
        {}, {
          cells: [
            { value: "REPORTE DE DESVIO DE CARRIL HACIA LA IZQUIERDA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE DESVIO DE CARRIL HACIA LA IZQUIERDA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];

        if(this.chkDateHour) {
          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },


            ]
          });

          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            //var fh = item.fecha.split(" ");
            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({
              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        } else {

          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;
            // if (item.di4x > 0) {
            // 	var acc = "Activado (" + item.di4x + ")";
            // } else {
            // 	var acc = "Desactivado (" + item.di4x + ")";
            // }
            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        }

        // //********************************************* excel version 1 *********************************
    if (vrs == 1) {
      exportFileEx.push({
      freezePane: {
        rowSplit: 6
        },
      columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
      ],
      title: data[0][1],
      rows: rows
      });
    }
    // //********************************************* excel version 1 *********************************

    // //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      rows.splice(1, 1);
      allRows = allRows.concat(rows);
    }
    // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      exportFileEx.push({
        freezePane: {
          rowSplit: 2
        },
        columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
        ],
        title: "Resultado",//data[0][1],
        rows: allRows
      });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelDesvioCarrilIzquierda.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }




  exportExcelDesvioCarrilDerecha(vrs: number) {
    //vm.dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    var allRows: AllRows[] = [
        {}, {
          cells: [
            { value: "REPORTE DE DESVIO DE CARRIL HACIA LA DERECHA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];

    this.data.forEach((data: any,idx:any) => {
      if(data[1].length > 0){
        bol_datos_ex = true;

        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE DESVIO DE CARRIL HACIA LA DERECHA", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];

        if(this.chkDateHour) {
          rows.push({
            cells: [


              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            //var fh = item.fecha.split(" ");
            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({
              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        } else {

          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
            ]
          });

          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        }

        // //********************************************* excel version 1 *********************************
    if (vrs == 1) {
      exportFileEx.push({
      freezePane: {
        rowSplit: 6
        },
      columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
      ],
      title: data[0][1],
      rows: rows
      });
    }
    // //********************************************* excel version 1 *********************************

    // //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      rows.splice(1, 1);
      allRows = allRows.concat(rows);
    }
    // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      exportFileEx.push({
        freezePane: {
          rowSplit: 2
        },
        columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
        ],
        title: "Resultado",//data[0][1],
        rows: allRows
      });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelDesvioCarrilDerecha.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }



  exportExcelBloqueoVisionMobileye(vrs: number) {
    //vm.dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    var allRows: AllRows[] = [
        {}, {
          cells: [
            { value: "REPORTE DE BLOQUEO DE VISION DEL MOBILEYE", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE DE BLOQUEO DE VISION DEL MOBILEYE", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
            ]
          },
          {}
        ];

        if(this.chkDateHour) {
          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            //var fh = item.fecha.split(" ");
            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({
              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        } else {

          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.GPS", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Vel.CAN", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Punto Cercano", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          data[1].forEach((item: { fecha: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; vel_gps_speed: any; vel_can: any; tramo: string; PC: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_gps_speed+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.vel_can+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.tramo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.PC, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        }

        // //********************************************* excel version 1 *********************************
    if (vrs == 1) {
      exportFileEx.push({
      freezePane: {
        rowSplit: 6
        },
      columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
      ],
      title: data[0][1],
      rows: rows
      });
    }
    // //********************************************* excel version 1 *********************************

    // //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      rows.splice(1, 1);
      allRows = allRows.concat(rows);
    }
    // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      exportFileEx.push({
        freezePane: {
          rowSplit: 2
        },
        columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
        ],
        title: "Resultado",//data[0][1],
        rows: allRows
      });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelBloqueoVisionMobileye.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }





  // EXPORTACION DE PDF

  logo_cruzdelsur ='data:image/png;base64,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';
  logo_gltracker  = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAwICAgICAwICAgMDAwMEBgQEBAQECAYGBQYJCAoKCQgJCQoMDwwKCw4LCQkNEQ0ODxAQERAKDBITEhATDxAQEP/bAEMBAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIAU4FAAMBIgACEQEDEQH/xAAeAAEAAgMAAwEBAAAAAAAAAAAABwgFBgkCAwQBCv/EAGoQAAEDAwIDAwUHCg8LCwMBCQEAAgMEBQYHEQgSIRMxQQkiUWFxFBgyV4GRlRUjN0JSkqGz0tMWFxkzVmJyc3WCk6KxtNEkNENUY4SWo7LBwzU2OFNVdIOGlKTCRGTEJUZnpdTh4uPk8P/EABwBAQACAgMBAAAAAAAAAAAAAAAGBwQFAQMIAv/EAEkRAAIBAgIECgcGBQMDAgcAAAABAgMEBREGITGREhNBUWFxobHB0QcUFiJSU4EyQlRikuEVFyNy8KLC8TOCsjXSCCQ0NkPD4v/aAAwDAQACEQMRAD8A6eoiIAiIgCIiAIiIAi0/PtW8B01pzJlV+hhqC3mjoovrlTIPDaMdQPWdh61WnPuM7Kbo6WiwC0Q2amPM1tXVAT1Lhv0cG/rbDt3gh/tW9wvRvEcXylQp5R+J6l+/0TItjmmWD6P5xuquc/gj70t2xf8Ac0W9uNzt1no5bjdrhTUVJCN5J6iVscbB6S5xACivKuKjR7GXSwQXua9VEXQx2yEyNJ9UjuWMj1hxVHciy3J8urDX5Pfq65z+Dqmdz+UehoPRo9Q2CxKn1h6OreCUr2q5PmjqW95t9hVOKemC7qtxw2goLnl7z3LJL/UWiyHjguLyY8UwWmh2PSW4VLpOYfuIw3b74qPr1xYa1XWoMtLf6S1Rn/A0VDFyj5ZQ9385Q8ilNtovg9r9ihF/3e9/5ZkGvdONIb5/1LqS/tfA/wDHI3C56xaq3eQyV2od/O/e2KvkiZ96whv4FhanLcqrN/deTXaffv7Stkd/SViUW2p2dvSWVOnFdSSNBVxC7rvOrVlJ9Mm+9n0uulzf1fcap3tmcf8AevA1tY7vq5jv6ZCvSi7+BFchjOpN7Wz2Gond3zyH2uK8TLK7vkcfaV4ouckfPCZ+87/uj86/CSTuTuiIMwiIuTgIiIAiIgCIiAIiICZ+EaofBrRRRNJ2qKGqjd7Azm/paFe5UW4QaN9TrJTzNG4pLdVTO9QIDP6XhXpVKekBr+LLL4F3s9K+iVSWAyz+ZLLdHxPGYbwvB8Wn+hV3Vh6h3LBI70MJ/Aq8Lxj/APEI1w8PXRV//WeidC9lb/t/3BERecCcBERAbjpW7bJJR6aR4/nMUsqJtK275JKfRSPP85illex/Qjn7Kxz+ZPwKx0r/APUX/ajH5DE2ewXOFw3ElHM0j0gsIXLpdQsombTYzd6hx2EVDUPJ9QjcVy9XrP0bZ8Xcdcf9x5j9MrXHWa5cp98QiIrOKTCu7wYvLtJaofc3qoH+qhP+9UiV3uDOMs0kqXH7e81Dh/JxD/coVp9/6Q/7o+JZXop/+4F/ZLwJ3REVInpkIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIijfWLXPFtI7f2dW4V97qIy6ktsT9nEdwfIftGb+J6nY7A7HbJtLSvfVlQt4uUnsS/ztMO/xC2wu3ldXk1CEdrf+a2+RLW+Q3TJMox7D7TLfMmu1PbqGH4Uszttz9y0d7nHwaASfAKpmq3F/fr6Z7NptDJZ6A7sdcJQPdco7t2DqIh39eru47tPRQ1qDqVl2pl5deMqubpiC73PTM82CmaT8GNnh4Dc7uOw3JWrK3sB0HtrBKtfZVKnN91fTl+uro5Tz5pT6Tr3FHK2wvOlS5/vy+v3V0LXzvkPdWVlXcKqWur6qapqah5klmmeXvkeTuXOcepJPiV6URTtJJZIqxtyeb2hERcnAREQBERAEREAREQBERAEREAREQBERAEREAREQFj+CO3SS5vkF2DPMprU2mc70GSZrgP9UfmVxlXfgqx6SgwO75FNEWG7XARxuP28ULNgfZzvkHyFWIVCaZXCuMZrOOyOUdyWfbmeq/R1Zuz0ct1LbLOW+Ty7Mj4b9Ue5bHcKjfYx00rh7eU7fhUBqZ9QqwUmK1Y386cshb8rgT+AFQwvFPp8vVVxm2tE/sU8/rKT8IovzQ6lwbWpU55Zbl+4REVEEvCIiA3zSSDmuNfVf9XC2P752/8A8VJy0TSaj7O2VteT1nmbFt6mN3/+f4Fva9ueiOzdnohaqSycuHLfOWX+nIqjSSqquJVMuTJbkvE1rU2b3PptldRvt2dkrn7+yB65nroPxL3Wa0aJ5LNTuDZJ4oaUetsszGPH3rnLnwvVHo5pONlWq88styXmeX/TDcKWJW9BbYwz/VJr/aERFYhUAV9OE23mh0Utc7m7Guqauo/1rmf8NULXSLRi0OselGKW6SMxyNtcEsjCNi18je0cD693FV/6RK3Aw6nS5ZT7En5otn0QWzqYvWr8kabX1co+CZuaIipw9FBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARFGGvGs9BpHjXNTdnU3+4hzLfSuPRvpmePuG+j7Y7D0kZNnZ1r+vG2t1nKTyX+cy5TCxHELfCrWd5dy4MILNvwXO3sS5WY3XzX+3aVUBs1m7Ksyarj3ihJ3ZSMPdLL/8W+Pedh30XvF5uuQXOpvN7r5q2uq3mSaeV27nuP8A/wB3dwHcvy7Xa5X651N5vFbLV1tZIZZ5pXbue495K+RX1o/o/b4FQ4MNdR/alz9C5l/yzytpZpbd6U3XDqe7Sj9iHIul88nyv6LUERFICJBERAEREAREQBFlbPimUZCdrBjd0uW52/uSjkm/2QVu1Dw263XGNssGBVTGv6jt6iCEj2h7wR8yw6+IWlq8q9WMeuSXezYWuE4hfLO1oTn/AGxk+5EaIp0t/Bvq7Wx89TPYaA/cVFa9zv8AVscPwr7xwUaneORYwP8AOKj8ytbLSfB4vJ3Ed+fcbmGhOkM1mrSf1WXeV8RWEHBPqX45JjP8vUfml++8n1J/ZLjX8tP+aXz7U4N+Ij2+R9+wukX4SXZ5lekVhfeT6k/slxr+Vn/NL9HBNqR45Njf8rP+aT2qwb8RHt8jn2F0i/CS7PMryisN7ybUf9k+N/ys/wCaT3k2o/7J8b/lZ/zSe1WDfiI9vkPYXSL8JLs8yvKKw/vJtR/2T43/ACs/5pPeTaj/ALJ8b/lZ/wA0ntVg34iPb5D2E0i/CS7PMrwisP7ybUf9k+N/ys/5pPeTaj/snxv+Vn/NJ7VYN+Ij2+Q9hNIvwkuzzK8IrD+8m1H/AGT43/Kz/mk95NqP+yfG/wCVn/NJ7VYN+Ij2+Q9hNIvwkuzzK8L9a1z3BjGkucdgAOpKsN7ybUf9k+N/ys/5pZ/AeDvJ7FmdnveUXuyVdsoKptTPBTvlc+Tk85rdnRgEFwbvue7dddXS3CKdOU41k2k3ks9fRs5Ttt9ANIa1WNOVtKKbSbeWSze169iLB6UYi3BdOrBi/YmOako2OqWl3NtUP8+br6O0c7b1bLbERULXrTuasq1T7Um2+tvM9VWttTs6ELeksowSiupLJEeatXHaOhtTHjzi6okb49PNafwu+ZRwpOyvBL3kV5luLK2jZEWtZE1xdu1oHjs307n5ViP0p75/2hQ/fP8AyV5B9IGiOlOkekVzfUbObpt8GD1fZilFNa9jy4X1LPwbEsPsbKnRlVSllm+t6+zYaQi3f9Ke+f8AaFD98/8AJT9Ke+f9oUP3z/yVDP5Z6W/gZ9nmbT+PYd81dppCLd/0p75/2hQ/fP8AyV5R6TXjtG9rcaMM3HMWl5O3jt5veuV6MtLZPL1Gf+nzDx7Dl/8AlXabngtD7gxehYW8r5WGd3r5juPwbLPLxjjZFG2KNuzWANaPQAvJe2sHw+GE4fQsKeylCMf0pLP65ZlVXNZ3NadZ/ebe9ldeNe++48EsuPslLX3K5GZzR9vHDGdx7OaSM/IFTRXc4hdB811fyK2V9lvVppKC3UZhbFVySh5lc8l7gGscNiBGO/fzVFXvJtR/2T43/Kz/AJpXjorjWFYZhdOjWrJTeba17W+rmyPOWnejmO41jlW5t7aUqa4MYvVrSSz5efMrwisP7ybUf9k+N/ys/wCaT3k2o/7J8b/lZ/zSkftVg34iPb5EP9hNIvwkuzzINxSwT5Vk9pxmnkEcl1rYaNryNwztHhvMfUN9/kXT6KJkETIYm7MjaGtHoAGwVa9GOFjJNP8AUChy/JrxZ6ynt7JXRRUrpHOMzmFrSQ9jRsA4nfffcBWWVaacYzb4pcUoWs+FCCetc7evsSLn9GOjl1gdnXq31NwqVJJZPbwYrU/q5PcERFByzwiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCL4b3fbJjNqqL7kl5obVbaRodUVldUMgghBIAL5HkNaNyB1PeQtN98NoD8eWn/wDpNRfnF2QpVKizjFv6HxKrCDyk0iQEUf8AvhtAfjy0/wD9JqL84nvhtAfjy0//ANJqL84vr1et8D3M+PWKXxLeiQEUf++G0B+PLT//AEmovziyuN6t6U5lcxZcP1NxO+3AsdKKS23qmqpixvwnckby7Ybjc7Lh0KsVm4vczlVqUnkpLebWiIuo7QiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIDCZpl9nwPGLhld9lLKSgi53AfCkcTs1jf2znEAe3r0XOfP85veouVVuVX6Yunqn7RxA7sp4h8CJnoa0fOdyepJUt8Wuqr8sy39AtpqCbVj0pbPynpNW9Q8n1M3LB6+fv3CgJXVoTgKw619crL+pUW6PIut7X9FyHmv0l6VSxi+eHW0v6NJ5P8ANPY31LYvq+UIiKclYBERAETvXvoqGruNXDQUNLNU1NQ8RxQQsL3yPJ2DQB1JK4bUVmz6jFyeUdp6Fn8QwLLs8uH1NxSw1VxmBAkMTPMi332Mjzs1g6Hq4jfZWK0j4P3SMhvuqsrmNcA9lnppNiR0P1+Qd3juxh9HnDqFZ6y2OzY5borTYbXTW+jgG0cFPGGMHr2Hj6T3lQHGtPLazbo2K4yfP91ef0yXSWto36LL3EVG4xSTowf3fvvwj9c3zxKu4RwU1ErI6vUHJRBzN3dR20BzwT4GVw2BHoDXD1qcsW0H0mxBrTa8LoJpmgAz1rPdUhI+2Bk3DT+5AW/Iq3v9JMTxJvjqrS5lqW5bfrmXHhWhuCYMl6vbxcl96XvS3vZ9MjxjijhjbFDG2NjBs1rRsAPQAvJEWjJQllqQREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARFWnygOquW6S6H0l5wfIaizXi4X6loY6mnIEgjMU0jwNweh7IA+1d9tbyuq0aMNsnkdFzXjbUpVpbEsyyyLij78fie+OfIPv2fkp78fie+OfIPv2fkqReylz8ce3yND7T2/wAEuzzO1yLij78fie+OfIPv2fkp78fie+OfIPv2fkp7KXPxx7fIe09v8EuzzO1yKivk49WNZNXMmzSu1Dz26X222ahpIYoapzSxk88jyHDYDrywOHyq9S0N9Zysa7oTabWWzpWZu7O6je0VWimk+cIiLEMoIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiICsHlHshfZeF+60DHbfV26UFvPXwEvbn+rrkYulHlW8lmpcDwTEGfrVzu1VcX+2mhbG3+tO+Zc11YujNPgWCl8Tb8PAgOkVTh3rjzJLx8QiIpAaIK6/krLH7q1fyzIXQhzbfjvuUOI+A+apiI9hIhd8m6pQukXkosfbBh2f5SWedXXOjt4dt4QRPeR/wC4H4Fp8fqcXh9TpyW9o22CU+MvodGb3Jl8ERFWRYoREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAFoGueog0z05uN+p5A24zj3Hbhtv/AHQ8HZ237UBz/wCLt4rf1SXjBzw5FqBDiVJMHUWOQ8jwB31UgDpOvjs0Rt9RDlItF8K/i+JQpTXuR96XUuT6vJfUiGnGOvAMGqV6byqS9yH9z5fos31ogVznPcXvcXOcdySdyT6V+Ii9AnkwIiIcBfoG/XuCDbvK91FRVl0rYLfb6WWpqqmRsMMMTC58j3HZrWgdSSSvltJZvYfUYuTSWtsyGL4xfczvlLjmNW99XXVbuVjG+A8XOPc1oHUk9NlevRXQTHNJqBlZK2K45FMzapuDmdI9x1jh36tb4E97vHYbNHloNorbtJcca+riinyK4Ma64VQ68niIYz4Mb4n7Y9T3NAlFUvpXpXPE5ytLR5UVtfx//wA8y5dr6PSOgegdLBaccQxCOdw9aT2Q6vzc75Ni5WyIigxaAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAFQPysV3fHZtN7CyfzKiqudZJED4xsp2McR/wCK8D5VfxctfKk3mas14sVm90c1PbsYgcI9+jJZKmoLj7S1sfzBbzR2nxmIQfNm+zLxNNj9TgWMlz5Ltz8Cm6Iiskr0IiIDpp5Kmx+5tK8yyMx7Gvv7KMO2+EIKdjv6agq7yrV5O2zx2vhWxurbDyPutZcayQ7bFxFVJED97E35lZVVZjFTjb6rLpa3avAsvCocXZUl0Z79fiERFrTYBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAcyPKqZRPW6r4hh2+9PaLC6vH75UzvY4fe00fzqkish5QrJH5BxTZLTc3NFZaahtsR9Qp2SOHySSvCrerUwinxVjSj0J79fiVpitTjb2pLpy3avAIiLYmvC62+TaxyGycMVBdIx5+QXevuEntbIKYfgpwuSS7d8KGLU+HcN+ndmpu59hprg/1S1Q90yD7+ZyjOlVTg2kYc8u5P9iR6NU+FdSnzR72v3JX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';


  // arrDataGrafico  = [false,false,false,false,false,false,false,false,false,false,false,false];
  arrDataGrafico  = [true,true,true,true,true,true,true,true,true,true,true,true];

  arrDataPlot  = ['','','','','','','','','','','',''];

  arrDataTabla  = {
        distraccion:0,
        posible_fatiga:0,
        fatiga_extrema:0
      };

  contador = 1;//reportServices.getNroGenReport();



      runReportGerencial(contador:any) {
        console.log("a-- " + this.contador + "-- ");
        // vm.contador

        // reportServices.getNroGenReport();
        // this.setNroGenReport =

        // reportServices.getPeriodo();

        // if (this.contador == reportServices.getNroGenReport()) {
        if (true) {

          console.log("b--" + this.contador);
          this.contador = this.contador +1;
          console.log("c--" + this.contador);

          // console.log("----- GAAA -----");
          // console.log(vm.datos);
          // console.log(vm.periodo());
          this.arrDataTabla.distraccion = 0;
          this.arrDataTabla.posible_fatiga = 0;
          this.arrDataTabla.fatiga_extrema = 0;

          this.arrDataGrafico  = [true,true,true,true,true,true,true,true,true,true,true,true];


          for (let i = 0; i < this.data.length; i++) {
            const placa_unidad = this.data[i][0][1];
            for (let j = 0; j < this.data[i][1].length; j++) {
                const descripcion = this.data[i][1][j].descripcion_evento;
                // console.log(placa_unidad+" - "+descripcion+" - "+vm.datos[i][1][j].fecha_tracker+" - "+vm.datos[i][1][j].nombre_zona+" - "+vm.datos[i][1][j].conductor);
                // console.log(vm.datos[i][1][j].velocidad_limite);

                if (descripcion == "Distraccion") {
                  this.arrDataTabla.distraccion = this.arrDataTabla.distraccion + 1;
                } else if (descripcion == "Somnolencia") { //posible_fatiga
                  this.arrDataTabla.posible_fatiga = this.arrDataTabla.posible_fatiga+1;
                } else if (descripcion == "Fatiga Extrema") {
                  this.arrDataTabla.fatiga_extrema = this.arrDataTabla.fatiga_extrema+1;
                }


            }
          }



          var colorArray = [
          '#3A6598',
          '#EFA252',
          '#029471',
          '#DD581E',
          '#A22D62',
          '#FECE5F',
          '#27758B',
          '#D8695B',
          '#447711',
          '#C82859',
          '#5D069C',
          '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
          '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
          '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
          '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
          '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
          '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
          '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
          '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
          '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
          '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];



          var arrData : any[] = [[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]]; // distraccion:[],posible_fatiga:[],fatiga_extrema
          var arrtick : any[] = []; // labels del eje Y
          // var id1 = -1; //indice del array 'arrtick'




          // vm.arrData  = [true,true,true,true,true,true,true,true,true,];

          for (let h = 0; h < arrData.length; h++) {
            // arrData[h] = [];

            var select_evento = "";
            switch (h) {
              case 0:
                select_evento = "Distraccion";
                break;
              case 1:
                select_evento = "Somnolencia"; //posible_fatiga
                break;
              case 2:
                select_evento = "Fatiga Extrema";
                break;
              default:
                break;
            }

            //=========================== EVENTOS POR UNIDAD =======================
            // arrData[h].push([]); //[0] = [];
            // // console.log(h);
            // // console.log(arrData);
            // //arrData[h][0] = [];

            // 	for (let i = 0; i < vm.datos.length; i++) {
            // 		const placa_unidad = vm.datos[i][0][1];
            // 		// console.log(placa_unidad);
            // 		var num_eventos = 0;
            // 		for (let j = 0; j < vm.datos[i][1].length; j++) {
            // 			if (vm.datos[i][1][j].descripcion_evento == select_evento) {

            // 				const element1 = vm.datos[i][1][j].descripcion_evento;
            // 				// console.log(element1);
            // 				num_eventos++;
            // 			}
            // 		}
            // 		// console.log(h);

            // 		if ( 0 < num_eventos ) {
            // 			// console.log(arrData);
            // 			arrData[h][0].push({color: colorArray[i], data: [[placa_unidad, num_eventos]]});
            // 		}
            // 	}


            //=========================== EVENTOS POR CODIGOS =======================

              var array_codigos = [];

              // arrData[h].push([]);//[i][3] = [];
              for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i][1].length; j++) {
                  if (this.data[i][1][j].descripcion_evento == select_evento) {

                    const nom_codigo = this.data[i][1][j].codigo;
                    var coinciden = false;
                    for (let k = 0; k < array_codigos.length; k++) {

                      if (this.data[i][1][j].codigo == array_codigos[k][0]) {
                        coinciden = true;
                        array_codigos[k][1] = array_codigos[k][1] + 1;
                      }
                      // const element = array[k];
                    }
                    if (coinciden == false) {
                      array_codigos.push([nom_codigo,1]);
                    }
                  }
                }
              }

              // console.log(array_codigos);
              arrtick.push([]);
              // id1 = id1 + 1;
              var n = arrtick.length - 1;
              var contador1 = 0;
              for (let i = 0; i < array_codigos.length; i++) {
                if (0 < array_codigos[i][1]) {
                  contador1++;
                  arrtick[n].push([ contador1, array_codigos[i][0]]);
                  // arrData[h][0].push({color: colorArray[i], data: [[array_codigos[i][0], array_codigos[i][1]]]});
                  arrData[h][0].push({color: colorArray[i], data: [[array_codigos[i][1], contador1] ]});

                  // [
                  //     [1, 'One'],
                  //     [2, 'Two'],
                  //     [3, 'Three la ultima vezs aggagagaaga '],
                  // ]
                  // {color: '#000', data : [[50, 3]] },

                }
              }

            //=========================== FIN EVENTOS POR CODIGOS =======================


            //=========================== FIN EVENTOS POR UNIDAD =======================

            //=========================== EVENTOS POR FECHA =======================
              var periodo = this.period;// vm.period();

              var ini_fin = periodo.split(" - ")
              var primer_dia = moment(ini_fin[0]).startOf('day').format("YYYY-MM-DD");
              var ultimo_dia = moment(ini_fin[1]).startOf('day').format("YYYY-MM-DD");

              var array_dias : any[] = [];

              if (primer_dia === ultimo_dia) {
                // console.log("son iguales");
                array_dias.push([primer_dia,0]);
              } else {
                var dia_temp = moment(ini_fin[0]);
                var add_day = dia_temp.startOf('day').format("YYYY-MM-DD");
                while (add_day != ultimo_dia) {
                  //console.log(add_day);
                  array_dias.push([add_day,0]);
                  dia_temp = dia_temp.add(1, 'days');
                  add_day = dia_temp.startOf('day').format("YYYY-MM-DD");
                }
                array_dias.push([ultimo_dia,0]);
              }
              // console.log(array_dias);
              // arrData[h].push([]);//[i][1] = [];
              for (let i = 0; i < this.data.length; i++) {
                // const placa_unidad = vm.datos[i][0][1];
                // console.log(placa_unidad);
                // var num_eventos = 0;
                for (let j = 0; j < this.data[i][1].length; j++) {
                  if (this.data[i][1][j].descripcion_evento == select_evento) {

                    var evento_dia = moment(this.data[i][1][j].fecha_tracker).startOf('day').format("YYYY-MM-DD");
                    for (let k = 0; k < array_dias.length; k++) {
                      if (  evento_dia ===  array_dias[k][0] ) {
                        array_dias[k][1] = array_dias[k][1]+1;
                      }
                    }
                  }
                }
              }

              // console.log(array_dias);
              arrtick.push([]);
              var n = arrtick.length - 1;
              var contador2 = 0;
              for (let i = 0; i < array_dias.length; i++) {
                if (0 < array_dias[i][1]) {
                  contador2++;
                  arrtick[n].push([contador2,array_dias[i][0]]);
                  arrData[h][1].push({color: colorArray[i], data: [[array_dias[i][1], contador2] ]});
                }
              }



            //=========================== FIN EVENTOS POR FECHA =======================
            //=========================== EVENTOS POR GEOCERCA =======================

              var array_geocercas = [];
              // arrData[h].push([]);//[i][2] = [];
              for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i][1].length; j++) {
                  if (this.data[i][1][j].descripcion_evento == select_evento) {

                    const nom_geocerca = this.data[i][1][j].nombre_zona;
                    var coinciden = false;
                    for (let k = 0; k < array_geocercas.length; k++) {

                      if (this.data[i][1][j].nombre_zona == array_geocercas[k][0]) {
                        coinciden = true;
                        array_geocercas[k][1] = array_geocercas[k][1] + 1;
                      }
                      // const element = array[k];
                    }
                    if (coinciden == false) {
                      array_geocercas.push([nom_geocerca,1]);
                    }
                  }
                }
              }

              // console.log(array_geocercas);
              arrtick.push([]);
              var n = arrtick.length - 1;
              var contador3 = 0;
              for (let i = 0; i < array_geocercas.length; i++) {
                if (0 < array_geocercas[i][1]) {
                  contador3++;
                  arrtick[n].push([contador3,array_geocercas[i][0]]);
                  arrData[h][2].push({color: colorArray[i], data: [[array_geocercas[i][1], contador3] ]});
                }
              }


            //=========================== FIN EVENTOS POR GEOCERCA =======================
            //=========================== EVENTOS POR CONDUCTOR =======================

              var array_conductores = [];

              // arrData[h].push([]);//[i][3] = [];
              for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i][1].length; j++) {
                  if (this.data[i][1][j].descripcion_evento == select_evento) {

                    const nom_conductor = this.data[i][1][j].conductor;
                    var coinciden = false;
                    for (let k = 0; k < array_conductores.length; k++) {

                      if (this.data[i][1][j].conductor == array_conductores[k][0]) {
                        coinciden = true;
                        array_conductores[k][1] = array_conductores[k][1] + 1;
                      }
                      // const element = array[k];
                    }
                    if (coinciden == false) {
                      array_conductores.push([nom_conductor,1]);
                    }
                  }
                }
              }

              // console.log(array_conductores);
              arrtick.push([]);
              var n = arrtick.length - 1;
              var contador4 = 0;
              for (let i = 0; i < array_conductores.length; i++) {
                if (0 < array_conductores[i][1]) {
                  contador4++;
                  arrtick[n].push([contador4,array_conductores[i][0]]);
                  arrData[h][3].push({color: colorArray[i], data: [[array_conductores[i][1], contador4] ]});
                }
              }
            //=========================== FIN EVENTOS POR GEOCERCA =======================
          }


            //Distracción, posible fatiga y fatiga extrema.
            var arrG = [
              {div:'#placeholder_x_unidad_distraccion',data:arrData[0][0],ph:null,orden:0},
              {div:'#placeholder_x_unidad_posible_fatiga',data:arrData[1][0],ph:null,orden:4},
              {div:'#placeholder_x_unidad_fatiga_extrema',data:arrData[2][0],ph:null,orden:8},

              {div:'#placeholder_x_fecha_distraccion',data:arrData[0][1],ph:null,orden:1},
              {div:'#placeholder_x_fecha_posible_fatiga',data:arrData[1][1],ph:null,orden:5},
              {div:'#placeholder_x_fecha_fatiga_extrema',data:arrData[2][1],ph:null,orden:9},

              {div:'#placeholder_x_geocerca_distraccion',data:arrData[0][2],ph:null,orden:2},
              {div:'#placeholder_x_geocerca_posible_fatiga',data:arrData[1][2],ph:null,orden:6},
              {div:'#placeholder_x_geocerca_fatiga_extrema',data:arrData[2][2],ph:null,orden:10},

              {div:'#placeholder_x_conductor_distraccion',data:arrData[0][3],ph:null,orden:3},
              {div:'#placeholder_x_conductor_posible_fatiga',data:arrData[1][3],ph:null,orden:7},
              {div:'#placeholder_x_conductor_fatiga_extrema',data:arrData[2][3],ph:null,orden:11}

            ];


            for (let j = 0; j < arrG.length; j++) {
                // const element = arrG[j];
                this.dibujar(arrG[j].div, arrG[j].data, arrG[j].orden, arrtick);

            }

          return '';

        }



      }



      dibujar(a:any,b:any,c:any,d:any) {
        console.log(a,b,c);
        if (b.length > 0 ) {

          // this.arrDataGrafico[c] = true;

          var options = {
            series: {
              stack: 1,
              bars: {
                order: 1,
                show: 1,
                barWidth: 0.6,
                fill: 0.9,
                align: 'center',
                horizontal: true
              },
            },
            grid: {
              hoverable: true,
              borderWidth: 0
            },
            tooltip: true,
            tooltipOpts: {
              cssClass: "flotTip",
              content: "%s: %y",
              defaultTheme: false
            },
            legend: {
              show: false
            },
            yaxis: {
              ticks: d[c]
            },
          };

          var somePlot = $j.plot(a,  b , options );

          this.arrDataPlot[c] = somePlot;

          var ctx = somePlot.getCanvas().getContext("2d"); // get the context
          var allSeries = somePlot.getData();  // get your series data
          var xaxis = somePlot.getXAxes()[0]; // xAxis
          var yaxis = somePlot.getYAxes()[0]; // yAxis
          var offset = somePlot.getPlotOffset(); // plots offset
          ctx.font = "12px 'Segoe UI'"; // set a pretty label font
          ctx.fillStyle = "black";
          for (var i = 0; i < allSeries.length; i++){
            var series = allSeries[i];
            var dataPoint = series.datapoints.points; // one point per series
            var x = dataPoint[0];
            var y = dataPoint[1];
            var text = x + '';
            var metrics = ctx.measureText(text);
            var xPos = (xaxis.p2c(x)/2) +offset.left - metrics.width; // place at end of bar
            var yPos = yaxis.p2c(y) + offset.top + 2;// - 2;
            ctx.fillText(text, xPos, yPos);
          }


          // var myCanvas = somePlot.getCanvas();
          // var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  /// here is the most important part because if you dont replace you will get a DOM 18 exception.
          // document.location.href=image;



        } else {
          this.arrDataGrafico[c] = false;
          this.arrDataPlot[c] = '';
        }

      }










      // exportPdfReporteGerencial() {

      //     console.log("===================================");
      //     console.log(this.arrDataGrafico);
      //     console.log(this.arrDataPlot);

      // }




  exportPdfReporteGerencial() {
    var exportFilePdf = [];
    var bol_datos_pdf = true;

    // console.log(vm.arrDataGrafico);
    // console.log(vm.arrDataPlot);


    var titulos = ['Eventos Por Unidad','Eventos Por Fecha','Eventos Por Geocerca','Eventos Por Conductor',
        'Eventos Por Unidad','Eventos Por Fecha','Eventos Por Geocerca','Eventos Por Conductor',
        'Eventos Por Unidad','Eventos Por Fecha','Eventos Por Geocerca','Eventos Por Conductor'];

    var titulosEvento = ['DISTRACCIÓN','','  ','',
        'POSIBLE FATIGA','','  ','',
        'FATIGA EXTREMA','','  ',''];
    // var myCanvas = somePlot.getCanvas();

    var tabla = [];

    tabla.push([
      { text: 'EVENTOS', bold: true, fontSize: 10, alignment: 'center' },
      { text: 'NRO DE EVENTOS', bold: true, fontSize: 10, alignment: 'center' },
    ]);

    tabla.push([
      { text: "DISTRACCIÓN", bold: true, fontSize: 6, alignment: 'center' },
      { text: this.arrDataTabla.distraccion, bold: true, fontSize: 6, alignment: 'center' },
    ]);
    tabla.push([
      { text: "POSIBLE FATIGA", bold: true, fontSize: 6, alignment: 'center' },
      { text: this.arrDataTabla.posible_fatiga, bold: true, fontSize: 6, alignment: 'center' },
    ]);
    tabla.push([
      { text: "FATIGA EXTREMA", bold: true, fontSize: 6, alignment: 'center' },
      { text: this.arrDataTabla.fatiga_extrema, bold: true, fontSize: 6, alignment: 'center' },
    ]);

    exportFilePdf.push({
      columns: [
        {
          image: this.logo_cruzdelsur,
          width: 120,
          height: 36,
          alignment: 'left'
        },
        { width: '*', text: ''},
        { text: "", bold: true, fontSize: 12, alignment: 'center' },
        { width: '*', text: ''},
        {
          image: this.logo_gltracker,
          width: 120,
          height: 36,
          alignment: '‘right’'
        }
      ]

    });





    var p1 = this.period; //"2022-06-02 00:00:00  -  2022-06-03 23:59:00";
    console.log(p1);//['2022-03-31 00:00:00.000 - 2022-06-09 23:59:59']
    console.log(p1[0]);//['2022-03-31 00:00:00.000 - 2022-06-09 23:59:59']
    console.log(p1[0].split(" - "));//['2022-03-31 00:00:00.000 - 2022-06-09 23:59:59']

    var p11 = p1.split(" - "); //"2022-06-02"
    console.log(p11);
    // p11[0].split(" "); //"2022-06-02"
    // p11[1].split(" "); //"2022-06-02"

    var p3 = p11[0].split(" ")[0].split("-");
    var p4 = p11[1].split(" ")[0].split("-");

    // var p2 = p1.split(" "); //"2022-06-02"

    // var p3 = p2[0].split("-");
    // var p4 = p2[3].split("-");
    console.log(p3);
    console.log(p4);

    console.log(p3[2]+"/"+p3[1]+"/"+p3[0].substring(2));
    console.log(p4[2]+"/"+p4[1]+"/"+p4[0].substring(2));

    console.log("DE "+p3[2]+"/"+p3[1]+"/"+p3[0].substring(2)+" AL "+p4[2]+"/"+p4[1]+"/"+p4[0].substring(2));

    var rango_fecha = "DE "+p3[2]+"/"+p3[1]+"/"+p3[0].substring(2)+" AL "+p4[2]+"/"+p4[1]+"/"+p4[0].substring(2);

    exportFilePdf.push({
      columns: [
        { width: '*', text: ''},
        { text: rango_fecha, bold: true, fontSize: 12, alignment: 'center' },
        { width: '*', text: ''},
      ]
    });

    exportFilePdf.push({
      table: {
        widths: ['*'],
        body: [[" "], [" "]]
      },
      layout: {
        hLineWidth: function(i:any, node:any) {
          return  0;
        },
        vLineWidth: function(i:any, node:any) {
          return 0;
        },
      }
    });

    exportFilePdf.push({
      columns: [
        { width: '*', text: ''},
        { text: "RESUMEN DE EVENTOS", bold: true, fontSize: 12, alignment: 'center' },
        { width: '*', text: ''},
      ]
    });


    // console.log(logo_cruzdelsur);

    // exportFilePdf.push({
    // 	columns: [
    // 		{ width: '*', text: ''},
    // 		{
    // 			image: logo_cruzdelsur,
    // 			width: 400,
    // 			height: 200,
    // 			alignment: 'left'
    // 		},
    // 		{ width: '*', text: ''}
    // 	]
    // });




    exportFilePdf.push({
      table: {
        widths: ['*'],
        body: [[" "], [" "]]
      },
      layout: {
        hLineWidth: function(i:any, node:any) {
          return  0;
        },
        vLineWidth: function(i:any, node:any) {
          return 0;
        },
      }
    });

    exportFilePdf.push({
      columns: [
        { width: '*', text: ''},
        {
          width: 'auto',
          table: {
          body: tabla
          }
        },
        { width: '*', text: ''}
      ]
    });

    exportFilePdf.push({
      columns: [
        { width: '*', text: ''},
      ],
      pageBreak:  'before'
    });


    for (let index = 0; index < this.arrDataPlot.length; index++) {

      if (titulosEvento[index] != '') {

        //Titulos => DISTRACCION - POSIBLE FATIGA - FATIGA EXTREMA
        exportFilePdf.push({
          columns: [
            {
              image: this.logo_cruzdelsur,
              width: 120,
              height: 36,
              alignment: 'left'
            },
            { width: '*', text: ''},
            {
              width: 'auto',
              text: titulosEvento[index],
              fontSize: 12,
              bold: true
            },
            { width: '*', text: ''},
            {
              image: this.logo_gltracker,
              width: 120,
              height: 36,
              alignment: 'right'
            }
          ]
        });

      }

      // espacio luego del titulos
      // exportFilePdf.push({
      // 	table: {
      // 		widths: ['*'],
      // 		body: [[" "]]
      // 	},
      // 	layout: {
      // 		hLineWidth: function(i, node) {
      // 			return  0;
      // 		},
      // 		vLineWidth: function(i, node) {
      // 			return 0;
      // 		},
      // 	}
      // });

      exportFilePdf.push({
        columns: [
          { width: '*', text: ''},
          {
            width: 'auto',
            text: titulos[index]
          },
          { width: '*', text: ''}
        ]
      });



      const somePlot :any = this.arrDataPlot[index];

      if (somePlot != '') {


        var myCanvas = somePlot.getCanvas();
        var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  /// here is the most important part because if you dont replace you will get a DOM 18 exception.
        // console.log(image);
        // document.location.href=image;

        exportFilePdf.push({
          columns: [
            { width: '*', text: ''},
            {
              image: image,
              width: 400,
              height: 195,
              alignment: 'left'
            },
            { width: '*', text: ''}
          ]
        });

        // Espacio debajo del grafico
        exportFilePdf.push({
          table: {
            widths: ['*'],
            body: [[" "]]
          },
          layout: {
            hLineWidth: function(i:any, node:any) {
              return  0;
            },
            vLineWidth: function(i:any, node:any) {
              return 0;
            },
          }
        });

      }

      //Salto de pagina cada 2 imagenes
      if (index==1 || index==3 || index==5 || index == 7 || index==9) {
        exportFilePdf.push({
          columns: [
            { width: '*', text: ''},
          ],
          pageBreak: 'before'        //index != 0 ? 'before' : ''
        });
      }

    }

    // console.log(exportFilePdf);

    if(bol_datos_pdf){
      var docDefinition = {
        pageOrientation: 'landscape',
            content: exportFilePdf,
            footer: function(page:any, pages:any) {
                return {
                    columns: [
                        {
                            alignment: 'center',
                            text: [
                                { text: '----------------------------------------------------------------------- ' + page.toString()},
                                ' de ',
                                { text: pages.toString() + ' -----------------------------------------------------------------------'}
                            ]
                        }
                    ],
                    margin: [0, 0]

                };
            }

        };
        pdfMake.createPdf(docDefinition).download('ReporteSensorFatiga.pdf');

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }



  exportExcelExcesosVelocidadFormatoExtendido(vrs: number) {
    //vm.dateHour();
    var exportFileEx = [];
    var bol_datos_ex = false;

    var allRows: AllRows[] = [
        {}, {
          cells: [
            { value: "REPORTE  DE EXCESOS DE VELOCIDAD (FORMATO EXTENDIDO)", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
          ]
        }
    ];

    this.data.forEach((data: any,idx:any) => {

      if(data[1].length > 0){
        bol_datos_ex = true;

        var rows:AllRows[] = [
          {},
          {
            cells: [
              { value: "REPORTE  DE EXCESOS DE VELOCIDAD (FORMATO EXTENDIDO)", bold: true, vAlign: "center", hAlign: "center", fontSize: this.t1, colSpan: 6 }
            ]
          },
          {},
          {
            cells: [
              // { value: "VEHÍCULO : " + data[0][1], color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.period, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 6 },
            ]
          },
          {}
        ];

        if(this.chkDateHour) {
          rows.push({
            cells: [

              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Hora", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Límite de Velocidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Exceso de Velocidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });



          data[1].forEach((item: { fecha_inicio: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; nombre_zona: any; v0: any; velocidad: any;}, index: number) => {

            //var fh = item.fecha.split(" ");
            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({
              cells: [

                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha_inicio), format: "yyyy/mm/dd", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChs(item.fecha_inicio), format: "hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.nombre_zona, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.v0+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velocidad+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        } else {

          rows.push({
            cells: [
              { value: "Item", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Fecha", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Código", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Placa", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Tipo de Unidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Id Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Conductor", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

              { value: "Tramo", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Límite de Velocidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Exceso de Velocidad", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },
              { value: "Ubicación", bold: false, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 },

            ]
          });


          data[1].forEach((item: { fecha_inicio: number;  latitud: number; longitud: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any; nombre_zona: any; v0: any; velocidad: any;}, index: number) => {

            var ubicacion = item.latitud + "," + item.longitud;

            rows.push({

              cells: [
                { value: (index + 1), vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: this.isChe(item.fecha_inicio), format: "yyyy/mm/dd hh:mm:ss", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.codigo, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.placa, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.tipo_unidad, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.idConductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.conductor, vAlign: "center", hAlign: "center", fontSize: this.c1 },

                { value: item.nombre_zona, vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.v0+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: item.velocidad+" Km/h", vAlign: "center", hAlign: "center", fontSize: this.c1 },
                { value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 },

              ]
            });
          });

        }

        // //********************************************* excel version 1 *********************************
    if (vrs == 1) {
      exportFileEx.push({
      freezePane: {
        rowSplit: 6
        },
      columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
      ],
      title: "Resultado",//data[0][1],
      rows: rows
      });
    }
    // //********************************************* excel version 1 *********************************

    // //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      rows.splice(1, 1);
      allRows = allRows.concat(rows);
    }
    // //********************************************* excel version 2 *********************************


      }
    });

    //********************************************* excel version 2 *********************************
    if (vrs == 2) {
      exportFileEx.push({
        freezePane: {
          rowSplit: 2
        },
        columns: [
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },
        { width: 200 },{ width: 200 },{ width: 200 },{ width: 200 },{ width: 200 }
        ],
        title: "Resultado",//data[0][1],
        rows: allRows
      });
    }
    //********************************************* excel version 2 *********************************

    console.log(exportFileEx);

    if(bol_datos_ex){
      var workbook = new kendo.ooxml.Workbook({
        sheets: exportFileEx
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "exportExcelExcesosVelocidadFormatoExtendido.xlsx"
      });

    } else {
      alert('No se han encontrado datos para exportar');
    }
  }



}
