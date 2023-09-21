
import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { GridItem, Operation, ScreenView, UserTracker } from '../models/interfaces';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { MultiviewService } from '../services/multiview.service';
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
  units: UserTracker[] = [];
  selectedOperation: any = null;

  currentMultiview!: ScreenView;
  
  loading : boolean = false;
  
  // Save multiview
  showSaveMultiview = false;
  stateOptions: any[] = [{label: 'Si', value: 'si'}, {label: 'No', value: 'no'}];
  saveMultiviewOption: string = 'si';
  validName = false;
  constructor(
    public multiviewService: MultiviewService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.multiviewService.getOperations().subscribe((resp:ResponseInterface) => {
      this.operations = resp.data as Operation[];
    });
    this.resetCurrentMultiview();
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
    // //console.log('on hide...');
    this.onHideEvent.emit(false);
  }
  onOption(e : string){
    console.log("option XD");
  }
  onSelectMultiview(event:any){
    console.log("onSelectMV event", event.value);
    
    this.currentMultiview = { ...event.value };
    if(!event.value){
      this.clearPreview();
      this.multiviewService.selectedUnits = [];
      console.log("onselectmultiview: ",this.multiviewService.selectedUnits);
    }else{
      this.multiviewService.selectedUnits = this.currentMultiview.grids!.map( (item:GridItem) => {
        return item.content as UserTracker;
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
    this.multiviewService.getTrackersByOperation(this.selectedOperation).subscribe((resp:ResponseInterface) => {
      this.units = resp.data as UserTracker[];
    });
  }

  onGridChange(event:GridItem[]){
    //console.log("lista unidades: ", event);
    console.log("lista structura prev: ", this.currentMultiview);
    if(!this.multiviewService.arraysAreEqual(this.currentMultiview.grids,event)){
      this.currentMultiview.grids = event!;
      if(this.currentMultiview.grids.length > 0){
        this.currentMultiview.was_edited = true;
      }else{
        this.currentMultiview.was_edited = false;
      }
    }else{
      this.currentMultiview.was_edited = false;
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
    if(this.currentMultiview.name.length > 3){
      this.validName = true;
      this.nameInput.nativeElement.classList.remove('ng-invalid','ng-dirty');
      this.nameInput.nativeElement.classList.add('ng-valid');
    }
    else{
      this.validName = false;
      this.nameInput.nativeElement.classList.remove('ng-valid');
      this.nameInput.nativeElement.classList.add('ng-invalid','ng-dirty');
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
    this.resetCurrentMultiview();
    this.multiviewService.selectedUnits = [];
    this.validName = true;
    this.saveMultiviewOption == 'si'
    this.loading = false;
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
