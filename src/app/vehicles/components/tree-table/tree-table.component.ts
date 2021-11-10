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

  onClickCancel(res : number){
    this.display = !this.display;
    console.log("display = ",this.display);
  }
  onClickConfig(data: any):void{
    console.log("config...vehicle ",data);
    this.config = data;
    this.display = !this.display;
    console.log("display-->",this.display);
  }
  ngOnDestroy(): void {
    this.vehicleService.treeTableStatus=false;
  }
  onClickSetting(e: string):void{
    console.log("clikc setting",e);
  }
  onClickEye(IMEI: string){
    this.vehicleService.onClickEye(IMEI);
  }
  onClickIcon(IMEI: string){
    this.vehicleService.onClickIcon(IMEI);
  }

  public onQuickFilterChanged(data: any) {
    this.tt.filterGlobal(data.target.value, 'contains')
  }

}
