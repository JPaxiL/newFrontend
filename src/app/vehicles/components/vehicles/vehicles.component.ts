import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Vehicle } from '../../models/vehicle';

import { VehicleService } from '../../services/vehicle.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {


  vehicles: Vehicle[] = [];

  constructor(
    private vehicleService: VehicleService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.vehicleService.getVehicles().subscribe(vehicles => {
        this.vehicles = vehicles;
        this.mapService.sendDataMap(this.vehicles);
    });
  }






}
