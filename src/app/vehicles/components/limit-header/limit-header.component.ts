import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-limit-header',
  templateUrl: './limit-header.component.html',
  styleUrls: ['./limit-header.component.scss']
})
export class LimitHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor(private vehicleService: VehicleService) {

  }

  refresh(params: any) : boolean {
        return true;
  }

  onClick():void{
    this.vehicleService.sortLimitVehicle();
  }


}
