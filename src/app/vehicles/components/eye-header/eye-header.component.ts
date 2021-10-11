import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-eye-header',
  templateUrl: './eye-header.component.html',
  styleUrls: ['./eye-header.component.scss']
})
export class EyeHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }

  refresh(params: any) : boolean {
        return true;
  }

}
