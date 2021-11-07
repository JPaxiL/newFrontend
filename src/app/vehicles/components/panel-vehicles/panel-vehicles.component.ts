import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-panel-vehicles',
  templateUrl: './panel-vehicles.component.html',
  styleUrls: ['./panel-vehicles.component.scss']
})
export class PanelVehiclesComponent implements OnInit {
  listTable: number = 0;

  constructor(private vehicleService: VehicleService) {
    this.listTable = this.vehicleService.listTable;
    this.vehicleService.clickListTable.subscribe(res=>{
      console.log("cambio de tabla panel", res);
      this.listTable = this.vehicleService.listTable;
    } );
  }

  ngOnInit(): void {

  }

}
