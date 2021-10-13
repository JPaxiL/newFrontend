import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-eye-header',
  templateUrl: './eye-header.component.html',
  styleUrls: ['./eye-header.component.scss']
})
export class EyeHeaderComponent implements IHeaderAngularComp {

  public value: boolean=true;


  agInit(headerParams: IHeaderParams): void {}

  constructor(private vehicleService:VehicleService) { }

  refresh(params: any) : boolean {
        return true;
  }

  onClickEye(){
    this.value = !this.value;

    const data = this.vehicleService.getVehiclesDemo();

    for (let x of data){
      // console.log("x", x.active=);
      x.active=this.value;
      // if(this.params.data.IMEI == x.IMEI){
      //   x.active = !x.active;
      // }
    }
    this.vehicleService.updateVehicleActive(data);
  }

}
