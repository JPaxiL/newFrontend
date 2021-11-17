import { Component, OnInit, ViewChild, OnDestroy, Output } from '@angular/core';
import { TreeNode } from 'primeng-lts/api';

import {DialogModule} from 'primeng-lts/dialog';

import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  sortOrder: number=1;
  display: boolean = false;
  config: any=[];
  vehicles: TreeNode[]=[];
  cols: any[]=[];
  loading: boolean=true;
  color: any = {
    10:"green",
    20:"blue",
    30:"purple",
    40:"black",
    50:"orange",
    60:"red",
    100:"green"
  }

  @ViewChild('tt') tt!:any;

  constructor( private vehicleService:VehicleService) {

    this.vehicleService.dataTreeCompleted.subscribe(vehicles=>{
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
    });

    this.vehicleService.reloadTableTree.subscribe(res=>{
      if(this.vehicleService.treeTableStatus){
        this.vehicleService.vehiclesTree = this.vehicleService.createNode(this.vehicleService.vehicles);
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
    // console.log("display = ",this.display);
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
        // this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
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
  onClickSetting(e: string):void{
    // console.log("clikc setting",e);
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
