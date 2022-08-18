import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventService } from 'src/app/events/services/event.service';
import collect from 'collect.js';
import { DashboardService } from '../../service/dashboard.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-panal-dashboard',
  templateUrl: './panal-dashboard.component.html',
  styleUrls: ['./panal-dashboard.component.scss']
})
export class PanalDashboardComponent implements OnInit {
  loadingDashboard: boolean = false;
  public vehicles:any = [];
  group: any = [];
  convoy:any = [];
  imeis:any = [];
  selectedGroup:any;
  selectedConvoy:any;
  windowAccess = window;

  constructor(
    private vehicleService : VehicleService,
    private spinner: NgxSpinnerService,
    private eventService: EventService,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.spinner.show('loadingDashboard');

    let gp = collect(this.getVehicles()).groupBy('grupo');
    console.log("gp =====> ", gp);
    gp.each( (items:any, index:any) => {
      console.log("items:any, index:any", items, index)
      this.group.push({
        value:index,
        label:index,
      });
    });

    this.spinner.hide('loadingDashboard');
  }

  getVehicles(){
    return this.vehicleService.getVehiclesData();
  }

  changeGroup(){

    this.convoy = _.uniqBy(this.getVehicles(), 'convoy');
    this.convoy = this.convoy.map((convoy:any) => {
      return { value:convoy.idconvoy, label:convoy.convoy, groupName: convoy.grupo}
    })
    .filter( (convoy:any) => {
      return convoy.label != "Unidades Sin Convoy" && convoy.groupName == this.selectedGroup
    });
  }

  changeConvoy(){

    let vehicles = this.getVehicles()
    .filter( (vehicle:any) => vehicle.idconvoy == this.selectedConvoy )
    .map( (item:any) => {return item.IMEI} );

    localStorage.setItem('vahivles-dashboard',JSON.stringify(vehicles));

  }

}
