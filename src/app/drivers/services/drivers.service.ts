import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  public drivers:any = [];
  public ibuttons:any = [];
  public icipias:any = [];

  public nombreComponente:string = "LISTAR";

  public idDriverEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  tblDataDriver: any = [];
  tblDataDriverSearch: any = [];
  initializingDriver: boolean = false;

  modalActive:boolean = false;
  isRowDataEmpty: boolean = false;

  //HISTORIAL
  historyDriverActive:boolean =false;
  historyType: string = 'driver';

  //RECONOCIMIENTO DE DRIVER
  historyDrivers:any = [];

  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
  ) { }


  public async initialize() {
    this.spinner.show('loadingDrivers');
    await this.getAll();
    await this.getHistoryAll();
  }
  

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1) {

    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/driverDataAll`).toPromise()
    .then(response => {
      console.log("------------CONDUCTORES");
      console.log(response.data);
      
      this.drivers  = response.data[0];
      this.ibuttons = response.data[1];
      this.icipias = response.data[2];
      this.initializeTable();
      // this.getDataIbuttons('1');
      this.initializingDriver = true;
    });

  }

  initializeTable() {
    this.tblDataDriver = [];
    // console.log('drivers: ', this.drivers);
    for (let i = 0; i < this.drivers.length; i++) {
      this.drivers[i].tracker_imei = this.drivers[i].tracker_imei ?? '--';
      this.drivers[i].tracker_nombre = this.drivers[i].tracker_nombre ?? '--';
      this.drivers[i].nro_llave = this.drivers[i].nro_llave ?? '--';
      this.drivers[i].nro_cipia = this.drivers[i].nro_cipia ?? '--';
      this.tblDataDriver.push({trama:this.drivers[i]});
    }
    this.isRowDataEmpty = this.tblDataDriver.length == 0;
    this.spinner.hide('loadingDrivers');
    //MANDA UNA COPIA
    this.tblDataDriverSearch = this.tblDataDriver;

  }

  public getTableDataDriver(){
    return this.tblDataDriver;
  }

  public getTableAllData(){
    return this.tblDataDriverSearch;
  }

  public async getHistoryAll() {
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/historyAll`).toPromise()
    .then(response => {
      console.log("------------HISTORIAL CONDUCTORES");
      console.log(response.data);
      this.historyDrivers = response.data;
    });
  }

  public getNameDriver(var_imei:string,key_id?:string,date?:string){
    if (key_id && date){
      console.log('10');
      return this.getNameDriverByDate(var_imei,key_id,date);
    }else if(key_id && !date){
      console.log('11');
      return this.getNameDriverByKey(var_imei,key_id);
    }else if(!key_id && date){
      console.log('12');
      return this.getNameDriverByDate(var_imei,key_id,date);
    }else{
      console.log('13');
      return this.getNameDriverByImei(var_imei);
    }
  }
  public getNameDriverByKey(var_imei:string,key_id?:string):any{
    const driver = this.historyDrivers.find((driver: { nro_key: string;}) =>
    (driver.nro_key === key_id || driver.nro_key === key_id)|| driver.nro_key === var_imei
    );
    if (driver) {
      return {
        id_driver: driver.id_driver.toString(),
        name_driver: driver.name_driver,
        typeKey: driver.type_key
      };
    } else {
      return {
        id_driver: null,
        name_driver: 'No especificado',
        typeKey: 'No tiene'
      }
    }
  }

  public getNameDriverByImei(var_imei:string):any{
    const driver = this.historyDrivers.find((driver: { nro_key: string; }) =>
      driver.nro_key === var_imei
    );
    if (driver) {
      return {
        id_driver: driver.id_driver.toString(),
        name_driver: driver.name_driver,
        typeKey: driver.type_key
      };
    } else {
      return {
        id_driver: null,
        name_driver: 'No especificado',
        typeKey: 'No tiene'
      }
    }
  }

  public getNameDriverByDate(var_imei:string,key_id?:string,date?:any):any{
    //OBTENER NOMBRE POR FECHA
    // console.log(var_imei,key_id,date);
    // console.log(this.historyDrivers);
    // console.log(parsedDate,moment(this.historyDrivers[3].fecha_ini),moment(this.historyDrivers[3].fecha_fin));
    const parsedDate = date ? moment(date) : null;
    const driver = this.historyDrivers.find((driver: { 
      nro_key: string;
      fecha_ini: any;
      fecha_fin: any;
      type_key: string;
    }) => {
      return (
        (driver.nro_key === key_id || driver.nro_key === key_id) || driver.nro_key === var_imei) && (parsedDate &&
        (moment(driver.fecha_ini).isBefore(parsedDate) &&
         (!driver.fecha_fin || moment(driver.fecha_fin).isAfter(parsedDate)))
      );
    });
    if (driver) {
      return {
        id_driver: driver.id_driver.toString(),
        name_driver: driver.name_driver,
        type_key: driver.type_key,
        fecha: date || null
      };
    } else {
      return {
        id_driver: null,
        name_driver: 'No especificado',
        typeKey: 'No tiene',
        fecha: date || null
      };
    }
  }

  
  // getDataIbuttons(id: string) {
  //   let url = `${environment.apiUrl}/api/getIbutton/${id}`;
  //   this.ibuttons = this.http.get(url);
  //   console.log("--------------lista de ibuttons");
  //   console.log(this.ibuttons);
  //   //return buttons;
  // }



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
