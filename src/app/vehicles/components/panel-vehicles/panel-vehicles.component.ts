import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-panel-vehicles',
  templateUrl: './panel-vehicles.component.html',
  styleUrls: ['./panel-vehicles.component.scss']
})
export class PanelVehiclesComponent implements OnInit {
  listTable: number = 0;
  displayGroup: boolean = false;

  constructor(private vehicleService: VehicleService) {
    this.vehicleService.listTable = 1;
    this.listTable = this.vehicleService.listTable;

    this.vehicleService.clickListTable.subscribe(res=>{
      // //console.log("cambio de tabla panel", res);
      this.listTable = this.vehicleService.listTable;
    } );
  }

  ngOnInit(): void {

  }
  ngOnDestroy() : void {
    // //console.log('OnDestroy .......');
    this.vehicleService.listTable = -1;
  }
  onHideDisplayGroup(event : boolean){
    // //console.log('hide group panel...',event);
    this.displayGroup = event;
  }
  eventDisplayGroup(event : boolean){
    // //console.log('desde panel',event);
    this.displayGroup = event;
  }

}
