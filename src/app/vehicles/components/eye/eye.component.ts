import { Component, OnInit } from '@angular/core';

import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-eye',
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.scss']
})
export class EyeComponent implements OnInit {

  params: any;

  constructor(
    private vehicleService : VehicleService
  ) { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

  onClickEye(){

    this.params.value = !this.params.value;

    // const data = this.vehicleService.vehicles;
    //
    // for (let x of data){
    //   if(this.params.data.IMEI == x.IMEI){
    //     x.eye = !x.eye;
    //   }
    // }
    // this.vehicleService.vehicles = data;
    this.vehicleService.clickEye.emit(this.params.data.IMEI);

    // this.vehicleService.updateVehiclesData(data);
  }

}
