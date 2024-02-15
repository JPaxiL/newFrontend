import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-tag-driver',
  templateUrl: './tag-driver.component.html',
  styleUrls: ['./tag-driver.component.scss']
})
export class TagDriverComponent implements OnInit {
  params: any;

  constructor(
    private vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
  }
  agInit(params: any){
    this.params = params;
  }
  onClick(){
    this.vehicleService.clickDriver.emit(this.params.data.IMEI);
  }


}
