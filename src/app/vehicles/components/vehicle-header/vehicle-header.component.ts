import { Component, EventEmitter, Output, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.scss']
})
export class VehicleHeaderComponent implements IHeaderAngularComp {

  @ViewChild('spanGeneral') spanGeneral!: ElementRef;
  @ViewChild('spanGroup') spanGroup!: ElementRef;
  element: any=[];
  element1: any=[];
  sortStatus: number=1; //1 a-z, -1 z-a
  @Output() sort = new EventEmitter<number>();

  agInit(headerParams: IHeaderParams): void {}

  constructor(private vehicleService: VehicleService, private renderer: Renderer2) {
    console.log("this.spanGroup", this.spanGroup);
  }

  ngOnDestroy(): void {
    this.element = document.getElementById(this.spanGroup.nativeElement.getAttribute('aria-describedby'));
    this.element1 = document.getElementById(this.spanGeneral.nativeElement.getAttribute('aria-describedby'));
    if(this.element){
      this.renderer.removeClass(this.element, 'show');
    }
    if(this.element1){
      this.renderer.removeClass(this.element1, 'show');
    }

  }
  onGroup(){
    this.vehicleService.listTable=1;
    this.vehicleService.clickListTable.emit(1);
  }

  onGeneral(){
    this.vehicleService.listTable=0;
    this.vehicleService.clickListTable.emit(0);
  }
  refresh(params: any) : boolean {
        return true;
  }
  onVehicleSort(status: number){
    if(this.vehicleService.listTable==1){
      console.log("status==",status);
      this.sortStatus=status;
      this.sort.emit(status);
    }
  }


}
