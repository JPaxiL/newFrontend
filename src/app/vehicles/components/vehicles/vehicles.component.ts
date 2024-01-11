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
import { TagDriverHeaderComponent } from '../../components/tag-driver-header/tag-driver-header.component';
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
import { TagDriverComponent } from '../../components/tag-driver/tag-driver.component';
import { FollowComponent } from '../../components/follow/follow.component';
import { VehicleHeaderComponent } from '../../components/vehicle-header/vehicle-header.component';
import { UserTracker } from 'src/app/multiview/models/interfaces';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  public statusTable: boolean = false;
  public vehicles: UserTracker[] = [];
  private init: boolean = true;
  public rowHeight: number = 38;//38
  public api: GridApi = new GridApi();
  public columnApi: ColumnApi = new ColumnApi();
  public defaultColDef:any = [];
  display: boolean = false;
  config: any=[];
  mutationObserver: any;

  vehicleIconState: boolean = true;
  vehicleTransmissionStatus: boolean = true;

  public setting: any = {
    eye: false,
    imei: true,
    vehicle: false,
    tag_driver: true,//HASTA QUE SE IMPLEMENTE DRIVERS
    tag: false,
    follow: false,
    limit: false,
    gps: true,
    gsm: true,
    transmission: false,
    config: false,
    sort: 'asc'
  }
  selectedNameShowVehicle: string='name';
  nameShows: any[] = [
    { label: 'Número placa', value: 'num_plate' },
    { label: 'Código interno', value: 'cod_interno' },
    { label: 'Nombre', value: 'name' }
  ];

  rem_to_px = parseFloat(getComputedStyle(document.documentElement).fontSize);
  panelPaddingLeft = (Number(getComputedStyle(document.documentElement).getPropertyValue('--gl-panel-padding-left').replace('rem', '')) * this.rem_to_px )*0.25; //NO ESTOY SEGURO
  vehicleWidth = 12.1 * this.rem_to_px;

   columnDefs: ColDef[] = [
       { headerName: '', field: '', width: this.panelPaddingLeft, minWidth: this.panelPaddingLeft, maxWidth: this.panelPaddingLeft, suppressAutoSize: true,  },
       { headerName: '', colId:"eye", field: 'eye', cellRendererFramework: EyeComponent, resizable: true, width: 50, minWidth: 50, maxWidth: 50, headerComponentFramework: EyeHeaderComponent},
       { headerName: 'IMEI',  colId: "imei", field: 'IMEI', sortable: true, filter: true, resizable: true, width: 130, minWidth: 100, maxWidth: 140, cellStyle: { 'font-size': '10px', 'text-align': 'left'}, hide: true},
       { headerName: 'VehículoHide', field: 'name', filter: true, suppressMenu: true, width: 150, minWidth: 110, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, hide: true},
       { headerName: 'Vehículo', colId: "vehicle" , field: 'name', filter: true, suppressMenu: true, width: this.vehicleWidth, minWidth: this.vehicleWidth, valueGetter: params=>{return params.data}, sortable: true, resizable: true, cellStyle: { 'font-size': '10px'}, cellRendererFramework: VehicleComponent, headerComponentFramework: VehicleHeaderComponent },
       { headerName: 'Monstrar Conductor', colId:"tag_driver", field: 'tag_driver', sortable: false, filter: true, resizable: true, width: 45, minWidth: 45, maxWidth: 45, hide: true, cellStyle: { 'font-size': '10px'}, cellRendererFramework: TagDriverComponent, headerComponentFramework: TagDriverHeaderComponent },
       { headerName: 'Monstrar Nombre', colId:"tag", field: 'tag', sortable: false, filter: true, resizable: true, width: 45, minWidth: 45, maxWidth: 45, cellStyle: { 'font-size': '10px'}, cellRendererFramework: TagComponent, headerComponentFramework: TagHeaderComponent },
       { headerName: 'Seguir', colId:"follow", field: 'follow', sortable: true, filter: true, resizable: true, width: 45, minWidth: 45, maxWidth: 45, cellStyle: { 'font-size': '10px'}, cellRendererFramework: FollowComponent, headerComponentFramework: FollowHeaderComponent },
       { headerName: 'Limite de velocidad', colId:"limit", sort: 'desc', field: 'speed', sortable: true, filter: true, resizable: true, width: 45, minWidth: 45, maxWidth: 45, cellStyle: { 'font-size': '10px'}, headerComponentFramework: LimitHeaderComponent },
       { headerName: 'GPS', colId:"gps", field: 'activo', sortable: true, filter: false, resizable: true, width: 45, minWidth: 45, maxWidth: 45, cellStyle: { 'font-size': '8px'}, cellRendererFramework: GpsComponent, headerComponentFramework: GpsHeaderComponent, hide: true },
       { headerName: 'GSM', colId:"gsm", field: 'activo', sortable: true, filter: false, resizable: true, width: 45, minWidth: 45, maxWidth: 45, cellStyle: { 'font-size': '8px'}, cellRendererFramework: GsmComponent, headerComponentFramework: GsmHeaderComponent, hide: true },
       { headerName: 'Configurar', colId:"config", field: 'activo', sortable: true, filter: true, resizable: true, width: 45, minWidth: 45, maxWidth: 45, cellStyle: { 'font-size': '10px'}, cellRendererFramework: SettingComponent, headerComponentFramework: SettingHeaderComponent }
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
    configDropdown.autoClose = 'outside';

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
    //this.onVehicleIcon();
    var observerTarget = document.querySelector('#dragbar')!;
    this.mutationObserver = new MutationObserver( mutationList => {
        mutationList.forEach( mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if(!document.querySelector('#dragbar')?.classList.contains('dragging')){
              this.api.sizeColumnsToFit();
            }
          }
        });
      });
    var config = { attributes: true };
    this.mutationObserver.observe(observerTarget, config);
  }

  ngOnDestroy(): void {
    //console.log("destroy component table...");
    this.statusTable=false;
    this.mutationObserver.disconnect();
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
    this.api.sizeColumnsToFit();

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

  onChangeSelection(show_name:string){
    // console.log('Vehicles List:',this.vehicles);
    const vehicles = this.vehicleService.vehicles;
    let tempShowName = '';
    for (const index of vehicles) {
      if(show_name=='num_plate'){
        tempShowName = index.plate_number!;
      }else if (show_name=='cod_interno'){
        tempShowName = index.cod_interno!;
      }else if (show_name =='name'){
        tempShowName = index.name_old!;
      }
      if (!tempShowName){
        // Busca el valor correspondiente en nameShows basado en selectedNameShowVehicle
        const selectedOption = this.nameShows.find(option => option.value === this.selectedNameShowVehicle);
        // Verifica si se encontró una opción correspondiente
        if (selectedOption) {
          tempShowName = "Unidad Sin " + selectedOption.label;
        } else {
          tempShowName = "Unidad Sin Nombre";
        }
      }
      index.name= tempShowName;
    }
    if(this.vehicleService.listTable==0){
      this.vehicleService.reloadTable.emit();
    }else{
      this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
      this.vehicleService.reloadTableTree.emit();
    }
    this.vehicleService.onClickSelection(show_name);
  }

  // Cambio de vista
  onTableGroup(){
    this.vehicleService.listTable=1;
    this.vehicleService.clickListTable.emit(1);
  }

  onTableGeneral(){
    this.vehicleService.listTable=0;
    this.vehicleService.clickListTable.emit(0);
  }

  onTableTransmision(){
    
  }

  onVehicleIcon(){
    if(this.vehicleIconState){
      $('.ag-body-viewport').addClass('show-vehicle-icon');
    } else {
      $('.ag-body-viewport').removeClass('show-vehicle-icon');
    }
    this.vehicleIconState = !this.vehicleIconState;
  }
  // onVehicleTransmissionStatus(){
  //   if(this.vehicleTransmissionStatus){
  //     $('.ag-body-viewport2').addClass('show-vehicle-statusTransmission');
  //   } else {
  //     $('.ag-body-viewport2').removeClass('show-vehicle-statusTransmission');
  //   }
  //   this.vehicleTransmissionStatus = !this.vehicleTransmissionStatus;
  // }
}
