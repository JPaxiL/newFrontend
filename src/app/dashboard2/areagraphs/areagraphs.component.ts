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

  isUnderConstruction: boolean = true;

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

  horizontalChart: any = [];
  viewHorizontalChart = [700, 100];
  in_service = 0;
  without_programming = 0;
  total = 0;
  in_service_percentage = 0;
  without_programming_percentage = 0;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['green', 'blue', 'orange', 'black','red']
  };

  colorSchemeHorizontalChart = {
    domain: ['blue', 'gray'],
  };

  colorSchemeVehiclesOnRoute = {
    domain: ['green', 'blue']
  };

  data:any = [];
  vehiclesOnRoute:any = [];
  dataEvents:any = [];

  infraction:any = [];
  gpsEvents:any = [];
  countgpsEvents:any = {};
  vehicleSafetyEvents:any = [];


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


  ngOnInit():void {
    if(!this.isUnderConstruction){
      this.spinner.show("loadingDashboardSpinner");
      this.load();
    }
    // setInterval(() => {

    //    this.load();
    //    console.log(" this.load()");
    // }, 180000);
    // this.load();
  }

  load(){
    let imeis = JSON.parse(localStorage.getItem('vahivles-dashboard')!);

    this.getEvents(imeis);

    this.vehicleService.dataCompleted.subscribe((vehicles) => {
      this.vehicles = vehicles.filter((vehicle: any) => {
        return imeis.includes(vehicle.IMEI);
      });

      this.setGraphData(this.vehicles);
    });
  }

  setGraphData(vehicles:any){
    this.totalVehicle = vehicles.length;

    vehicles.forEach((vehicle: any) => {
      if (vehicle.point_color == 10) {
        this.green += 1;
        this.imeiGreen.push(vehicle.name);
      } else if (vehicle.point_color == 20) {
        this.blue += 1;
        this.imeiBlue.push(vehicle.name);
      } else if (vehicle.point_color == 30) {
        this.purple += 1;
      } else if (vehicle.point_color == 40) {
        this.black += 1;
        this.imeiBlack.push(vehicle.name);
      } else if (vehicle.point_color == 50) {
        this.orange += 1;
        this.imeiOrange.push(vehicle.name);
      } else if (vehicle.point_color == 60) {
        this.red += 1;
        this.imeiRed.push(vehicle.name);
      } else if (vehicle.point_color == 100) {
        this.green += 1;
        this.imeiGreen.push(vehicle.name);
      } else {
        this.black += 1;
        this.imeiBlack.push(vehicle.name);
      }
    });

    this.data = [
      {
        name: 'En movimiento',
        value: this.green,
      },
      {
        name: 'Detenidos',
        value: this.blue,
      },
      {
        name: 'Sin cobertura',
        value: this.orange,
      },
      {
        name: 'Sin transmision',
        value: this.black,
      },
      {
        name: 'Corte de transmision',
        value: this.red,
      },
    ];

    this.setHorizontalChart();

    this.spinner.hide('loadingDashboardSpinner');
  }

  setHorizontalChart() {
    this.in_service = this.green;
    this.data.forEach((item: any) => {
      if (item.name != 'En movimiento') {
        this.without_programming += item.value;
      }
      this.total += item.value;
    });

    this.in_service_percentage = Math.round(
      (this.in_service * 100) / this.total
    );
    this.without_programming_percentage = Math.round(
      (this.without_programming * 100) / this.total
    );

    this.horizontalChart = [
      {
        name: '',
        series: [
          {
            name: 'En servicio',
            value: this.in_service,
          },
          {
            name: 'Sin programación',
            value: this.without_programming,
          },
        ],
      },
    ];
  }

  async getEvents(imeis: any){

    this.dataEvents =  await this.eventService.getEventsByImeis(imeis);

    this.dataEvents.forEach((event:any) => {
      if(event.descripcion_evento === "Infracción" || event.descripcion_evento === "Infraccion"){
        this.infraction.push(event);
      }

      if(event.tipo_alerta === 'gps'){
        this.gpsEvents.push(event);
      }

      if(event.tipo_alerta === 'accessories'){
        this.vehicleSafetyEvents.push(event);
      }

    });


    this.infraction = collect(this.infraction)
    .groupBy('nombre_objeto')
    .map( (items:any, index:any) => {
      return {
        'name':index,
        'amount':items.items.length,
        'higher_speed': collect(items.items).max('velocidad')
      };
    })
    .toArray();

    this.gpsEvents.forEach( (event:any) => {
        if(event.tipo_evento == 'Bateria desconectada'){
          this.countgpsEvents.batteryDisconnected += 1;
        }

        if(event.tipo_evento == 'Motor apagado'){
          this.countgpsEvents.engineoff += 1;
        }

    });


    this.countgpsEvents = collect(this.gpsEvents).countBy((event:any) => event.tipo_evento.toLowerCase().replace(/ /g, "_")).all();

    console.log("this.vehicleSafetyEvents  =========> ", this.vehicleSafetyEvents);
    console.log("this.gpsEvents  =========> ", this.gpsEvents,this.countgpsEvents);

    console.log("const counted = collection.countBy(email => email.split('@')[1]);",this.rangeDates);

  }

}
