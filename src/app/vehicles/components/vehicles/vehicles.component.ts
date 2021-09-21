import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {


  vehicles:any={};

  constructor(private vehicleService:VehicleService) { }

  ngOnInit(): void {
    this.vehicleService.getVehicles().subscribe(vehicles=>{
        this.vehicles = vehicles;
    });
    console.log(this.vehicles);
    console.log("modulo vehiculo iniciado");

  };
  onClick():void{
    // console.log("Escuchando evento");
    // this.vehicleService.getSession().subscribe(vehicles=>{
    //   console.log(vehicles);
    //     // this.vehicles = vehicles;
    // });
  };





}
