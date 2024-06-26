import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  params: any;
  public nameColor: string="red";
  public tooltipText: string="Sin señal";

  constructor(private vehicleService: VehicleService,private sanitizer: DomSanitizer,
    private domSanitizer:DomSanitizer ) {
   }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;

    if(params.value.point_color == 10){
      this.nameColor = "#45e845";
      this.tooltipText = 'En movimiento';
    }else if(params.value.point_color == 20){
      this.nameColor = "#2cadf2";
      this.tooltipText = 'Detenido encendido';
    }else if(params.value.point_color == 30){
      this.nameColor = "#b23ccf";
      this.tooltipText = 'Detenido apagado';
    }else if(params.value.point_color == 40){
      this.nameColor = "#000";
      this.tooltipText = 'Sin transmisión';
    }else if(params.value.point_color == 50){
      this.nameColor = "#ffb300";
      this.tooltipText = 'Sin cobertura';
    }else if(params.value.point_color == 60){
      this.nameColor = "#cc1013";
      this.tooltipText = 'GPS sin señal';
    }else if(params.value.point_color == 100){
      this.nameColor = "#ABABAB";
      this.tooltipText = 'No definido';
    }else{
      this.nameColor = "#000";
      this.tooltipText = 'Sin transmisión';
    }
  }
  onClickIcon(){
    console.log(this.params);
    this.vehicleService.onClickIcon(this.params.value.IMEI);
  }

}
