import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { GeofencesService } from '../../services/geofences.service';
import { Geofences } from '../../models/geofences';
import { IGeofence } from '../../models/interfaces';
import  { VehicleService } from '../../../vehicles/services/vehicle.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  @Input('display') display: boolean = false;
  @Output() onHideEvent = new EventEmitter<boolean>();
  @ViewChild('name',{ static:true}) name!: ElementRef;
  @ViewChild('description',{ static:true}) description!: ElementRef;
  selectedOperation: any={};
  operations: any=[];
  loading : boolean = false;
  list1: any=[];
  selectedList1: any=[];
  list2: any=[];
  selectedList2: any=[];
  nameTarget: string = "";
  isFormName: boolean = false; //para validar NameObligatorio en Tag
  isExistTag: boolean = false; //para validar NameExistente en Tag
  listTagsEmpty: boolean = false; //para validar si el array de list2 esta vacio en la creacion
  
  constructor(
    private geofencesService: GeofencesService,
    private vehicleService: VehicleService,
  ) {}

  ngOnInit(): void {
    this.getOperations();
    console.log("hereee", this.geofencesService.listGeofences);
    this.list1 = [];
    this.list2 = [];
  }
  ngOnDestroy(){

  }

  close() {
    this.geofencesService.closeModal(); 
  }
  onHide(){
    this.onHideEvent.emit(false);
  }

  onChangeOperation(){
    //getTag
    let aux: any[] = [];
    let aux2:any[] = [];
    this.list1 = [];
    this.list2 = [];
    console.log("hereee", this.geofencesService.listGeofences);
    aux2 = this.geofencesService.listGeofences.filter((geo: any)=>geo.idoperation == this.selectedOperation);
    console.log("listaa of Geoos",aux2);
    this.list1 = aux2;
  }

  getOperations(){
    let aux: any [] = [];
    aux = this.vehicleService.vehicles;
    for (const vehicle of aux) {
      const id_operation = vehicle.idoperation;
      const filteredOperation = {
        idoperation: vehicle.idoperation,
        nameoperation: vehicle.nameoperation,
      };
    if (!this.operations.some((op:any) => op.idoperation === id_operation)) {
        this.operations.push(filteredOperation);
      }
    }
    this.operations.sort((a: { idoperation: number; }, b: { idoperation: number; }) => a.idoperation - b.idoperation);
    console.log('GEt Operations in Tags: ',this.operations);
  }
  onName(data: any){
    this.nameTarget = data.target.value;
  }

  upList2(){
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

  upList1(){
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
  validateRepeatName (name: string){
    this.isExistTag = false;
    let aux = this.geofencesService.listTag.some((tg:any)=> tg.var_name == name);
    console.log("auxx", aux);
  
    return false;
  }
  validateFormsInputs(){
    const inputElement = this.name.nativeElement;
    this.isFormName = inputElement.value.trim() !== '';
  }

  verifyEmptyList(){
    if (!this.list2 || this.list2.length === 0) {
      this.listTagsEmpty = true;
      return true;
    }
    return false;
  }

  addTag(){
    //console.log();
    const geofences = this.geofencesService.geofences;
    for (const key in this.list2) {
      const index = geofences.indexOf(this.list2[key])
    }
    this.geofencesService.geofences = geofences;
    // //console.log('new vehicles',vehicles);
    //this.geofencesService.geofencesTree = this.Geofences.createTreeNode(geofences);
    this.onHideEvent.emit(false);
    this.list2=[];
    this.name.nativeElement.value = "";
  }
  
  async onSubmit(){
    let req = {};
    req = {
      geofences : this.list2,
      var_name : this.nameTarget,
    };
    console.log('req==>',req);
    req = await this.geofencesService.storeTagAndAssingGeo(req);
    // .then((info: { res: any; }) => {
    //   if(info.res){
    //     this.addTag();  
    //   }else{
    //     //mensaje de error
    //     console.log('EXISTE UN ERROR');
    //   }
    // }).catch(errorMsg => {
    //   console.log(`Falló la asignación de etiqueras (promise): `, errorMsg);
    // });
  }

  onConfirmTag(){
    this.loading = true;
    let currName = this.nameTarget;

    if (!this.isFormName) {
      Swal.fire({
        title: 'Error',
        text: `La creación de Etiqueta debe tener un nombre.`,
        icon: 'error',
      }).then(() => {
        this.loading = false; // Restablece el estado de carga en caso de error.
      });
      return;
    }
    console.log('sin operacion==>',this.selectedOperation);
    if (this.selectedOperation >= 0) {
      
    }else {
      Swal.fire({
        title: 'Error',
        text: `Debe seleccionar una operación.`,
        icon: 'warning',
      }).then(() => {
        this.loading = false; // Restablece el estado de carga en caso de error.
      });
      return;
    }

    this.isExistTag = this.validateRepeatName(currName);
      if (this.isExistTag){
        Swal.fire({
            title: 'Error',
            text: `Ya existe una etiqueta con ese nombre, ingrese otro distinto.`,
          icon: 'error',
        }).then(() => {
          this.loading = false; // Restablece el estado de carga en caso de error.
        });
        return;
      }
    //verificar cantidad de geocercas en la lista
    this.listTagsEmpty = this.verifyEmptyList();
    if (this.listTagsEmpty){
      Swal.fire({
        title: 'Error',
        text: `La lista debe contener minimó una geocerca.`,
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
        await this.onSubmit();
      },
    }).then((data) => {
      if(data.isConfirmed) {
        Swal.fire(
          'Éxito',
          `El ${currName} se creó exitosamente`,
          'success',
        );
        console.log(data);
      } else {
        console.log(`(geo Group) Hubo un error al crear la nueva etiqueta }`);
      }
      this.loading=false;
    });
  }

}
