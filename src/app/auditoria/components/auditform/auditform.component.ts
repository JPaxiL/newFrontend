import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-auditform',
  templateUrl: './auditform.component.html',
  styleUrls: ['./auditform.component.scss']
})
export class AuditformComponent implements OnInit {

  @Output() selectedPlanEvent = new EventEmitter<any>();

  dateInit!: Date;
  dateEnd!: Date;
  timeInit!: Date;
  timeEnd!: Date;

  strYearRange: string = '';
  selectedReport: any={};
  registros: any=[];

  areDatesValid = true;

  spinnerOptions = false;

  isUserIdLoaded = false;

  user_id = localStorage.getItem('user_id');

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    
    ) { 
      spinner.show("fullScreenSpinner");
    }

  ngOnInit(): void {

    this.executeQuery(`${environment.apiUrl}/api/audit?user_id=${this.user_id}`);
    
    this.strYearRange = '2000:' + new Date().getFullYear();
    
    const hoy = Date.now();
    this.dateInit = new Date(moment(hoy).format("MM/DD/YYYY"));
    this.dateEnd = this.dateInit;
    this.timeInit = new Date('12/03/2018 00:00');
    this.timeEnd = new Date('12/03/2018 23:59');

		this.spinnerOptions = true;

    this.registros = [
      {id : 0, value : 'Todos'},
      {id : 1, value : 'Creados'},
      {id : 2, value : 'Actualizados'},
      {id : 3, value : 'Eliminados'},
      {id : 4, value : 'Cerrar Sesión'},
      {id : 5, value : 'Iniciar Sesión'},

    ];

  }

  onTimeChange(){
    // console.log('date init', this.dateInit);
    // console.log('date end', this.dateEnd);
    // console.log('time init', moment(new Date(this.timeInit)).format("HH:mm"));
    // console.log('time end', this.timeEnd);
    this.areDatesValid = this.dateInit != null && this.dateEnd != null && this.timeInit <= this.timeEnd;
  }

  generate(){

    var type = "";
    var query = "";

    switch(this.selectedReport){
        case 0:
          type="";
        break;
        case 1:
          type="create";
        break;
        case 2:
          type="update";
        break;
        case 3:
          type="delete";
        break;
        case 4:
          type="logout";
        break;
        case 5:
          type="login";
        break;
    }

    var f1 = moment(new Date(this.dateInit));
		var f2 = moment(new Date(this.dateEnd));
		var h1 = moment(new Date(this.timeInit));
		var h2 = moment(new Date(this.timeEnd));

    var fecha_desde = f1.format("YYYY-MM-DD") + 'T' + h1.format("HH:mm") + ':00-05:00';
		var fecha_hasta = f2.format("YYYY-MM-DD") + 'T' + h2.format("HH:mm") + ':00-05:00';

    query = `${environment.apiUrl}/api/audit?user_id=${this.user_id}&fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}`
    
    if(type != ""){
      query = query.concat(`&type=${type}`);
    }

    this.spinner.show("fullScreenSpinner");

    this.executeQuery(query);
  }

  executeQuery(query:string){
    this.http.get<any>(query).subscribe({
      next: data => {
        
        
        this.selectedPlanEvent.emit(data);
        this.spinner.hide("fullScreenSpinner");
      },
      error: () => {
        
        this.spinner.hide("fullScreenSpinner");
        Swal.fire({
          title: 'Error',
          text: `Hubo un error al obtener los datos.
          Por favor, actualiza la página`,
          icon: 'error',
          allowOutsideClick: false,
          confirmButtonText: 'Actualizar Página',
        }).then((data) => {
          if (data.isConfirmed) {
            window.location.reload();
          }
        });
      }
    });
  }

}
