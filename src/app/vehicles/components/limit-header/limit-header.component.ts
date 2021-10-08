import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-limit-header',
  templateUrl: './limit-header.component.html',
  styleUrls: ['./limit-header.component.scss']
})
export class LimitHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }
  
  refresh(params: any) : boolean {
        return true;
  }

}
