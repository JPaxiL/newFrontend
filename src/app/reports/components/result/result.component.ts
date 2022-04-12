import { HttpClient } from '@angular/common/http';
import { Component, ViewChild , OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent  {

  /* constructor() { }

  ngOnInit(): void {
  } */

  readonly ROOT_URL = 'http://localhost/api';
  report_table: any=[];
  num_rep: any;
  table_headers: any;
  table_data: any;



  constructor(
    private http:HttpClient,
    private reportService:ReportService
  ){
    
  }

  ngOnInit(){
    this.reportService.showReport.subscribe(data => {
      console.log('Recibiendo data en result', data);
      console.log(typeof data);
      console.log(typeof this.report_table);
      this.report_table = data.data;
      this.num_rep = data.numRep;
      console.log(this.report_table);
      console.log(this.num_rep);
      console.log(typeof this.report_table);
      console.log(typeof this.num_rep);

      if(this.num_rep == 7){
        this.table_headers = [
          ['codigo', 'Código'],
          ['placa', 'Placa'],
          ['fecha', 'Fecha'],
          ['hora', 'Hora'],
          ['estado', 'Status'],
          ['velocidad', 'Velocidad GPS'],
          ['velocidad_can', 'Velocidad CAN'],
          ['odometro', 'Odometro'],
          ['ubicacion', 'Ubicación'],
          ['zonaCercana', 'Referencia'],
        ];
        console.log(this.table_headers);
      }
    })
  }


  getPosts(){
    var param = {
      "vehiculos": "",
      "client_id": "84",
      "client_secret": "LUTj1k8Tley9SvQ1Jwmrha1HPHJs87ShfiQVB18S"
    };

    this.table_data = this.http.get(environment.apiUrl + '/api/tracker');
    /* this.posts = this.posts.sort((a: { convoy: any; }, b: { convoy: any; }) => a.convoy.localeCompare(b.convoy)); */
    return this.table_data;

/* 
    return this.posts = (JSON.stringify(this.http.get(environment.apiUrl + '/api/tracker'))); */
    /* return this.posts = this.http.get(this.ROOT_URL + '/informes/informes_general'); */
  }

}

export class AppComponent {
  

}
