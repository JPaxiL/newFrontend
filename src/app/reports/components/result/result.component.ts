import { HttpClient } from '@angular/common/http';
import { NgModule, Component, ViewChild , OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportService } from '../../services/report.service';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnDestroy, OnInit {

  dtOptions: any = {};
  dtTrigger = new Subject<any>();
  data: any;
  table_hide = 'd-none';
  num_rep: any;
  table_headers: any;
  table_data: any;

  constructor(
    private http:HttpClient,
    private reportService:ReportService
  ){
    
  }

  ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      language:{
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
      },
      destroy: true,
      dom: 'Bfrtip',
      lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
      buttons: ['excel']
    };

    this.reportService.showReport.subscribe(data => {
      console.log('Recibiendo data en result', data);

      this.data = data.data;
      this.dtTrigger.next();
      this.table_hide = '';

    })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}