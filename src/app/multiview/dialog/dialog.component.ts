
import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Convoy, GridItem, MediaRequest, Operation, ScreenView, UnitItem, UserTracker } from '../models/interfaces';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { MultiviewService } from '../services/multiview.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {

  @Input('display') display: boolean = false;
  @Output() onHideEvent = new EventEmitter<boolean>();
  @ViewChild('nameInput') nameInput!: ElementRef;
  selectedValue: string="";
  multiple: boolean = true;
  operations: Operation[] = [];
  unitItems: UnitItem[] = [];
  units: UserTracker[] = [];
  convoys: Convoy[] = [];
  selectedOperation: any = null;
  fromBack = false;
  fromSaved = false;
  itJustCleaned = false;
  currentMultiview!: ScreenView;
  selectedGroup!: ScreenView | null;
  loading : boolean = false;
  
  // Save multiview
  showSaveMultiview = false;
  stateOptions: any[] = [{label: 'Si', value: 'si'}, {label: 'No', value: 'no'}];
  saveMultiviewOption: string = 'si';
  validName = false;


  constructor(
    public multiviewService: MultiviewService,
    private vehicleService: VehicleService,
  ) {
   
  }

  async ngOnInit(): Promise<void> {
    if(!this.vehicleService.statusDataVehicle){
      // console.log('(vehicleService) vehicle service no está listo. Subscribiendo para obtener data...');
      this.vehicleService.dataCompleted.subscribe({
        next: (result: boolean) => {
          if(result){
            this.multiviewService.getOperations().subscribe((resp:ResponseInterface) => {
              this.operations = resp.data as Operation[];
              this.operations.push({id:0,descripcion:"Sin Operación", nombre:"Sin Operación",usuario_id:0});
            });
            console.log('OPERATIONS MULTIVIEW NEW ----->',this.vehicleService.listOperations);
            this.resetCurrentMultiview();
          }
        },
        error: (errMsg: any) => {
          console.log('(vehicle service) Error al obtener list operations: ', errMsg);
        }
      });
    } else {
      // console.log('(vehicel service) está listo. Subscribiendo para obtener data...');
      this.multiviewService.getOperations().subscribe((resp:ResponseInterface) => {
        this.operations = resp.data as Operation[];
        this.operations.push({id:0,descripcion:"Sin Operación", nombre:"Sin Operación",usuario_id:0});
      });
      console.log('OPERATIONS MULTIVIEW NEW ----->',this.vehicleService.listOperations);
      this.resetCurrentMultiview();
    }
  }

  resetCurrentMultiview(){
    this.currentMultiview = {
      name: "",
      grids: [],
      is_open: false,
      was_edited: false
    };
  }

  onHide(){
    this.clearPreview();
    this.onHideEvent.emit(false);
  }
  onOption(e : string){
    console.log("option XD");
  }
  onSelectMultiview(event:any){
    console.log("onSelectMV event", event.value);
    this.currentMultiview = { ...event.value };
    this.fromSaved = true;
    if(!event.value){
      this.clearPreview();
      this.multiviewService.selectedUnits = [];
      console.log("onselectmultiview: ",this.multiviewService.selectedUnits);
    }else{
      this.multiviewService.selectedUnits = this.currentMultiview.grids!.map( (item:GridItem) => {
        return item.content as UnitItem;
      });
    }
  }
  deleteMultiview(name: string){
    console.log("delete multiview: ", name);
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea eliminar el grupo ${name}?`,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: () => !Swal.isLoading(), // Evita interacción externa mientras se carga
      preConfirm: async () => {
        try {
          const resp = await this.multiviewService.deleteMultiview(name).toPromise();
    
          if (resp.success) {
            this.multiviewService.userMultiview = this.multiviewService.userMultiview.filter(
              (item) => item.name !== name
            );
            if(this.currentMultiview.was_edited == false){
              this.clearPreview();
            }
            Swal.fire(
              'Eliminado',
              'Los datos se eliminaron correctamente!!',
              'success'
            );
          } else {
            Swal.fire('Error', 'No se pudo eliminar los datos', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
        }
      },
    });
  }

  changeOperation(){
    // this.multiviewService.getTrackersByOperation(this.selectedOperation).subscribe((resp:ResponseInterface) => {
    //   this.units = resp.data.trackers as UserTracker[];
    //   this.convoys = resp.data.convoys;
    //   this.unitItems = [];
    //   if(this.units && this.units.length>0){
    //     this.units.forEach(item => {
    //       this.unitItems.push(
    //         {
    //           nombre: item.nombre!, 
    //           operation: this.operations.find(op => op.id == parseInt(this.selectedOperation))!.nombre,
    //           type: "tracker",
    //           selected: false, 
    //           id:item.id, 
    //           imeis: [item.IMEI!.toString()]
    //         }
    //       );
    //     })
    //   }
    //   if(this.convoys && this.convoys.length>0){
    //     this.convoys.forEach(item => {
    //       this.unitItems.push(
    //         {
    //           nombre: item.nombre!, 
    //           operation: this.operations.find(op => op.id == parseInt(this.selectedOperation))!.nombre,
    //           type: "convoy",
    //           selected: false, 
    //           id:item.id, 
    //           imeis: this.vehicleService.vehicles.filter(vehi => vehi.idconvoy === item.id).map(vh => vh.IMEI!)
    //         }
    //       );
    //     });
    //   }
    //   this.unitItems.sort((a, b) => a.nombre.localeCompare(b.nombre));
    //   console.log("this.unitItems: ",this.unitItems);
    // });

    this.unitItems = [];
    // obtengo los convoys que pertenecen a esa operación
    //Para ello obtengo todos los vehiculos que pertenecen a esa operación
    let aux_convoys = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation && vehicle.idconvoy != 0);
    // de todos esos vehiculos extraigo los ids de convoys
    let convoysIds = new Set<number>(aux_convoys.map(vh => {
      return vh.idconvoy!;
    }));
    //Por cada Id de convoys, busco el primer vehiculo con ese convoyid y me creo un objeto de tipo UnitItem para insertarlo en UnitItems[]
    convoysIds.forEach(id => {
      this.unitItems.push(
        ...[aux_convoys.find(convoy => convoy.idconvoy == id)].map(item => {
          return {
            id: item!.idconvoy!,
            nombre: "(CONVOY) "+item!.nameconvoy!,
            operation: item!.nameoperation!,
            selected: false,
            type: "convoy",
            imeis: this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation && vehicle.idconvoy == item!.idconvoy).map(vh => vh.IMEI!)
          } as UnitItem
        })
      );
    });

    //Una vex obtenga todos los convoys de esa operación, ahora agrego los vehiculos individualmente
    this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation).forEach(tracker_unit => {
      this.unitItems.push({
        id: tracker_unit.id,
        nombre: tracker_unit.name!,
        operation: tracker_unit.nameoperation,
        selected: false,
        type: "tracker",
        imeis: [tracker_unit.IMEI!.toString()]
      });
    })
    this.unitItems.sort((a, b) => a.nombre.localeCompare(b.nombre));
    console.log("this.unitItems: ",this.unitItems);
  }

  onGridChange(event:GridItem[]){
    //console.log("lista unidades: ", event);
    console.log("lista structura prev: ", this.currentMultiview);
    this.currentMultiview.was_edited = true;
    if(!this.multiviewService.arraysAreEqual(this.currentMultiview.grids,event)){
      this.currentMultiview.grids = event!;
      if(this.currentMultiview.grids.length > 0){
        this.currentMultiview.was_edited = true;
        console.log("this.currentMultiview.was_edited",this.currentMultiview.was_edited);
        
      }else{
        this.currentMultiview.was_edited = false;
        console.log("this.currentMultiview.was_edited3",this.currentMultiview.was_edited);
      }
    }
    if(this.fromBack){
      this.currentMultiview.was_edited = true;
      console.log("this.currentMultiview.was_edited2",this.currentMultiview.was_edited);

      console.log("fromBack: ",this.fromBack);
      this.fromBack = false;
    }
    if(this.fromSaved){
      this.currentMultiview.was_edited = false;
      console.log("this.currentMultiview.was_edited22",this.currentMultiview.was_edited);

      console.log("fromSaved: ",this.fromSaved);
      this.fromSaved = false;
    }
    if(this.itJustCleaned){
      this.currentMultiview.was_edited = false;
      console.log("this.currentMultiview.was_edited333",this.currentMultiview.was_edited);

      console.log("fromSaved: ",this.fromSaved);
      this.itJustCleaned = false;
    }
    console.log("lista structura: ", this.currentMultiview);
  }
  
  changeUnits(){
    if(this.multiviewService.selectedUnits.length > 20){
      this.multiviewService.selectedUnits.splice(20);
    }else{
      //si una unidad fue seleccionada
      this.currentMultiview.was_edited = true;
    }
    if(this.multiviewService.selectedUnits.length == 0){
      console.log("length: ",this.multiviewService.selectedUnits.length);
      this.currentMultiview.was_edited = false;
    }
    //console.log("selectedUnits: ", this.multiviewService.selectedUnits);
  }
  async onSubmit(){
    /*
    await this.configService.postGroup(req).toPromise()
    .then((info: { res: any; }) => {
      if(info.res){
        
      }else{
        
      }
    }).catch((errorMsg: any) => {
      console.log(`(Vehicle Group) Hubo un error al crear el nuevo grupo/convoy (promise): `, errorMsg);
    });*/
  }
  
  onShow(){
    console.log('Show Multi View Modal');
  }
  isValidGroupName(){
    if(this.currentMultiview.name.length < 3 || this.currentMultiview.name.includes(' ')){
      this.validName = false;
      this.nameInput.nativeElement.classList.remove('ng-valid');
      this.nameInput.nativeElement.classList.add('ng-invalid','ng-dirty');
    }
    else{
      this.validName = true;
      this.nameInput.nativeElement.classList.remove('ng-invalid','ng-dirty');
      this.nameInput.nativeElement.classList.add('ng-valid');
    }
  }
  openNewMultiview(multiview: ScreenView){
    const newMultiview = {...multiview};
    if(newMultiview.name == ""){
      newMultiview.name = "default";
    }
    this.multiviewService.userMultiview = this.multiviewService.userMultiview.filter(item => item.name !== newMultiview.name);
    this.multiviewService.userMultiview.push(newMultiview);
    this.multiviewService.openScreenView(newMultiview.name);
  }
  clearPreview(){
    this.showSaveMultiview = false;
    this.multiviewService.selectedUnits = [];
    this.validName = true;
    this.saveMultiviewOption = 'si';
    this.loading = false;
    this.selectedGroup = null;
    this.resetCurrentMultiview();
  }
  backToPreview(){
    console.log("multiviewService.selectedUnits",this.multiviewService.selectedUnits);
    this.fromBack = true;
    this.showSaveMultiview = false;
  }
  onConfirmGroup(){
    if(!this.showSaveMultiview){
      //Si estamos en la vista de preview y dan click en siguiente
      console.log("en vista preview");
      
      if(this.currentMultiview.was_edited){
        console.log("currentMultiview editado");
        //Si la actual estructura fue editada debo mostrar la opcion de guardar
        this.showSaveMultiview = true;
      }else{
        console.log("current Multiview no fue editado");
        // si no fue editado es un grupo antiguo abierto o uno vacio
        //verificar que no este vacio y abrir, en caso sea vacio no hacer nada
        if(this.currentMultiview.grids && this.currentMultiview.grids!.length > 0){
          console.log("currentMultiview no esta vacio");
          this.openNewMultiview(this.currentMultiview)
        };
      }
      return;
    }
    // Si estamos en la vista de guardado y dan click en siguiente
    console.log("en vista guardado");
    if(this.saveMultiviewOption == 'si'){
      console.log("si quiere guardar");
      //si no tiene un nombre valido
      this.isValidGroupName();
      if(!this.validName){
        console.log("no tiene nombre valido");
        return;
      }
      console.log("si tiene nombre valido");
      //Si desea guardar y tiene un nombre valido, guardamos/actualizamos y abrimos
      this.loading = true;
      //ya que guardare, defino que no fueron editados
      this.currentMultiview.was_edited = false;
      if(this.multiviewService.userMultiview.find(item => item.name === this.currentMultiview.name)){
        // Si hay un multiview que se llame igual preguntar si sobreescribirá;
        console.log("duplicated?: ", this.multiviewService.userMultiview);
        Swal.fire({
          title: '¿Sobreescribir grupo?',
          text: `¿El grupo ${this.currentMultiview.name} ya existe, desea sobreecribirlo?`,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: 'Sobreescribir',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: () => !Swal.isLoading(), // Evita interacción externa mientras se carga
          preConfirm: async () => {
            try {
              const resp = await this.multiviewService.saveMultiview(this.currentMultiview).toPromise();
        
              if (resp.success) {
                this.openNewMultiview(this.currentMultiview);
                console.log("current userMultiviews: ",this.multiviewService.userMultiview);
                this.clearPreview();
                Swal.fire(
                  'Guardado',
                  'Los datos se guardaron correctamente!!',
                  'success'
                );
              } else {
                this.loading = false;
                Swal.fire('Error', 'No se pudo guardar los datos', 'error');
              }
            } catch (error) {
              this.loading = false;
              Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
            }
          },
        }).then((result) => {
          if (result.isDismissed) {
            this.loading = false;
            this.currentMultiview.was_edited = true;
          }
        });;
      }else{
        this.multiviewService.saveMultiview(this.currentMultiview).subscribe(resp => {
          if(resp.success){
            this.openNewMultiview(this.currentMultiview);
            console.log("current userMultiviews: ",this.multiviewService.userMultiview);
            this.clearPreview();
          }else{
            Swal.fire('Error', 'No se pudo guardar el grupo. Intente nuevamente.', 'error');
            this.loading = false
          }
        });
      }
      
    }else{
      console.log("no quiso guardar");
      //  si no desea guardar se abre la pestaña con el nombre por defecto
      this.currentMultiview.name = "";
      this.openNewMultiview(this.currentMultiview);
      this.clearPreview();
    }
    
  }
}
