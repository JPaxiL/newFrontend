import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TreeNode } from 'primeng-lts/api';

import {DialogModule} from 'primeng-lts/dialog';

import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  display: boolean = false;
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
      // this.vehicles = vehicles;
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
      // console.log("vehicles map",this.vehicles);
    });

    this.vehicleService.reloadTableTree.subscribe(res=>{
      if(this.vehicleService.treeTableStatus){
        this.vehicleService.vehiclesTree = this.vehicleService.createNode(this.vehicleService.vehicles);
      }

    });


  }

  // confirm() {
  //      this.confirmationService.confirm({
  //          message: 'Are you sure that you want to perform this action?',
  //          accept: () => {
  //              //Actual logic to perform a confirmation
  //          }
  //      });
  //  }

  ngOnInit(): void {
    this.vehicleService.treeTableStatus = true;
    console.log("tree on init");
    if(this.vehicleService.statusDataVehicleTree){
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
      // this.vehicles = this.vehicleService.vehicles;
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
  onClickConfig(data: any):void{
    console.log("config...vehicle ",data);
    this.display = true;
    // this.confirm();
  }
  onClickCancel(){
    this.display = false;
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

  // createNode(data: any): any{
  //   console.log("create node");
  //   //variables de inicio
  //
  //   //identificando grupos
  //   let map: any=[];
  //   let groups: any = [];
  //   let convoys: any = [];
  //   let status_group = false;
  //   let status_convoy = false;
  //   let prueba = [];
  //
  //   for(const index in data){
  //     if(groups.includes(data[index]['grupo'])){
  //     }else{
  //       groups.push(data[index]['grupo']);
  //       status_group= true;
  //     }
  //     if(convoys.includes(data[index]['convoy'])){
  //     }else{
  //       convoys.push(data[index]['convoy']);
  //       status_convoy= true;
  //     }
  //
  //     // posibilidades
  //     // 1 1
  //     // 0 1
  //     // 1 0
  //     // 0 0
  //     if(status_group&&status_convoy){
  //       prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
  //       map.push(
  //         {
  //           data:{name: data[index]['grupo'], col:3},
  //           expanded: true,
  //           children:[
  //             {
  //               data:{name:data[index]['convoy'], col:3},
  //               expanded: true,
  //               children: [
  //                 {
  //                   data:data[index]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       );
  //
  //     }else if(!status_group&&status_convoy){
  //       prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
  //       //recuperar el id del grupo
  //       let index_group = groups.indexOf(data[index]["grupo"]);
  //       //reucperar id del convoy
  //       // let index_convoy = map[index_group]['children']['data']
  //       map[index_group]['children'].push(
  //         {
  //           data : {name: data[index]['convoy'], col: 3},
  //           expanded: true,
  //           children: [
  //             {
  //               data:data[index]
  //             }
  //           ]
  //         }
  //       );
  //       // console.log("index_group",index_group)
  //       // map[data]
  //     }else if(status_group&&!status_convoy){//igual que el caso 1 1
  //       prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
  //       // console.log("data[index]['convoy']",data[index]['convoy']);
  //       map.push(
  //         {
  //           data:{name: data[index]['grupo'], col: 3},
  //           expanded: true,
  //           children:[
  //             {
  //               data:{name: data[index]['convoy'], col: 3},
  //               expanded: true,
  //               children: [
  //                 {
  //                   data:data[index]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       );
  //     }else if(!status_group&&!status_convoy){
  //       prueba.push(data[index]['grupo']+"--"+data[index]['convoy']);
  //       //recuperar el id del grupo
  //       let index_group = groups.indexOf(data[index]["grupo"]);
  //       //recuperar el id del convoy dentro del grupo
  //       // let index_convoy = map[index_group]['children']['data']
  //
  //       // console.log("mar de opciones", map[index_group]['children'].indexOf({data:{name:"GRUPO LINARES"}}));
  //       // console.log("mar de opciones", map[index_group]['children']);
  //       let e = map[index_group]['children'];
  //       let b = {data:{name:data[index]['convoy']}};
  //       // console.log("index-->",e.indexOf(b));
  //       let aux_index: string = "0";
  //       for(const i in e){
  //         // console.log("convoy",e[i]['data']['name'])
  //         if(e[i]['data']['name']==data[index]['convoy']){
  //           // console.log("exito en "+data[index]["grupo"]+"/"+data[index]['convoy']+" -->",i);
  //           aux_index = i;
  //         }
  //       }
  //       // console.log("aux_index",aux_index);
  //       map[index_group]['children'][aux_index]["children"].push({
  //         data:data[index]
  //       });
  //     }
  //     status_group=false;
  //     status_convoy=false;
  //
  //   }
  //   // console.log("groups",groups);
  //   // console.log("convoys",convoys);
  //   // console.log("map",map);
  //   // console.log("prueba",prueba);
  //
  //
  //   return map;
  // }

}
