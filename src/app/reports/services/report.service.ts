import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  @Output() showReport: EventEmitter<any> = new EventEmitter();

  constructor() { }

  params:any;
  modalActive:boolean = false;
  workingOnReport: boolean = false;
  objGeneral :any = {};
  chkApiGoogle : any = false;

  setParams(values:any) {
    console.log("se ejecuta setParams");
    this.params = values;
  }

  getParams(){
    console.log("se obtiene setParams");
    return this.params;
  }

  setApiGoogle(value:any) {
    console.log("se ejecuta setApiGoogle");
    this.chkApiGoogle = value;
  }


}
