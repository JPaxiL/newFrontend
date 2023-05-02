import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class SubcuentasService {

  public subUsers:any = [];
  public reportesAll:any = [];
  public eventosAll:any = [];

  public nombreComponente:string = "LISTAR";

  public idSubUserEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  tblDataSubUser: any = [];
  initializingSubUser: boolean = false;

  modalActive:boolean = false;
  isRowDataEmpty: boolean = false;


  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
  ) { }


  public async initialize() {
    await this.getReportes();
    await this.getEventos();
    await this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1) {

    // Route::post('/subUsersData', [SubUserController::class, 'getSubUsers']); // Datos de Sub usuarios usuario en Cpanel.

    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/subUsersData`).toPromise()
    .then(response => {

      console.log(response);

      this.subUsers = response;
      this.initializeTable();

      console.log('Sub cuentas Cargadas');
      this.initializingSubUser = true;

    });
  }

  public async getReportes(){
    await this.http.post<ResponseInterface>(environment.apiUrl + '/api/getReports', {}).toPromise()
    .then(response => {
        console.log("reporte ===== response");
        console.log(response);
        this.reportesAll = response;
    });
  }

  public async getEventos(){
    await this.http.get<ResponseInterface>(environment.apiUrl + '/api/events').toPromise()
    .then(response => {
        console.log(response);
        this.eventosAll = response.data;
    });
  }

  public getDataReportesAll() {
    return this.reportesAll;
  }


  public getDataEventosAll() {
    return this.eventosAll;
  }

  initializeTable(newGeofenceId?: number) {
    this.tblDataSubUser = [];
    console.log('SubUsers: ', this.subUsers);

    for (let i = 0; i < this.subUsers.length; i++) {
      // if(this.geofences[i].id != newGeofenceId){
      //   this.geofences[i].zone_name_visible_bol = (this.geofences[i].zone_name_visible === 'true');
      // } else {
      //   this.geofences[i].zone_name_visible_bol = true;
      // }
      this.tblDataSubUser.push({trama:this.subUsers[i]});
    }
    this.isRowDataEmpty = this.tblDataSubUser.length == 0;
    this.spinner.hide('loadingSubcuentas');

    // this.spinner.hide('loadingGeofencesSpinner');
    // // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});

  }

  public async create(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/subUser/create`,subuser).toPromise();
    console.log(response);
    return response;
  }

  public async edit(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/subUser/edit`,subuser).toPromise();
    console.log(response);
    return response;
  }

  public async delete(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/subUser/delete`,subuser).toPromise();
    console.log(response);
    return response;//[1,0]
  }

  public async activar(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/subUser/activate`,subuser).toPromise();
    console.log(response);
    return response;//[json,0]
  }
    // Route::post('/subUser/create', [SubUserController::class, 'crateSubUser']);

    // Route::post('/subUser/delete', [SubUserController::class, 'deleteSubUser']);

    // Route::post('/subUser/activate', [SubUserController::class, 'activateSubUser']);

}
