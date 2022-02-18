import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TreeNode } from 'primeng-lts/api';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

import {DialogModule} from 'primeng-lts/dialog';

import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  @Output() eventDisplayGroup = new EventEmitter<boolean>();

  sortOrder: number=1;
  display: boolean = false;
  displayDelete: boolean = false;
  textDelete: string = "";
  loadingDelete: boolean = false;
  idDelete!: number;
  typeDelete!: string;
  config: any=[];
  vehicles: TreeNode[]=[];
  cols: any[]=[];
  loading: boolean=true;
  buttonDisplay: string="block";
  color: any = {
    10:"green",
    20:"blue",
    30:"purple",
    40:"black",
    50:"orange",
    60:"red",
    100:"green"
  }
  public column: number = 9;
  public setting: any = {
    eye: true,
    imei: false,
    vehicle: true,
    tag: true,
    follow: true,
    limit: true,
    gps: true,
    gsm: true,
    trans: true,
    config: true,
    sort: 'asc'
  }

  @ViewChild('tt') tt!:any;

  constructor(
    private vehicleService:VehicleService,
    private configDropdown: NgbDropdownConfig,
    private vehicleConfigService : VehicleConfigService
  ) {
    configDropdown.placement = 'right-top';
    configDropdown.autoClose = false;
    this.vehicleService.dataTreeCompleted.subscribe(vehicles=>{
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
    });

    this.vehicleService.reloadTableTree.subscribe(res=>{

      if(this.vehicleService.treeTableStatus){
        // console.log('desde tree table ...');
        this.vehicleService.vehiclesTree = this.vehicleService.createNode(this.vehicleService.vehicles);
        this.vehicles = this.vehicleService.vehiclesTree;
      }

    });


  }

  ngOnInit(): void {
    this.vehicleService.treeTableStatus = true;
    console.log("tree on init");
    if(this.vehicleService.statusDataVehicleTree){
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
    }
    this.cols = [
          { field: 'eye', header: 'eye' },
          { field: 'name', header: 'Vehículo' },
          { field: 'activo', header: 'TAG' },
          { field: 'follow', header: 'speed' },
          { field: 'gps', header: 'speed' },
          { field: 'gsm', header: 'speed' },
          { field: 'point_color', header: 'speed' },
          { field: 'activo', header: 'speed' }
      ];
  }

  onChangeDisplay(res : boolean){
    this.display = res;
  }
  showDelete(data: any){
    console.log("data",data);
    this.textDelete = data['type'];
    this.displayDelete = true;
    if(data['id']==null){
      console.log('no hay id');
    }else{
      console.log('en proceso de borrado');
      this.idDelete = data['id'];
      this.typeDelete = data['type'];
    }
  }
  onDelete(){
    this.loadingDelete = true;

    const req = {
      id : this.idDelete,
      vehicles : null
    };
    console.log('borrando ...');
    this.buttonDisplay="none";
    this.vehicleConfigService.putGroupDelete(req).subscribe((info: any)=>{
      console.log('res = ',info);
      this.loadingDelete = false;
      this.buttonDisplay="block";
      if(info.res){
        let aux_vehicles = info.vehicles;
        let aux_vehicles_tree = this.vehicleService.vehicles;
        for (const key in aux_vehicles) {
          for (const j in aux_vehicles_tree) {
            if (aux_vehicles[key]['id']==aux_vehicles_tree[j]['id']) {
              if(this.typeDelete=='grupo'){
                aux_vehicles_tree[j]['idgrupo']=null;
                aux_vehicles_tree[j]['grupo']='Unidades Sin Grupo';
              }else{
                aux_vehicles_tree[j]['idconvoy']=null;
                aux_vehicles_tree[j]['convoy']='Unidades Sin Convoy';
              }

            }
          }
        }
        this.vehicleService.vehicles = aux_vehicles_tree;
        this.vehicleService.reloadTableTree.emit();
        this.textDelete = info.message;
        this.displayDelete = false;
        this.idDelete=-1;
        this.typeDelete='';
      }else{

      }
    });
  }
  onUpdate(res :any){
    const vehicles = this.vehicleService.vehicles;
    // console.log("vehicles socket",vehicles);

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
        this.vehicleService.reloadTableTree.emit(this.vehicleService.vehiclesTree);
      }
    }
    // this.vehicleService.
  }
  onClickConfig(data: any):void{
    // console.log("config...vehicle ",data);
    this.config = data;
    this.display = !this.display;

    // console.log("display-->",this.display);
  }
  ngOnDestroy(): void {
    this.vehicleService.treeTableStatus=false;
  }
  onClickGroup(){
    // this.displayGroup=true;
    this.eventDisplayGroup.emit(true);
    console.log('displaygroup true');
  }
  onClickSetting(e: string):void{
    console.log("clikc setting",e);
    this.setting[e] = !this.setting[e];
    if(this.setting[e]){
      this.column++;
    }else{
      this.column--;
    }
    console.log("colmun = ",this.column);
  }
  onClickEye(IMEI: string){
    this.vehicleService.onClickEye(IMEI);
  }
  onClickIcon(IMEI: string){
    this.vehicleService.onClickIcon(IMEI);
  }
  onSort(data: any){
    // console.log("sort desde tree", data);
    this.sortOrder=data;
  }

  public onQuickFilterChanged(data: any) {
    // console.log("tt",this.tt);
    this.tt.filterGlobal(data.target.value, 'contains')
    this.tt.defaultSortOrder=-1;
  }

}