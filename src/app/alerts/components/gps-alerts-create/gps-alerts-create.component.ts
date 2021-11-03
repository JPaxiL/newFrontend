import { Component, OnInit } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Select2Data } from 'ng-select2-component';


@Component({
  selector: 'app-gps-alerts-create',
  templateUrl: './gps-alerts-create.component.html',
  styleUrls: ['./gps-alerts-create.component.scss']
})
export class GpsAlertsCreateComponent implements OnInit {
  public events:any = [];

  public loading:boolean = true;

  public vehicles:Select2Data = [];

  constructor(private AlertService: AlertService, private VehicleService : VehicleService) { }

  ngOnInit(): void {
    this.loading = false;
    this.loadData();
  }

  public async loadData(){
    this.events = await this.AlertService.getEventsByType('gps');
    this.setDataVehicles();
  }

  onSubmit(){

  }

  setDataVehicles(){
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map( (vehicle:any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.IMEI,
        data: { color: 'white', name: vehicle.IMEI },
      }
    });
  }


}
