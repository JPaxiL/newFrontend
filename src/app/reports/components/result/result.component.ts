import { HttpClient } from '@angular/common/http';
import { NgModule, Component, ViewChild , OnInit, OnDestroy, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportService } from '../../services/report.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng-lts/api';


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

  


  constructor(
    private http:HttpClient,
    private reportService:ReportService,
    private titleService:Title,
    private toastr:ToastrService,
    private confirmationService:ConfirmationService,
  ){
    
  }

  ngOnInit(){
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
        }
      },
      destroy: true
    };

    if(localStorage.getItem('report_data') == null){
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
      var report_data = JSON.parse(localStorage.getItem('report_data')!);
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
    console.log("Es chrome ? " + this.isChrome);

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


}