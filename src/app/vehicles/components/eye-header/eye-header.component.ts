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

  public value: boolean = true;
  params: any;


  agInit(headerParams: IHeaderParams): void {}

  constructor(private vehicleService:VehicleService) { }

  refresh(params: any) : boolean {
        return true;
  }

  onClickEye(){
    console.log('all eye');
    this.value = !this.value;
    console.log('params',this.params);

    const data = this.vehicleService.vehicles;

    for (let x of data){
      x.eye=this.value;
    }
    // this.vehicleService.clickEyeAll.emit()
    this.vehicleService.updateVehiclesData(data);
  }

}
