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
  name_rep: any;
  table_headers: any;
  table_data: any;

  //@Output() localStorageReportData = new EventEmitter();
  is_new_tab: boolean = false;

  constructor(
    private http:HttpClient,
    private reportService:ReportService
  ){
    
  }

  ngOnInit(){
    console.log('Iniciando result component');
    console.log(this.table_hide);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      language:{
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
      },
      dom: 'Blfrtip',
      lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
      /* buttons: ['excel'], */
      buttons: [{
        extend: 'excel',
        text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Exportar a Excel',
        className: 'btn btn-success'
      }],
      destroy: true
    };

    console.log('dtOptions', this.dtOptions);

    if(localStorage.getItem('report_data') == null){
      this.reportService.showReport.subscribe(data => {
        console.log('Recibiendo data en result', data);
  
        this.data = data.data;
        this.num_rep = data.numRep;
        this.name_rep = data.nameRep;
  
        //Check if this is the first time loading
        if("dtInstance" in this.dtElement){
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
          });
        }
        this.dtTrigger.next();
        this.table_hide = '';

      })
    } else {
      console.log('Se abrirá una nueva pestaña')

      var report_data = JSON.parse(localStorage.getItem('report_data')!);

      localStorage.removeItem('report_data');
      this.data = report_data.data;
      this.num_rep = report_data.numRep;
      this.name_rep = report_data.nameRep;

      //this.dtTrigger.next();
      setTimeout(() => {
        this.dtTrigger.next();    
      });
      this.table_hide = '';

    }

   
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('report_data');
  }

}