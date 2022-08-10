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

  public value: any;
  params: any;


  agInit(headerParams: IHeaderParams): void {}

  constructor(private vehicleService:VehicleService) { 
    this.value = this.vehicleService.allEyes;
  }

  refresh(params: any) : boolean {
        return true;
  }

  onClickEye(){
    //console.log('all eye');
    //this.value = !this.value;
    //console.log('params',this.params);

    const data = this.vehicleService.vehicles;

    for (let x of data){
      x.eye=this.value.state;
    }
    this.vehicleService.countOpenEyes = this.value.state? this.vehicleService.vehicles.length: 0;
    // this.vehicleService.clickEyeAll.emit()
    this.vehicleService.updateVehiclesData(data);
  }

}
