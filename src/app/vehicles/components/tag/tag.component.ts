import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
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
    this.vehicleService.clickTag.emit(this.params.data.IMEI);
  }

}
