import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class DriversService {

  public drivers:any = [];

  public nombreComponente:string = "LISTAR";

  public idDriverEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  tblDataDriver: any = [];
  initializingDriver: boolean = false;

  modalActive:boolean = false;
  isRowDataEmpty: boolean = false;


  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
  ) { }


  public async initialize() {
    this.spinner.show('loadingDrivers');
    await this.getAll();

  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1) {

    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/driverDataAll`).toPromise()
    .then(response => {
      // console.log("------------CONDUCTORES");
      this.drivers = response.data;
      this.initializeTable();
      this.initializingDriver = true;

    });
  }


  initializeTable() {
    this.tblDataDriver = [];
    // console.log('drivers: ', this.drivers);
    for (let i = 0; i < this.drivers.length; i++) {
      this.tblDataDriver.push({trama:this.drivers[i]});
    }
    this.isRowDataEmpty = this.tblDataDriver.length == 0;
    this.spinner.hide('loadingDrivers');

  }

  public async create(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/driver/create`,subuser).toPromise();
    console.log(response);
    return response;
  }

  public async edit(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/driver/edit`,subuser).toPromise();
    console.log(response);
    return response;
  }

  public async delete(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/driver/delete`,subuser).toPromise();
    console.log(response);
    return response;//[1,0]
  }

}
