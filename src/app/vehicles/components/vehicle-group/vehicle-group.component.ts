import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';

import {ConfirmationService} from 'primeng-lts/api';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';

@Component({
  selector: 'app-vehicle-group',
  templateUrl: './vehicle-group.component.html',
  styleUrls: ['./vehicle-group.component.scss']
})
export class VehicleGroupComponent implements OnInit {

  @Input('display') display: boolean = false;

  @Output() onHideEvent = new EventEmitter<boolean>();

  @ViewChild('name',{ static:true}) name!: ElementRef;
  @ViewChild('description',{ static:true}) description!: ElementRef;

  stateOptions: any[];
  selectedValue: string="";
  value1: string = "grupo";
  paymentOptions: any[];
  multiple: boolean = true;
  value2: number = 1;

  //option: string="nada";
  option: string="grupo";

  selectedCategory: any = null;

  categories: any[] = [{name: 'Accounting', key: 'A'}, {name: 'Marketing', key: 'M'}, {name: 'Production', key: 'P'}, {name: 'Research', key: 'R'}];

  sourceProducts: any=[];

      targetProducts: any=[];

  loading : boolean = false;
  list1: any=[];
  selectedList1: any=[];
  list2: any=[];
  selectedList2: any=[];
  groups: any=[];
  selectedGroup: any={};
  nameTarget: string = "";
  descriptionTarget: string = "";

  constructor(
    private vehicleService: VehicleService,
    private configService: VehicleConfigService,
    private confirmationService: ConfirmationService
  ) {

    this.stateOptions = [
     { label: "Grupo", value: "grupo" },
     { label: "Convoy", value: "convoy" }
   ];
   this.paymentOptions = [
     { name: "Option 1", value: 1 },
     { name: "Option 2", value: 2 },
     { name: "Option 3", value: 3 }
   ];
  }

  ngOnInit(): void {
    this.onOption(this.option);
  }

