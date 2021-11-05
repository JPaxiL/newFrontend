import { Component, OnInit } from '@angular/core';

import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  params: any;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }
  onClickIcon(){    
    this.vehicleService.onClickIcon(this.params.value.IMEI);
  }

}
