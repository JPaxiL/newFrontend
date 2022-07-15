import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-areagraphs',
  templateUrl: './areagraphs.component.html',
  styleUrls: ['./areagraphs.component.scss']
})
export class AreagraphsComponent implements OnInit {
  vehicles:any = [];
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

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['green', 'blue', 'orange', 'black','red']
  };

  data:any = [];


  constructor(
    private vehicleService : VehicleService,
    private spinner: NgxSpinnerService
  ) { }


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
       this.getData();
    // }, 180000);
    this.spinner.show("loadingDashboardSpinner");
  }

  async getData(){
    console.log("dllñsmdlmasd");
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.totalVehicle = vehicles.length;

      console.log("vehicles.length =====> ", vehicles.length);
      vehicles.forEach( (vehicle:any) =>  {
        if(vehicle.point_color == 10){
          this.green += 1;
          this.imeiGreen.push(vehicle.IMEI);
        }else if(vehicle.point_color == 20){
          this.blue += 1;
          this.imeiBlue.push(vehicle.IMEI);
        }else if(vehicle.point_color == 30){
          this.purple += 1;
        }else if(vehicle.point_color == 40){
          this.black += 1;
          this.imeiBlack.push(vehicle.IMEI);
        }else if(vehicle.point_color == 50){
          this.orange += 1;
          this.imeiOrange.push(vehicle.IMEI);
        }else if(vehicle.point_color == 60){
          this.red += 1;
        }else if(vehicle.point_color == 100){
          this.green += 1;
          this.imeiGreen.push(vehicle.IMEI);
        }else{
          this.black += 1;
          this.imeiBlack.push(vehicle.IMEI);
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
      console.log("this.imeiGreen =====> ", this.imeiGreen)
    });
  }

}
