import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-follow-header',
  templateUrl: './follow-header.component.html',
  styleUrls: ['./follow-header.component.scss']
})
export class FollowHeaderComponent implements IHeaderAngularComp {

  agInit(headerParams: IHeaderParams): void {}

  constructor() { }

  refresh(params: any) : boolean {
        return true;
  }

}
