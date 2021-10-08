import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-gsm-header',
  templateUrl: './gsm-header.component.html',
  styleUrls: ['./gsm-header.component.scss']
})
export class GsmHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }

  refresh(params: any) : boolean {
        return true;
  }

}
