import { HttpClient } from '@angular/common/http';
import { NgModule, Component, ViewChild , OnInit, OnDestroy, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportService } from '../../services/report.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

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
  Math = Math;

  //@Output() localStorageReportData = new EventEmitter();
  is_new_tab: boolean = false;
  dt_completed = 0;

  
  dtRendered = localStorage.getItem("report_data") !== null;

  constructor(
    private http:HttpClient,
    private reportService:ReportService,
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
          /* this.table_hide = ''; */
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
        this.table_hide = '';

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
      this.period = report_data.period;

      //this.dtTrigger.next();
      setTimeout(() => {
        this.dtTrigger.next();    
      });

      this.table_hide = '';

      console.log('Proceso terminado a las: ', new Date());
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

}