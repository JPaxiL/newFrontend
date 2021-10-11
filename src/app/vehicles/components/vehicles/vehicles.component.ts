import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent,  ColumnApi } from 'ag-grid-community';

import { Vehicle } from '../../models/vehicle';

import { VehicleService } from '../../services/vehicle.service';
import { MapService } from '../../services/map.service';
import RefData from '../../data/refData';

import { EyeHeaderComponent } from '../../components/eye-header/eye-header.component';
import { TagHeaderComponent } from '../../components/tag-header/tag-header.component';
import { FollowHeaderComponent } from '../../components/follow-header/follow-header.component';
import { LimitHeaderComponent } from '../../components/limit-header/limit-header.component';
import { TransmissionHeaderComponent } from '../../components/transmission-header/transmission-header.component';
import { SettingHeaderComponent } from '../../components/setting-header/setting-header.component';
import { GpsHeaderComponent } from '../../components/gps-header/gps-header.component';
import { GsmHeaderComponent } from '../../components/gsm-header/gsm-header.component';
import { EyeComponent } from '../../components/eye/eye.component';
import { VehicleComponent } from '../../components/vehicle/vehicle.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  public vehicles: Vehicle[] = [];
  private init: boolean = true;
  public rowHeight: number = 38;
  public api: GridApi = new GridApi();
  public columnApi: ColumnApi = new ColumnApi();
  public defaultColDef:any = [];


   columnDefs: ColDef[] = [
       { headerName: '', field: 'active', cellRendererFramework: EyeComponent, resizable: true, width: 60, minWidth: 40, maxWidth: 90, headerComponentFramework: EyeHeaderComponent},
       { headerName: 'VehículohIDE', field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 110, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, hide: true},
       { headerName: 'Vehículo', field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 110, valueGetter: params=>{return params.data}, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, cellRendererFramework: VehicleComponent },
       { headerName: 'Monstrar Nombre', field: 'activo', sortable: false, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: TagHeaderComponent },
       { headerName: 'Seguir', field: 'activo', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: FollowHeaderComponent },
       { headerName: 'Limite de velocidad', field: 'speed', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: LimitHeaderComponent },
       { headerName: 'GPS', field: 'activo', sortable: true, filter: false, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '8px'}, headerComponentFramework: GpsHeaderComponent },
       { headerName: 'GSM', field: 'activo', sortable: true, filter: false, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '8px'}, headerComponentFramework: GsmHeaderComponent },
       { headerName: 'Estado de transmision', field: 'activo', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: TransmissionHeaderComponent },
       { headerName: 'Configurar', field: 'activo', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: SettingHeaderComponent }
    ];

   public rowData: any = RefData.data;
   // public rowData: [];

  constructor(
    private vehicleService: VehicleService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    console.log( "data",this.rowData);
    // this.vehicleService.getVehicles().subscribe(vehicles => {
    //     this.vehicles = vehicles;
    //     this.mapService.sendDataMap(this.vehicles);
    // });
    // this.mapService.sendDataMap(this.vehicles);
    if(this.init){
      this.vehicles = RefData.data; //<---- data demo
      console.log("cargando datos");
      this.init=false;
    }else{
      console.log("datos ya se encuentran cargados");
    }

    this.mapService.changeEye.subscribe(id => {
      this.changeEye(id);
    });
    console.log("On Init");

  }
  private changeEye(id: number) :void {

  }

  public onGridReady(params: GridReadyEvent) {
      this.api = params.api;
      this.columnApi = params.columnApi;
      this.api.sizeColumnsToFit();
  }

  public onQuickFilterChanged($event: any) {
      this.api.setQuickFilter($event.target.value);
  }

  demo(vehicle: Vehicle){
    this.vehicles = this.vehicles.filter(x => x.IMEI == vehicle.IMEI);

  }


}
