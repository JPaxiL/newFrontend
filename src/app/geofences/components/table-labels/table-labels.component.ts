import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';
import { GeofencesService } from '../../services/geofences.service';

@Component({
  selector: 'app-table-labels',
  templateUrl: './table-labels.component.html',
  styleUrls: ['./table-labels.component.scss']
})
export class TableLabelsComponent implements IHeaderAngularComp {
  public value: any;
  params: any;

  agInit(headerParams: IHeaderParams): void {}

  constructor(private geofencesService:GeofencesService) { 
    this.value = this.geofencesService.eyeInputSwitch;
  }

  ngOnInit(): void {
  }

  refresh(params: any) : boolean {
    return true;
  }

  onClickEye(){
    //console.log('all eye');
    //console.log('params',this.params);

    const data = this.geofencesService.geofences;

    for (let x of data){
      x.eye=this.value.state;
    }
    this.geofencesService.tagNamesEyeState = this.value.state? this.geofencesService.geofences.length: 0;
    // this.vehicleService.clickEyeAll.emit()
    this.geofencesService.updateGeoCounters();
  }

  get eyeInputSwitch(){
    return this.geofencesService.eyeInputSwitch;
  }

}
