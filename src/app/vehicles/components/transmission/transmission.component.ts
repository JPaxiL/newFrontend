import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transmission',
  templateUrl: './transmission.component.html',
  styleUrls: ['./transmission.component.scss']
})
export class TransmissionComponent implements OnInit {

  private params: any;
  public nameColor: string="red";
  private color: any=[];

  // color: string="red";

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

  constructor() {
  }

  ngOnInit(): void {

  }

  agInit(params: any){
    this.params = params;

    if(params.value == 10){
      this.nameColor = "green";
    }else if(params.value == 20){
      this.nameColor = "blue";
    }else if(params.value == 30){
      this.nameColor = "purple";
    }else if(params.value == 40){
      this.nameColor = "black";
    }else if(params.value == 50){
      this.nameColor = "orange";
    }else if(params.value == 60){
      this.nameColor = "red";
    }else if(params.value == 100){
      this.nameColor = "green";
    }else{
      this.nameColor = "black";
    }

  }

}
