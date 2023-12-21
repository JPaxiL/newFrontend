import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-tag-driver-header',
  templateUrl: './tag-driver-header.component.html',
  styleUrls: ['./tag-driver-header.component.scss']
})
export class TagDriverHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }

  refresh(params: any) : boolean {
        return true;
  }

}
