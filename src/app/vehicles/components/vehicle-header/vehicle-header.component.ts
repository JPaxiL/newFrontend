import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.scss']
})
export class VehicleHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }

  refresh(params: any) : boolean {
        return true;
  }

}
