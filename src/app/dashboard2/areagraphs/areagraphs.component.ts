import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventService } from 'src/app/events/services/event.service';
import collect from 'collect.js';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DashboardService } from './../service/dashboard.service';

@Component({
  selector: 'app-areagraphs',
  templateUrl: './areagraphs.component.html',
  styleUrls: ['./areagraphs.component.scss']
})
export class AreagraphsComponent implements OnInit {
  public vehicles:any = [];
  group: any = [];
  convoy:any = [];
  rangeDates:Date[] = [new Date(), new Date()];
  imeis:any = [];
  public totalVehicle:number = 0;
  green:number=0;
  imeiGreen:any = [];
  blue:number=0;
  imeiBlue:any= [];
  purple:number=0;
  black:number=0;
  imeiBlack:any = [];
  orange:number=0;
  imeiOrange:any = [];
  red:number=0;
  imeiRed:any = [];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['green', 'blue', 'orange', 'black','red']
  };

  colorSchemeVehiclesOnRoute = {
    domain: ['green', 'blue']
  };

  data:any = [];
  vehiclesOnRoute:any = [];
  dataEvents:any = [];


  constructor(
    private vehicleService : VehicleService,
    private spinner: NgxSpinnerService,
    private eventService: EventService,
    private dashboardService: DashboardService
  ) {

  }


    /*
  sistema de color
  red = corte de transmision por problemas del gps, ... (soporte)
  yellow = vehiculo perdidó transmision,
  purple = vehiculo parado sin transmision,
  blue=  vehiculo parado y transmitiendo en tiempo real;
  green = vehiculo en movimiento y transmitiendo en tiempo real,

  point_color,
  100 = green,
  60 = red,
  50 = orange, -> zona de no covertura
  40 = black, -> sin transmision
  30 = purple,
  20 = blue,
  10 = green -> en movimiento
  */


  async ngOnInit() {
    // await setInterval(() => {

      //  this.getData();
    // }, 180000);
    this.spinner.show("loadingDashboardSpinner");
    this.vehicleService.dataCompleted.subscribe( vehicles => {
      this.vehicles = collect(vehicles).groupBy('grupo');

      this.convoy = _.uniqBy(vehicles, 'convoy');
      this.convoy = this.convoy.map((convoy:any) => {
        return { value:convoy.idconvoy, label:convoy.convoy}
      })
      .filter( (convoy:any) => convoy.label != "Unidades Sin Convoy");

      this.vehicles.map( (vehicle:any, index:any) => {

        this.group.push(
          {
            value:index,
            label:index,
            items: vehicle.items.map(
              (item:any) => {
                this.imeis.push(item.IMEI);
                return {
                  value: item.IMEI,
                  label: item.name
                }
              })
          }
        );
      });

      // let day = new Date();
      // let yesterday = new Date();
      // yesterday.setDate(yesterday.getDate() - 1);

      // this.rangeDates = [yesterday,day];

      this.setGraphData(vehicles);

    });

  }

  async getData(){
    // await this.eventService.initialize();

    let renge_date = this.rangeDates.map(date => date.getDate());

    console.log("this.renge_date =====> ",this.rangeDates, renge_date);

    // this.dashboardService.getData({renge_date:this.rangeDates, imeis: this.imeis});
  }

  async onSelect() {
    await this.dashboardService.getData({renge_date:this.rangeDates, imeis: this.imeis});
  }

  onClickConsultar(){

  }

  setGraphData(vehicles:any){
      this.totalVehicle = vehicles.length;

      vehicles.forEach( (vehicle:any) =>  {
        console.log("vehicle.parameter",vehicle.parametros,vehicle)
        if(vehicle.point_color == 10){
          this.green += 1;
          this.imeiGreen.push(vehicle.name);
        }else if(vehicle.point_color == 20){
          this.blue += 1;
          this.imeiBlue.push(vehicle.name);
        }else if(vehicle.point_color == 30){
          this.purple += 1;
        }else if(vehicle.point_color == 40){
          this.black += 1;
          this.imeiBlack.push(vehicle.name);
        }else if(vehicle.point_color == 50){
          this.orange += 1;
          this.imeiOrange.push(vehicle.name);
        }else if(vehicle.point_color == 60){
          this.red += 1;
          this.imeiRed.push(vehicle.name);
        }else if(vehicle.point_color == 100){
          this.green += 1;
          this.imeiGreen.push(vehicle.name);
        }else{
          this.black += 1;
          this.imeiBlack.push(vehicle.name);
        }
      });

      this.data = [

        {
          "name": "En movimiento",
          "value": this.green
        },
        {
          "name": "Detenidos",
          "value": this.blue
        },
        {
          "name": "Sin cobertura",
          "value": this.orange
        },
          {
          "name": "Sin transmision",
          "value": this.black
        },
        {
          "name": "Corte de transmision",
          "value": this.red
        }
      ];

      this.spinner.hide("loadingDashboardSpinner");
  }

}
