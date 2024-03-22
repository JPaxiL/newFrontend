import { Component, OnInit, OnDestroy } from '@angular/core';

import {DialogModule} from 'primeng-lts/dialog';
import { ReportService } from '../../services/report.service';
import { ConfirmationService } from 'primeng-lts/api';

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

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  constructor(
    public reportService:ReportService,
    private confirmationService:ConfirmationService,

  ) { }

  /* EXPORTAR */
  t1=18; // Titulo Principal
  t2=16; // Sub titulos
  t3=14; // Cabeceras
  c1=12; // Cuerpo
  r1=12; // RESUMEN

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



  display=false;
  data :any = [];
  periodo :any = "";
  vehiculo :any = "";
  chkDateHour :any = "";
  numRep :any;

  dtOptions = {
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
        // this.dt_completed++;
        // console.log('Terminado de cargar y popular tabla ' + this.dt_completed);
        // if(this.dt_completed == document.querySelectorAll('table[datatable]').length){
        //   this.wrapElements(document.querySelectorAll('table[datatable]'));
        //   this.table_hide = '';
        //   if(!isIndependentWindow){
        //     this.spinner.hide("reportSpinner");
        //   }
        // }
        // if (this.num_rep == 19) {
        //     this.runReportGerencial(1);
        //     setTimeout(() => {
        //       this.runReportGerencial(1);
        //     }, 1000);
        // }
      },
      destroy: true
  };

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



  ngOnInit(): void {
    console.log("====MODAAAAAAALL ABIERTOOOO=====");
    console.log(this.reportService.objGeneral);


    // <th *ngIf="reportTableDropdownData[2].velGPS && report_data.num_rep != 'R036'" >Velocidad GPS</th>
    // <th *ngIf="reportTableDropdownData[2].velGPS && report_data.num_rep == 'R036'" >Velocidad 360</th>


    
    this.display = true;

    this.data = this.reportService.objGeneral.data;
    this.periodo = this.reportService.objGeneral.periodo;
    this.vehiculo = this.reportService.objGeneral.vehiculo;
    this.chkDateHour = this.reportService.objGeneral.dateHour;
    this.numRep = this.reportService.objGeneral.numRep;

    

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


  ngOnDestroy(){
    console.log("====MODAAAAAAALL CERRADDD =====");
    this.display = false;
    this.reportService.modalActive = false;
  }

  showSelectExcel(fn_name: string){
    this.confirmationService.confirm({
      key: 'showSelectExcelConfirmation',
      //message: 'Are you sure that you want to perform this action?',
      reject: () => {
        console.log("Reporte de Excel Unido (cascada)");
        //this[fn_name as keyof ResultComponent](2);
        this.exportExcelGeneral(2);
      },
      accept: () => {
        console.log("Reporte de Excel por separado (hojas)");
        //this[fn_name as keyof ResultComponent](1);
        this.exportExcelGeneral(1);
      }
    });
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
              { value: "VEHÍCULO : " + this.vehiculo, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 2 },
              { value: "PERIODO : " + this.periodo, color: "#FFF", background: "#000", vAlign: "center", hAlign: "center", fontSize: this.t2, colSpan: 4 },
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



        //==================================
        if (data[2].pCercano) { cellsCampos.push({ value: "Punto Cercano", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velCAN) { cellsCampos.push({ value: "Velocidad CAN", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velGPS) { cellsCampos.push({ value: "Velocidad GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velGPS_speed) { cellsCampos.push({ value: "Velocidad GPS speed", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velMobileye_ME460) { cellsCampos.push({ value: "Velocidad Mobileye", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].velECO) { cellsCampos.push({ value: "Velocidad ECO", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].DUOT2state) { cellsCampos.push({ value: "DUOT2 state", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].RxM) { cellsCampos.push({ value: "Rev.X.Min", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].RPMAlta) { cellsCampos.push({ value: "RPM Alta", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].cNivel) { cellsCampos.push({ value: "Nivel de Combustible", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].cRestante) { cellsCampos.push({ value: "C.Restante", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].cMotor) { cellsCampos.push({ value: "C.Motor", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].odometro) { cellsCampos.push({ value: "Odómetro", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].altitud) { cellsCampos.push({ value: "Altitud", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].angulo) { cellsCampos.push({ value: "Angulo", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };

        if (data[2].alimentGps) { cellsCampos.push({ value: "Alimentación GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].nivelBateria) { cellsCampos.push({ value: "Nivel de Bateríar", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].nivelCobertura) { cellsCampos.push({ value: "Nivel de Cobertura", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].temperaturaGps) { cellsCampos.push({ value: "Temperatura GPS", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].satelite) { cellsCampos.push({ value: "Satélite", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };

        if (data[2].recFacial) { cellsCampos.push({ value: "Reconocimiento Facial", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].onOff) { cellsCampos.push({ value: "On/Off", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].alcoholemia) { cellsCampos.push({ value: "Alcoholemia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].parametros) { cellsCampos.push({ value: "Parámetros", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].ubicacion) { cellsCampos.push({ value: "Ubicación", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].referencia) { cellsCampos.push({ value: "Referencia", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].fatiga) { cellsCampos.push({ value: "Fatiga", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].fExBrusca) { cellsCampos.push({ value: "Frenada Extrema Brusca", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].fBrusca) { cellsCampos.push({ value: "Frenada Brusca", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };
        if (data[2].aBrusca) { cellsCampos.push({ value: "Aceleración Brusca", bold: true, color: "#ffffff", background: "#128fe8", vAlign: "center", hAlign: "center", fontSize: this.t3 }); };



        rows.push({
            cells: cellsCampos
        });

        //================= FIN CABECERA =================

        //====================  CUERPO =============================
        data[1].forEach((item: { satelite:any; temperaturaGps:any; nivelCobertura:any; nivelBateria:any; alimentGps:any;fecha: number;  lat: number; lng: number; codigo: any; placa: any; tipo_unidad: any; idConductor: any; conductor: any;
          vel_gps_speed: any; vel_can: any; tramo: string; PC: any;
        referencia:any; fServidor:any; velGPS:any; velECO:any; velGPS_speed:any; velMobileye_ME460:any; altitud:any; angulo:any; fatiga:any; fExBrusca:any; fBrusca:any; aBrusca:any; RPMAlta:any;
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

            //-------------
            if (data[2].pCercano) { cellsCuerpo.push({ value: item.pCercano, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velCAN) { cellsCuerpo.push({ value: item.velCAN, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velGPS) { cellsCuerpo.push({ value: item.velGPS, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velGPS_speed) { cellsCuerpo.push({ value: item.velGPS_speed, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velMobileye_ME460) { cellsCuerpo.push({ value: item.velMobileye_ME460, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].velECO) { cellsCuerpo.push({ value: item.velECO, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].DUOT2state) { cellsCuerpo.push({ value: item.DUOT2state, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].RxM) { cellsCuerpo.push({ value: item.RxM, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].RPMAlta) { cellsCuerpo.push({ value: item.RPMAlta, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].cNivel) { cellsCuerpo.push({ value: item.cNivel, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].cRestante) { cellsCuerpo.push({ value: item.cRestante, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].cMotor) { cellsCuerpo.push({ value: item.cMotor, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].odometro) { cellsCuerpo.push({ value: item.odometro, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].altitud) { cellsCuerpo.push({ value: item.altitud, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].angulo) { cellsCuerpo.push({ value: item.angulo, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };

            if (data[2].alimentGps) { cellsCuerpo.push({ value: item.alimentGps, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].nivelBateria) { cellsCuerpo.push({ value: item.nivelBateria, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].nivelCobertura) { cellsCuerpo.push({ value: item.nivelCobertura, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].temperaturaGps) { cellsCuerpo.push({ value: item.temperaturaGps, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].satelite) { cellsCuerpo.push({ value: item.satelite, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
           
           
            if (data[2].recFacial) { cellsCuerpo.push({ value: item.recFacial, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].onOff) { cellsCuerpo.push({ value: item.onOff, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].alcoholemia) { cellsCuerpo.push({ value: item.alcohol_nombre, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].parametros) { cellsCuerpo.push({ value: item.parametros, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].ubicacion) { cellsCuerpo.push({ value: ubicacion, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].referencia) { cellsCuerpo.push({ value: rreeff, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].fatiga) { cellsCuerpo.push({ value: item.fatiga, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].fExBrusca) { cellsCuerpo.push({ value: item.fExBrusca, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].fBrusca) { cellsCuerpo.push({ value: item.fBrusca, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };
            if (data[2].aBrusca) { cellsCuerpo.push({ value: item.aBrusca, vAlign: "center", hAlign: "center", fontSize: this.c1 }); };

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
                        { value: "TTOTAL de alerta de alcohol en la sangre : ", vAlign: "center", hAlign: "center", fontSize: this.r1, colSpan: 3 },
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


}
