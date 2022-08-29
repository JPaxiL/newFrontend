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
  isGroupSelected:boolean = false;
  isConvoySelected:boolean = false;

  isUnderConstruction: boolean = true;

  constructor(
    private vehicleService : VehicleService,
    private spinner: NgxSpinnerService,
    private eventService: EventService,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    if(!this.isUnderConstruction){

      if(!this.vehicleService.statusDataVehicle){
        this.spinner.show('loadingDashboard');
        this.vehicleService.dataCompleted.subscribe( vehicles => {
          let gp = collect(this.getVehicles()).groupBy('grupo');
          this.getGroups(gp);
          this.spinner.hide('loadingDashboard');
        });
      } else {
        let gp = collect(this.getVehicles()).groupBy('grupo');
        //console.log("gp =====> ", gp);
        this.getGroups(gp);
      }
  
    }
  }

  getVehicles(){
    return this.vehicleService.getVehiclesData();
  }

  getGroups(group: any){
    group.each( (items:any, index:any) => {
      console.log("items:any, index:any", items, index)
      this.group.push({
        value:index,
        label:index,
      });
    });
  }

  changeGroup(){

    this.convoy = _.uniqBy(this.getVehicles(), 'convoy');
    this.convoy = this.convoy.map((convoy:any) => {
      return { value:convoy.idconvoy, label:convoy.convoy, groupName: convoy.grupo}
    })
    .filter( (convoy:any) => {
      return convoy.label != "Unidades Sin Convoy" && convoy.groupName == this.selectedGroup
    });
    this.selectedConvoy = null; 
    this.isConvoySelected = false; 
    this.isGroupSelected = this.selectedGroup == null? false: true; 
  }

  changeConvoy(){

    let vehicles = this.getVehicles()
    .filter( (vehicle:any) => vehicle.idconvoy == this.selectedConvoy )
    .map( (item:any) => {return item.IMEI} );
    this.isConvoySelected = true;
    localStorage.setItem('vahivles-dashboard',JSON.stringify(vehicles));

  }

}
