import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  @Output() showReport: EventEmitter<any> = new EventEmitter();

  constructor() { }

  params : any;
  modalActive : boolean = false;
  workingOnReport : boolean = false;
  objGeneral : any = {};
  chkApiGoogle : any = false;
  contReport : any = 0;
  userId : any = 0;
  chkRiesgo : any = false;

  str_nombre_eventos : any;

  eC:any; //Reporte 6 - Reporte de Eventos , Seleccion de Campo = Eventos Campos


  data = [];

  setParams(values:any) {
    console.log("se ejecuta setParams");
    this.params = values;
    //======
    this.contReport = this.contReport +1;
  }

  getParams(){
    console.log("se obtiene setParams");
    return this.params;
  }

  setApiGoogle(value:any) {
    console.log("se ejecuta setApiGoogle");
    this.chkApiGoogle = value;
  }

  setUserId(value:any) {
    console.log("se ejecuta setApiGoogle");
    this.userId = value;
  }
  
  getUserId(){
    console.log("se obtiene ID usuario");
    return this.userId;
  }

  setDatos(b:any){
    this.data = b;
  }

  getDatos(){
    return this.data;
  }

}
