import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent,  ColumnApi } from 'ag-grid-community';
import { Observable } from 'rxjs';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

import { Vehicle } from '../../models/vehicle';

import { VehicleService } from '../../services/vehicle.service';
import { MapService } from '../../services/map.service';
// import RefData from '../../data/refData';

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
import { TransmissionComponent } from '../../components/transmission/transmission.component';
import { SettingComponent } from '../../components/setting/setting.component';
import { GpsComponent } from '../../components/gps/gps.component';
import { GsmComponent } from '../../components/gsm/gsm.component';
import { TagComponent } from '../../components/tag/tag.component';
import { FollowComponent } from '../../components/follow/follow.component';
import { VehicleHeaderComponent } from '../../components/vehicle-header/vehicle-header.component';

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
  public setting: any = {
    eye: false,
    vehicle: false,
    tag: false,
    follow: false,
    limit: false,
    gps: false,
    gsm: false,
    transmission: false,
    config: false,
    sort: 'asc'
  }


   columnDefs: ColDef[] = [
       { headerName: '', colId:"eye", field: 'eye', cellRendererFramework: EyeComponent, resizable: true, width: 50, minWidth: 40, maxWidth: 90, headerComponentFramework: EyeHeaderComponent},
       { headerName: 'VehículoHide', field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 110, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, hide: true},
       { headerName: 'Vehículo', colId: "vehicle" , field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 110, valueGetter: params=>{return params.data}, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, cellRendererFramework: VehicleComponent, headerComponentFramework: VehicleHeaderComponent },
       { headerName: 'Monstrar Nombre', colId:"tag", field: 'activo', sortable: false, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: TagComponent, headerComponentFramework: TagHeaderComponent },
       { headerName: 'Seguir', colId:"follow", field: 'activo', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: FollowComponent, headerComponentFramework: FollowHeaderComponent },
       { headerName: 'Limite de velocidad', colId:"limit", field: 'speed', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: LimitHeaderComponent },
       { headerName: 'GPS', colId:"gps", field: 'activo', sortable: true, filter: false, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '8px'}, cellRendererFramework: GpsComponent, headerComponentFramework: GpsHeaderComponent },
       { headerName: 'GSM', colId:"gsm", field: 'activo', sortable: true, filter: false, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '8px'}, cellRendererFramework: GsmComponent, headerComponentFramework: GsmHeaderComponent },
       { headerName: 'Estado de transmision', colId:"transmission", field: 'point_color', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: TransmissionComponent, headerComponentFramework: TransmissionHeaderComponent },
       { headerName: 'Configurar', colId:"config", field: 'activo', sortable: true, filter: true, resizable: true, width: 60, minWidth: 33, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: SettingComponent, headerComponentFramework: SettingHeaderComponent }
    ];

   // public rowData: any = RefData.data;
   // rowData: Observable<any[]>;
   public rowData: any;

  constructor(
    private vehicleService: VehicleService,
    private mapService: MapService,
    private config: NgbDropdownConfig
  ) {

    config.placement = 'right-top';
    config.autoClose = false;

    this.vehicleService.drawIconMap.subscribe(e=>{
        this.api.setRowData([]);
        this.api.updateRowData({add:e});
    });

    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.vehicles = vehicles;
      this.api.setRowData([]);
      this.api.updateRowData({add:vehicles});
    });
  }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.vehicleService.statusDataVehicle){
        this.vehicles = this.vehicleService.vehicles;
        this.api.setRowData([]);
        this.api.updateRowData({add:this.vehicleService.vehicles});
      }
    },300);

  }

  public onGridReady(params: GridReadyEvent) {
      this.api = params.api;
      this.columnApi = params.columnApi;
      this.api.sizeColumnsToFit();
  }

  public onQuickFilterChanged($event: any) {
      this.api.setQuickFilter($event.target.value);
  }

  public onClickSetting(e: any){
    console.log("setting",this.setting);
    this.setting[e] = !this.setting[e];
    console.log(this.setting[e]);

    this.columnApi.applyColumnState({
      state: [
        {
          colId: e,
          hide: this.setting[e],
        }
      ],
    });

  }
}
