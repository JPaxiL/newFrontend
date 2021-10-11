import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-transmission-header',
  templateUrl: './transmission-header.component.html',
  styleUrls: ['./transmission-header.component.scss']
})
export class TransmissionHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }
  
  refresh(params: any) : boolean {
        return true;
  }

}