  onHide(){
    // //console.log('on hide...');
    this.onHideEvent.emit(false);
  }
  onOption(e : string){
    console.log("option XD");

    this.list1 = [];
    this.list2 = [];
    // //console.log('option...',e);
    // //console.log('vehicles',this.vehicleService.vehicles);
    // //console.log('vehiclestree',this.vehicleService.vehiclesTree);
    if(e=='grupo'){
      this.list1 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.grupo=="Unidades Sin Grupo");

    }else{
      //getGroup
      this.selectedGroup = {};
      console.log('es convoy');
      let aux = [];
      let aux2 =[];
      let vehicles = this.vehicleService.vehicles;
      //console.log('vehicles = ',vehicles);

      for (const key in vehicles){
      //console.log("search = ",aux2.indexOf(vehicles[key]['grupo']));
        if(aux2.indexOf(vehicles[key]['grupo'])==-1&&vehicles[key]['grupo']!='Unidades Sin Grupo'){
          aux2.push(vehicles[key]['grupo']);
          aux.push(vehicles[key]);
        }
        //console.log("key",key);
        //console.log("vehicles[key]['grupo'] / ",vehicles[key]['grupo']);
        
        
      }
      //console.log(aux2);
      this.groups = aux;

      this.list1 = [];
    }
  }
  onChangeGroup(){
    // //console.log('cambio de grupo',this.selectedGroup);
    // enviar todas las unidades del grupo seleccionado
    let vehicles = this.vehicleService.vehicles;
    let aux = [];
    for (const key in vehicles) {
      if (vehicles[key]['idgrupo']==this.selectedGroup&&vehicles[key]['convoy']=='Unidades Sin Convoy') {
        aux.push(vehicles[key]);
      }
    }
    this.list1 = aux;
  }
  onName(data: any){
    this.nameTarget = data.target.value;
  }
  onDescription(data: any){
    this.descriptionTarget = data.target.value;
  }
  upList1(){
    // this.list1=this.selectedList2;
    // this.selectedList2=[];
    let aux: any=[];

    //recupero valores upList2
    for (const key in this.list1) {
      aux.push(this.list1[key]);
    }
    // inserto valores nuevos
    // //console.log('subir a lista 2');
    for (const key in this.selectedList2) {
      // let index = aux.indexOf(this.selectedList2[key]);
      // //console.log("index====",index);
      aux.push(this.selectedList2[key]);
      //console.log(this.selectedList2[key]);
    }
    //inserto valores en list1
    this.list1 = aux;
    //vacio valores de list 2
    let aux2: any = [];
    let aux_status = false;
    for (const key in this.list2) {
      let aux_status=false;
      for (const key2 in this.selectedList2) {
        if (this.list2[key]==this.selectedList2[key2]) {
          aux_status=true;
        }
      }
      if(!aux_status){
        aux2.push(this.list2[key]);
      }
    }
    this.list2 = aux2;
    this.selectedList2=[];
  }
  upList2(){
    // this.list2=this.selectedList1;
    // this.selectedList1=[];
    let aux: any=[];

    //recupero valores upList2
    for (const key in this.list2) {
      aux.push(this.list2[key]);
    }
    // inserto valores nuevos
    // //console.log('subir a lista 2');
    for (const key in this.selectedList1) {
      // let index = aux.indexOf(this.selectedList1[key]);
      // //console.log("index====",index);
      aux.push(this.selectedList1[key]);
      //console.log(this.selectedList1[key]);
    }
    //inserto valores en list2
    this.list2 = aux;
    //vacio valores de list 1
    let aux2: any = [];
    let aux_status = false;
    for (const key in this.list1) {
      let aux_status=false;
      for (const key2 in this.selectedList1) {
        if (this.list1[key]==this.selectedList1[key2]) {
          aux_status=true;
        }
      }
      if(!aux_status){
        aux2.push(this.list1[key]);
      }
    }
    this.list1 = aux2;
    this.selectedList1=[];
  }
  onSubmit(){
    //this.name, this.description
    // const
    /*
    req = {
        vehicles : [...],

          name : "...",
          description : ".."

      }
    */
    let req = {};

    if(this.option=='grupo'){
      req = {
        vehicles : this.list2,
        name : this.nameTarget,
        description : this.descriptionTarget
        // }
      };
    }else if(this.option=='convoy'){
      req = {
        vehicles : this.list2,
        name : this.nameTarget,
        description : this.descriptionTarget,
        grupo_convoy_id : this.selectedGroup
      };
    }
    // const req = {
    //   vehicles : this.list2,
    //   name : this.name.nativeElement.value,
    //   description : this.description.nativeElement.value
    //   // }
    // };

    // //console.log("submit",req);
    // //console.log("dat enviada",req);

    this.loading=true;
    if(this.vehicleService.demo){
      //console.log('demoo');
      const info = {
        data:{
          id:this.vehicleService.demo_id,
          nombre:this.nameTarget

        }
      }
      this.addGroup(info);
      this.vehicleService.demo_id++;
    }else{
      this.configService.postGroup(req).subscribe((info:any) => {
        //console.log("post group res =",info);
        if(info.res){
          this.addGroup(info);
          this.selectedGroup = {};
          // const vehicles = this.vehicleService.vehicles;
          // for (const key in this.list2) {
          //   const index = vehicles.indexOf(this.list2[key])
          //   // //console.log('index',index);
          //   if(this.option=='convoy'){
          //     vehicles[index].idconvoy=info.data['id'];
          //     vehicles[index].convoy=info.data['nombre'];
          //
          //   }else{
          //     vehicles[index].idgrupo=info.data['id'];
          //     vehicles[index].grupo=info.data['nombre'];
          //
          //   }
          //   // //console.log('vehicles index',vehicles[index])
          // }
          // this.vehicleService.vehicles = vehicles;
          // // //console.log('new vehicles',vehicles);
          // //reload talbe
          // if(this.vehicleService.listTable==0){
          //   this.vehicleService.reloadTable.emit();
          // }else{
          //   this.vehicleService.reloadTableTree.emit();
          // }
          // this.onHideEvent.emit(false);
          // //update data local
          // //mensaje de exito
          // // this.eventUpdate.emit(this.vehicle);
          // // this.eventDisplay.emit(false);
          // this.loading=false;
          // this.list2=[];
        }else{
          this.loading=false;
          //mensaje de error
        }
      });

    }
  }
  addGroup(info: any){
    // //console.log('addgroup info =',info);
    const vehicles = this.vehicleService.vehicles;
    for (const key in this.list2) {
      const index = vehicles.indexOf(this.list2[key])
      // //console.log('index',index);
      if(this.option=='convoy'){
        vehicles[index].idconvoy=info.data['id'];
        vehicles[index].convoy=info.data['nombre'];

      }else{
        vehicles[index].idgrupo=info.data['id'];
        vehicles[index].grupo=info.data['nombre'];

      }
      // //console.log('vehicles index',vehicles[index])
    }
    this.vehicleService.vehicles = vehicles;
    // //console.log('new vehicles',vehicles);
    //reload talbe
    if(this.vehicleService.listTable==0){
      this.vehicleService.reloadTable.emit();
    }else{
      this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
      this.vehicleService.reloadTableTree.emit();
    }
    this.onHideEvent.emit(false);
    //update data local
    //mensaje de exito
    // this.eventUpdate.emit(this.vehicle);
    // this.eventDisplay.emit(false);
    this.loading=false;
    this.list2=[];
    //this.option = "nada";
    this.option = "grupo";
    this.name.nativeElement.value = "";
    this.description.nativeElement.value = "";

  }
  onShow(){
    // //console.log("on show");
    // this.list1 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.grupo=="Unidades Sin Grupo");

  }
  onConfirmGroup(){
    this.confirmationService.confirm({
             message: 'Se aplicarán los cambios',
            accept: () => {
                //Actual logic to perform a confirmation
                // //console.log("aceptadoo ....");
                this.onSubmit();
            }
        });
  }

}
