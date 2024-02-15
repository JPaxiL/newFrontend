import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import * as moment from 'moment';
import { Driver,Ibutton,Icipia,HistoryDriver } from '../models/interfaces';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  public drivers:Driver[] = [];
  public ibuttons:Ibutton[] = [];
  public icipias:Icipia[] = [];

  public nombreComponente:string = "LISTAR";

  public idDriverEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  tblDataDriver: Driver[] = [];
  tblDataDriverSearch: Driver[] = [];
  initializingDriver: boolean = false;

  modalActive:boolean = false;
  isRowDataEmpty: boolean = false;

  //HISTORIAL DEPRECATE
  historyDriverActive:boolean =false;
  historyType: string = 'driver';

  //RECONOCIMIENTO DE DRIVER
  historyDrivers:HistoryDriver[] = [];
  //LISTA COMPLETA DE IBUTTONS NO ASIGNADAS
  availableIbuttons: Ibutton[] = [];

  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
    public userDataService:UserDataService
  ) { }


  public async initialize() {
    this.spinner.show('loadingDrivers');
    await this.getAll();
    // await this.getHistoryAll();
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
    //FILTRAR SOLO DEL USER
    const filteredDrivers = this.drivers.filter((driver) => driver.id_usuario == this.userDataService.userData.id);
    // console.log('DRIVERS FILTRADO->',filteredDrivers); //PARA LA TABLA
    // console.log('drivers: ', this.drivers);
    for (let i = 0; i < filteredDrivers.length; i++) {
      filteredDrivers[i].tracker_imei = filteredDrivers[i].tracker_imei ?? '--';
      filteredDrivers[i].tracker_nombre = filteredDrivers[i].tracker_nombre ?? '--';
      filteredDrivers[i].nro_llave = filteredDrivers[i].nro_llave ?? '--';
      filteredDrivers[i].nro_cipia = filteredDrivers[i].nro_cipia ?? '--';
      this.tblDataDriver.push(filteredDrivers[i]);
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

  public async getIbuttonAll(){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/ibuttonsAll`).toPromise()
    .then(response => {
      console.log("------------LISTA DE IBUTTONS COMPLETA");
      console.log(response.data);
      this.availableIbuttons = response.data;
    });
  }

  public getIbutton(ibutton_id:string):string{
    // console.log('IBUTTON ID',ibutton_id);
    const ibutton = this.availableIbuttons.find((ibutton:Ibutton) =>
    ibutton.var_llave!.includes(ibutton_id!)
    );
    if(ibutton){
      // console.log('LLAVE->',ibutton);
      return ibutton.var_llave!;
    }else{
      return '-';
    }
  }
  
  public getDriverById(id:number):string{
    // console.log('ID->',id);
    const driver = this.drivers.find(driver => driver.id == id);
    if (driver){
      // console.log('DRIVER FIND->',driver);
      return driver.nombre_conductor;
    }else{
      return 'No Especificado';
    }
  }
  public getNameDriver(var_imei:string,key_id?:string,date?:string){
    if (key_id && date){
      // console.log('10');
      return this.getNameDriverByDate(var_imei,key_id,date);
    }else if(key_id && !date){
      // console.log('11');
      return this.getNameDriverByKey(var_imei,key_id);
    }else if(!key_id && date){
      // console.log('12');
      return this.getNameDriverByDate(var_imei,key_id,date);
    }else{
      // console.log('13');
      return this.getNameDriverByImei(var_imei);
    }
  }
  public getNameDriverByKey(var_imei:string,key_id?:string):any{
    const driver = this.historyDrivers.find((history_driver:HistoryDriver) =>
    (history_driver.nro_key.includes(key_id!)&& (key_id != '0') )|| history_driver.nro_key === var_imei
    );
    if (driver) {
      return {
        id_driver: driver.id_driver.toString(),
        nro_key: driver.nro_key,
        name_driver: driver.name_driver,
        type_key: driver.type_key
      };
    } else {
      return {
        nro_key: null,
        id_driver: null,
        name_driver: 'No especificado',
        type_key: 'No tiene'
      }
    }
  }

  public getNameDriverByImei(var_imei:string):any{
    const driver = this.historyDrivers.find((history_driver:HistoryDriver) =>
    history_driver.nro_key === var_imei
    );
    if (driver) {
      return {
        id_driver: driver.id_driver,
        nro_key: driver.nro_key,
        name_driver: driver.name_driver,
        type_key: driver.type_key
      };
    } else {
      return {
        id_driver: null,
        name_driver: 'No especificado',
        nro_key: null,
        type_key: 'No tiene'
      }
    }
  }

  public getNameDriverByDate(var_imei:string,key_id?:string,date?:any):any{
    //OBTENER NOMBRE POR FECHA
    // console.log(var_imei,key_id,date);
    // console.log(this.historyDrivers);
    // console.log(parsedDate,moment(this.historyDrivers[3].fecha_ini),moment(this.historyDrivers[3].fecha_fin));
    const parsedDate = date ? moment(date) : null;
    const driver = this.historyDrivers.find((history_driver:HistoryDriver) => {
      return (
        (history_driver.nro_key.includes(key_id!) && (key_id != '0')) || history_driver.nro_key === var_imei) && (parsedDate &&
        (moment(history_driver.fecha_ini).isBefore(parsedDate) &&
         (!history_driver.fecha_fin || moment(history_driver.fecha_fin).isAfter(parsedDate)))
      );
    });
    if (driver) {
      // console.log('DRIVER FIND->',driver);
      return {
        id_driver: driver.id_driver,
        name_driver: driver.name_driver,
        type_key: driver.type_key,
        nro_key: driver.nro_key,
        fecha: date || null
      };
    } else {
      return {
        nro_key: null,
        id_driver: null,
        name_driver: 'No especificado',
        type_key: 'No tiene',
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

  // public async updateViewDriverHistory() {
  //   const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/driver/updateView`,'').toPromise();
  //   console.log(response);
  //   return response;//[success=true,message]
  // }
 

  

}
