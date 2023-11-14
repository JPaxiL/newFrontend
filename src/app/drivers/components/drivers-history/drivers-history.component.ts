import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { DriversService } from '../../services/drivers.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-drivers-history',
  templateUrl: './drivers-history.component.html',
  styleUrls: ['./drivers-history.component.scss']
})
export class DriversHistoryComponent implements OnInit {
  listHistory: any = []; // Supongo que esta es tu lista principal de historiales
  filteredHistory: any[] = []; // Lista filtrada que se mostrará en la tabla
  // driverColumns: any[] = []; // Columnas para el historial del conductor
  // vehicleColumns: any[] = []; // Columnas para el historial del vehículo

  listHistoryDrivers : any = [];
  listHistoryVehicles : any = [];

  drivers :any = [];
  vehicles : any = [];
  selectedDriver: any={};
  selectedVehicle: any={};

  activeTable: boolean=false;
  showNoData: boolean=false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,

    public driversService: DriversService,
    public VehicleService : VehicleService,



  ) {}

  ngOnInit(): void {

    if (this.driversService.historyType === 'driver') {
      this.drivers = this.driversService.getTableDataDriver();
    } else if (this.driversService.historyType === 'vehicle') {
      let vehicles = this.VehicleService.getVehiclesData();
      this.getvehicles(vehicles);
    }
    let aux:any = [];
    this.driversService.getHistoryAll().subscribe((data: any[]) => {
      aux = data;
      this.listHistory = aux.data;
      console.log(this.listHistory);
    });

  }

  getvehicles(vehicles: any){
    for (let i = 0; i < vehicles.length; i++) {
      let vh = { nombre: vehicles[i].name ,imei:vehicles[i].IMEI };
      this.vehicles.push(vh);
    }
    console.log('LISTA DE VEHICLES EN HISTORY',this.vehicles);

  }
  onChangeFilter(e:any){
    const selectedValue = e.value;
    let aux:any = [];
    this.filteredHistory = [];
    if (this.driversService.historyType === 'driver') {
      aux = this.listHistory.filter((item: { id_driver: any; }) => item.id_driver === selectedValue);
    } else if (this.driversService.historyType === 'vehicle') {
      aux = this.listHistory.filter((item: { id_imei: any; }) => item.id_imei === selectedValue);
    } else {
        console.log('HISTORY TYPE ES VACÍO', this.driversService.historyType);
    }
    for (const rowHistory of aux) {
      const filteredHistory = {
        id_history: rowHistory.id,
        name_driver: rowHistory.name_driver,
        dni_driver: rowHistory.dni_driver,
        nro_llave: rowHistory.nro_llave ?? '-',
        tracker_imei: rowHistory.id_imei,
        num_placa: rowHistory.num_placa,
        fecha_ini: rowHistory.fecha_ini,
        fecha_fin: rowHistory.fecha_fin ?? 'ACTUALMENTE',
      };
      this.filteredHistory.push(filteredHistory);
    }
    aux.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
    console.log('ESTA ES UNA PRUEBA',this.filteredHistory);
    
    //Para no mostrar nada
    if(this.filteredHistory.length>0){
      this.showNoData = false;
      this.activeTable = true;
      console.log('DATA mayor a 0');
    }else{
      this.activeTable = false;
      this.showNoData = true;
    }
    
  }


}
