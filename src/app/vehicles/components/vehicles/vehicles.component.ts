import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent,  ColumnApi } from 'ag-grid-community';
import { Observable } from 'rxjs';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

import { Vehicle } from '../../models/vehicle';

import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';
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

  public statusTable: boolean = false;
  public vehicles: Vehicle[] = [];
  private init: boolean = true;
  public rowHeight: number = 38;//38
  public api: GridApi = new GridApi();
  public columnApi: ColumnApi = new ColumnApi();
  public defaultColDef:any = [];
  display: boolean = false;
  config: any=[];

  public setting: any = {
    eye: false,
    imei: true,
    vehicle: false,
    tag: false,
    follow: false,
    limit: false,
    gps: true,
    gsm: true,
    transmission: false,
    config: false,
    sort: 'asc'
  }


   columnDefs: ColDef[] = [
       { headerName: '', colId:"eye", field: 'eye', cellRendererFramework: EyeComponent, resizable: true, width: 50, minWidth: 50, maxWidth: 50, headerComponentFramework: EyeHeaderComponent},
       { headerName: 'IMEI',  colId: "imei", field: 'IMEI', sortable: true, filter: true, resizable: true, width: 130, minWidth: 100, maxWidth: 140, cellStyle: { 'font-size': '10px', 'text-align': 'left'}, hide: true},
       { headerName: 'VehículoHide', field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 110, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, hide: true},
       { headerName: 'Vehículo', colId: "vehicle" , field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 140, valueGetter: params=>{return params.data}, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, cellRendererFramework: VehicleComponent, headerComponentFramework: VehicleHeaderComponent },
       { headerName: 'Monstrar Nombre', colId:"tag", field: 'activo', sortable: false, filter: true, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: TagComponent, headerComponentFramework: TagHeaderComponent },
       { headerName: 'Seguir', colId:"follow", field: 'follow', sortable: true, filter: true, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: FollowComponent, headerComponentFramework: FollowHeaderComponent },
       { headerName: 'Limite de velocidad', colId:"limit", sort: 'desc', field: 'speed', sortable: true, filter: true, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '10px'}, headerComponentFramework: LimitHeaderComponent },
       { headerName: 'GPS', colId:"gps", field: 'activo', sortable: true, filter: false, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '8px'}, cellRendererFramework: GpsComponent, headerComponentFramework: GpsHeaderComponent, hide: true },
       { headerName: 'GSM', colId:"gsm", field: 'activo', sortable: true, filter: false, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '8px'}, cellRendererFramework: GsmComponent, headerComponentFramework: GsmHeaderComponent, hide: true },
       { headerName: 'Estado de transmision', colId:"transmission", field: 'point_color', sortable: true, filter: true, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: TransmissionComponent, headerComponentFramework: TransmissionHeaderComponent },
       { headerName: 'Configurar', colId:"config", field: 'activo', sortable: true, filter: true, resizable: true, width: 50, minWidth: 50, maxWidth: 90, cellStyle: { 'font-size': '10px'}, cellRendererFramework: SettingComponent, headerComponentFramework: SettingHeaderComponent }
    ];

   // public rowData: any = RefData.data;
   // rowData: Observable<any[]>;
   public rowData: any;

  constructor(
    private vehicleService: VehicleService,
    private vehicleConfigService: VehicleConfigService,
    private mapService: MapService,
    private configDropdown: NgbDropdownConfig
  ) {

    configDropdown.placement = 'right-top';
    configDropdown.autoClose = false;

    this.vehicleConfigService.displayOn.subscribe(e=>{
      // //console.log("desde vehicles..");
      this.config=e;
      this.display = true;
    });

    this.vehicleService.drawIconMap.subscribe(e=>{
        this.api.setRowData([]);
        this.api.updateRowData({add:e});
    });

    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.vehicles = vehicles;
      this.dataLoading();
    });
    this.vehicleService.reloadTable.subscribe(res=>{
      const vehicles = this.vehicleService.vehicles;
      if(this.vehicleService.listTable==0&&this.statusTable){
        // //console.log("this api asing reloading ...");
        this.api.applyTransactionAsync({ update: vehicles }, this.resultCallback);
      }
    });
    this.vehicleService.sortLimit.subscribe(res=>{
      // this.
      // this.api = params.api;
      // this.columnApi = params.columnApi;
      // sort: 'asc'
      //console.log("desde vehicles coponent");
      this.columnApi.applyColumnState({
          state: [
              {
                  colId: 'limit',
                  sort: 'desc'
              }
          ]
      });
    });
  }

  ngAfterViewInit(): void {
    //console.log("ngAfterViewInit table ag GRIDstatus table = ",this.statusTable);

  }
  ngOnInit(): void {
    //console.log("ngOnInit table ag GRID status table = ",this.statusTable);
    var observerTarget = document.querySelector('#dragbar')!;
    var mutationObserver = new MutationObserver( mutationList => {
        mutationList.forEach( mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if(!document.querySelector('#dragbar')?.classList.contains('dragging')){
              this.api.sizeColumnsToFit();
            }
          }
        });
      });
    var config = { attributes: true };
    mutationObserver.observe(observerTarget, config);
  }

  ngOnDestroy(): void {
    //console.log("destroy component table...");
    this.statusTable=false;
     // this.vehicleService.reloadTable.unsubscribe();
  }
  onChangeDisplay(res : boolean){
    this.display = res;
  }
  onUpdate(res :any){
    const vehicles = this.vehicleService.vehicles;
    // //console.log("vehicles socket",vehicles);

    const resultado = vehicles.find( (vehi: any) => vehi.IMEI == res.IMEI.toString() );
    if(resultado){
      const index = vehicles.indexOf( resultado);

      vehicles[index].id_conductor = res.id_conductor;
      vehicles[index].idgrupo = res.idgrupo;
      vehicles[index].name  = res.name;
      vehicles[index].model = res.model;
      vehicles[index].sim_number  = res.sim_number;
      vehicles[index].plate_number  = res.plate_number;
      vehicles[index].tolva  = res.tolva;
      vehicles[index].empresa  = res.empresa;
      vehicles[index].tipo  = res.tipo;
      vehicles[index].icon  = res.icon;

      this.vehicleService.vehicles = vehicles;

      //reload talbe
      if(this.vehicleService.listTable==0){
        this.vehicleService.reloadTable.emit();
      }else{
        // this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
        this.vehicleService.reloadTableTree.emit(this.vehicleService.vehiclesTree);
      }
    }
  }

  public dataLoading(){
    this.vehicles = this.vehicleService.vehicles;
    this.api.setRowData([]);
    this.api.updateRowData({add:this.vehicleService.vehicles});
    this.statusTable=true;

    // this.vehicleService.reloadTable.subscribe(res=>{
    //   const vehicles = this.vehicleService.vehicles;
    //   if(this.vehicleService.listTable==0&&this.statusTable){
    //     // //console.log("this api asing reloading ...this.vehicleService.listTable / status table ",this.vehicleService.listTable+" / "+this.statusTable);
    //     this.api.applyTransactionAsync({ update: vehicles }, this.resultCallback);
    //   }
    // });
  }

  public resultCallback () {
      // //console.log('transactionApplied() - ');
  }
  public onGridReady(params: GridReadyEvent) {
      this.api = params.api;
      this.columnApi = params.columnApi;
      this.api.sizeColumnsToFit();
      //console.log("onGridReady ....");
      this.statusTable=true;
      this.dataLoading();
  }

  public onQuickFilterChanged($event: any) {
      this.api.setQuickFilter($event.target.value);
  }

  public onClickSetting(e: any){
    //console.log("setting",this.setting);
    this.setting[e] = !this.setting[e];
    //console.log(this.setting[e]);

    this.columnApi.applyColumnState({
      state: [
        {
          colId: e,
          hide: this.setting[e],
        }
      ],
    });
    this.api.sizeColumnsToFit();
  }
}
