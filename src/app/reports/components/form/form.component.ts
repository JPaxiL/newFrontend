import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../vehicles/services/vehicle.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  reports: any=[];
  selectedReport: any={};
  vehicles: any=[];
  selectedVehicle: any={};
  selectedVehicles: any=[];
  convoys: any=[];
  selectedConvoy: any={};
  groups: any=[];
  selectedgroup: any={};

   selectedValues: string[] = [];

  constructor(private vehicleService: VehicleService) {
    // this.vehicles=this.vehicleService.vehicles;
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.vehicles = vehicles;
    });

    this.reports = [
      {id : 0, value : 'REPORTE DE PARADAS Y MOVIMIENTOS'},
{id : 1, value : 'REPORTE DE EXCESOS DE VELOCIDAD: (Considerar que este reporte debe respetar las geocercas)'},
{id : 2, value : 'REPORTE DE EXCESOS EN ZONA'},
{id : 3, value : 'REPORTE DE ENTRADA Y SALIDA'},
{id : 4, value : 'REPORTE DE COMBUSTIBLE'},
{id : 5, value : 'REPORTE GENERAL'},
{id : 6, value : 'REPORTE DE EVENTOS'},
{id : 7, value : 'REPORTE DE POCISIÓN '},
{id : 8, value : 'REPORTE DE EXCESOS Y TRANSGRESIONES'},
{id : 9, value : 'REPORTE DE COMBUSTIBLE ODOMETRO VIRTUAL'},
{id : 10, value : 'REPORTE DE FRENADA Y ACELERACIÓN BRUSCA (ECO DRIVE)'},
{id : 11, value : 'REPORTE DE DISTRACIÓN'},
{id : 12, value : 'REPORTE DE POSIBLE FATIGA'},
{id : 13, value : 'REPORTE DE FATIGA EXTREMA'},
{id : 14, value : 'REPORTE DE ANTICOLISIÓN FRONTAL'},
{id : 15, value : 'REPORTE DE COLISIÓN CON PEATONES'},
{id : 16, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA HIZQUIERDA'},
{id : 17, value : 'REPORTE DE DESVÍO DE CARRIL HACIA LA DERECHA'},
{id : 18, value : 'REPORTE DE BLOQUEO DE VISIÓN DE MOBILEYE'}
    ];
  }

  ngOnInit(): void {
  }

}
