import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-tag-imei',
  templateUrl: './tag-imei.component.html',
  styleUrls: ['./tag-imei.component.scss'],
})
export class TagImeiComponent implements IHeaderAngularComp {
  agInit(headerParams: IHeaderParams): void {}

  constructor() {}

  refresh(params: any): boolean {
    return true;
  }
}
