import { data } from 'jquery';
import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';
import Swal from 'sweetalert2';
import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { UserTracker } from 'src/app/multiview/models/interfaces';

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
  value1: string = "operacion";
  paymentOptions: any[];
  multiple: boolean = true;
  value2: number = 1;

  //option: string="nada";
  option: string="operacion";

  selectedCategory: any = null;

  categories: any[] = [{name: 'Accounting', key: 'A'}, {name: 'Marketing', key: 'M'}, {name: 'Production', key: 'P'}, {name: 'Research', key: 'R'}];

  sourceProducts: any=[];

      targetProducts: any=[];

  loading : boolean = false;
  list1: any=[];
  selectedList1: any=[];
  list2: any=[];
  selectedList2: any=[];
  operations: any=[];
  groups: any=[];
  placeholder_groups: any=[];
  selectedOperation: any={};
  selectedGroup: any={};
  nameTarget: string = "";
  descriptionTarget: string = "";
  isFormName: boolean = false; //para validar NameObligatorio en Operacion/Grupo/Convoy
  isExistNameByType: boolean = false; //para validar NameExistente en Operacion/Grupo/Convoy
  listVehiclesEmpty: boolean = false; //para validar si el array de list2 esta vacio en la creacion


  constructor(
    private vehicleService: VehicleService,
    private configService: VehicleConfigService,
  ) {

    this.stateOptions = [
     { label: "Operacion", value: "operacion" },
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

  }

  onHide(){
    // //console.log('on hide...');
    this.onHideEvent.emit(false);
  }
  onOption(e : string){
    //console.log("option XD");

    this.list1 = [];
    this.list2 = [];
    // //console.log('option...',e);
    // //console.log('vehicles',this.vehicleService.vehicles);
    // //console.log('vehiclestree',this.vehicleService.vehiclesTree);
    if(e=='operacion'){
      this.list1 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == 0 && vehicle.idgrupo == 0 && vehicle.idconvoy==0);
      console.log(this.list1);
    }else if(e=='grupo'){
      //getGroup
      this.selectedOperation = {};
      let aux: any[] = [];
      let aux2:any[] = [];

      //incluye crear grupo a Unidadaes Sin Operacion
      // aux2 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idgrupo == 0 && vehicle.namegrupo=='Unidades Sin Grupo' && vehicle.idoperation!=0);
      aux2 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idgrupo == 0 && vehicle.namegrupo=='Unidades Sin Grupo');
      // Filtrar elementos con 'idoperacion' diferente
      for (const vehicle of aux2) {
        const nameoperation = vehicle.nameoperation;
        const filteredOperation = {
          idoperation: vehicle.idoperation,
          nameoperation: vehicle.nameoperation
        };
        if (!aux.some((v) => v.nameoperation === nameoperation)) {
          aux.push(filteredOperation);
        }
      }
      aux.sort((a, b) => a.idoperation - b.idoperation);
      this.operations = aux;
      this.list1 = [];

    }else if(e=='convoy'){
      //getGroup
      this.selectedOperation = {};
      this.selectedGroup = {};
      let aux_operations: any[] = [];
      let aux2:any[] = [];

      //incluye crear grupo a Unidadaes Sin Operacion
      // aux2 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idgrupo == 0 && vehicle.namegrupo=='Unidades Sin Grupo' && vehicle.idoperation!=0);
      // aux2 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idconvoy == 0 && vehicle.nameconvoy=='Unidades Sin Convoy');
      aux2 = this.vehicleService.vehicles;
      // Filtrar elementos con 'idoperacion' diferente
      for (const vehicle of aux2) {
        const idoperation = vehicle.idoperation;
        const filteredOperation = {
          idoperation: vehicle.idoperation,
          nameoperation: vehicle.nameoperation
        };
        if (!aux_operations.some((v) => v.idoperation === idoperation)) {
          aux_operations.push(filteredOperation);
        }
      }
      aux_operations.sort((a, b) => a.idoperation - b.idoperation);
      this.operations = aux_operations;
      // this.operations = this.vehicleService.listOperations; //FUNCIONA SOLO LISTA DE OPERACIONES
      // console.log('LIST OPERATIONS',this.operations);
      this.placeholder_groups = 'Seleccione una Operación primero...';

      // console.log('TESTING : ',this.vehicleService.listOperations);

      this.groups = []; //asignar grupos para convoys

      this.list1 = [];
    }
  }
  onChangeOperation (e : string){
    let aux = [];
    let aux2:any[] = [];
    let aux_groups:any[] = [];
    this.list1 = [];
    this.list2 = [];
    //diferente filtro para crear GRUPO
    if (e == 'grupo'){
      aux = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation&&vehicle.idgrupo == 0&&vehicle.idconvoy == 0);
      this.list1 = aux;
    }else if(e == 'convoy'){
      //filtro para crear un CONVOY cargando lista de grupos
      aux2 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation);

      for (const vehicle of aux2) {
        const idgroup = vehicle.idgrupo;
        const filteredGroup = {
          idgrupo: vehicle.idgrupo,
          namegrupo: vehicle.namegrupo
        };
        if (!aux_groups.some((v) => v.idgrupo === idgroup)) {
          aux_groups.push(filteredGroup);
        }
      }
      aux_groups.sort((a, b) => a.idgrupo - b.idgrupo);

      // console.log('auxliar2 POST:',aux_groups);
      this.groups = aux_groups; //asignar grupos para convoys
      this.list1 = [];
      this.placeholder_groups = 'Seleccione un Grupo';
    }
    //diferente filtro para crear CONVOY
    // console.log('Operation changed a: ',this.selectedOperation);
    // console.log('LISTA DE VEHICLES por OPE: ',aux, this.list1);
    this.selectedGroup = {};
  }
  onChangeGroup(e : string){
    let aux = [];
    this.list1 = [];
    this.list2 = [];
    // console.log('OPERACION changed a: ',this.selectedOperation);
    // console.log('GRUPO changed a: ',this.selectedGroup);
    aux = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation && vehicle.idgrupo == this.selectedGroup && vehicle.idconvoy == 0);
    this.list1 = aux;
    // console.log('LISTA DE VEHICLES por OPE: ',aux, this.list1);
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
  async onSubmit(){
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

    const list2Filtered = this.list2.map((item: UserTracker) => ({
      id: item.id,
      IMEI: item.IMEI,
      idoperation: item.idoperation,
      idgrupo: item.idgrupo,
      idconvoy: item.idconvoy,
      nameoperation: item.nameoperation,
      namegrupo: item.namegrupo,
      nameconvoy: item.nameconvoy,
    }));

    if(this.option=='grupo'){
      req = {
        // vehicles : this.list2,
        vehicles : list2Filtered,
        name : this.nameTarget,
        description : this.descriptionTarget,
        operation_id : this.selectedOperation,
        enm_type: this.option
        // }
      };
    }else if(this.option=='operacion'){
      req = {
        vehicles : list2Filtered,
        name : this.nameTarget,
        description : this.descriptionTarget,
        enm_type: this.option

      };
    }else if(this.option=='convoy'){
      req = {
        vehicles : list2Filtered,
        name : this.nameTarget,
        description : this.descriptionTarget,
        operation_id : this.selectedOperation,
        grupo_convoy_id : this.selectedGroup,
        enm_type: this.option

      };
    }
    // const req = {
    //   vehicles : this.list2,
    //   name : this.name.nativeElement.value,
    //   description : this.description.nativeElement.value
    //   // }
    // };

    console.log("submit",req);
    // //console.log("dat enviada",req);

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
      await this.configService.postGroup(req).toPromise()
        .then(info => {
          // console.log("post group res =",info);
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
            // this.list2=[];
          }else{
            //mensaje de error
            console.log('EXISTE UN ERROR',info);
          }
        }).catch(errorMsg => {
          console.log(`(Vehicle Group) Hubo un error al crear la nueva operacion/grupo/convoy (promise): `, errorMsg);
        });
    }
  }

  addGroup(info: any){
    // //console.log('addgroup info =',info);
    const vehicles = this.vehicleService.vehicles;
    for (const key in this.list2) {
      const index = vehicles.indexOf(this.list2[key])
      if(this.option=='convoy'){
        vehicles[index].idconvoy=info.data['id'];
        vehicles[index].nameconvoy=info.data['nombre'];
      }else if(this.option=='operacion'){
        vehicles[index].idoperation=info.data['id'];
        vehicles[index].nameoperation=info.data['nombre'];
      }else if(this.option=='grupo'){
        vehicles[index].idgrupo=info.data['id'];
        vehicles[index].namegrupo=info.data['nombre'];
      }
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
    this.list2=[];
    //this.option = "nada";
    this.option = "operacion";
    this.name.nativeElement.value = "";
    //this.description.nativeElement.value = "";

  }
  onShow(){
    // this.list1 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.grupo=="Unidades Sin Grupo");
    //console.log('Show New Grupo/Convoy Modal', this.vehicleService.vehicles);
    this.onOption(this.option);
  }

  validateFormsInputs() {
    const inputElement = this.name.nativeElement;
    this.isFormName = inputElement.value.trim() !== '';
  }

  validateRepeatName (name: string,type: string){
    //validar repetido
    this.isExistNameByType = false;
    if (type == 'operacion'){
      let existingOperations = [];
      existingOperations = this.vehicleService.listOperations.filter((op: any)=>op.nameoperation == name); //FUNCIONA SOLO LISTA DE OPERACIONES
      console.log('TEMPLATE:',this.vehicleService.listOperations)
      if (existingOperations.length > 0) {
        console.log(existingOperations.length);
        return true;
      }
    }else if (type == 'grupo'){
      let existingGroups = [];
      existingGroups = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation&&vehicle.namegrupo == name);
      if (existingGroups.length > 0) {
        console.log(existingGroups.length);
        return true;
      }
    }else if (type == 'convoy'){
      let existingConvoy = [];
      existingConvoy = this.vehicleService.vehicles.filter((cv: any)=>cv.idoperation == this.selectedOperation&&cv.idgrupo == this.selectedGroup&&cv.nameconvoy == name);
      if (existingConvoy.length > 0) {
        console.log(existingConvoy.length);
        return true;
      }
    }
    return false;
  }

  verifyEmptyList(){
    if (!this.list2 || this.list2.length === 0) {
      this.listVehiclesEmpty = true;
      return true;
    }
    return false;
  }

  onConfirmGroup(){
    this.loading = true;
    let currOption = this.option;
    let currName = this.nameTarget;

    if (!this.isFormName) {
      Swal.fire({
        title: 'Error',
        text: `La creación de ${currOption} debe tener un nombre.`,
        icon: 'error',
      }).then(() => {
        this.loading = false; // Restablece el estado de carga en caso de error.
      });
      return;
    }
    this.isExistNameByType = this.validateRepeatName(currName,currOption);
      if (this.isExistNameByType){
        Swal.fire({
            title: 'Error',
            text: `Ya existe ${currOption} con ese nombre, ingrese otro distinto.`,
          icon: 'error',
        }).then(() => {
          this.loading = false; // Restablece el estado de carga en caso de error.
        });
        return;
      }
    //verificar cantidad de vehiculos en la lista
    this.listVehiclesEmpty = this.verifyEmptyList();
    if (this.listVehiclesEmpty){
      Swal.fire({
        title: 'Error',
        text: `La lista debe contener minimó un vehículo.`,
        icon: 'error',
      }).then(() => {
        this.loading = false; // Restablece el estado de carga en caso de error.
      });
      return;
    }
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se aplicarán los cambios',
      //icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        actions: 'w-100',
        cancelButton: 'col-4',
        confirmButton: 'col-4',
      },
      preConfirm: async () => {
        // await this.onSubmit();
        await this.onSubmit();
      },
    }).then((data) => {
      if(data.isConfirmed) {
        Swal.fire(
          'Éxito',
          `El ${currOption} ${currName} se creó exitosamente`,
          'success',
        );
        console.log(data);
      } else {
        console.log(`(Vehicle Group) Hubo un error al crear el nuevo ${currOption}`);
      }
      this.loading=false;
    });
  }

}
