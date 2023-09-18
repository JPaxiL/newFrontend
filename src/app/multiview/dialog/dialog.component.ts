
import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Operation, UserTracker } from '../models/interfaces';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { MultiviewService } from '../services/multiview.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input('display') display: boolean = false;
  @Output() onHideEvent = new EventEmitter<boolean>();

  selectedValue: string="";
  multiple: boolean = true;
  operations: Operation[] = [];
  units: UserTracker[] = [];
  selectedOperation: any = null;
  selectedUnits: UserTracker[] = [];

  loading : boolean = false;

  constructor(
    private multiviewService: MultiviewService
  ) {
  }

  ngOnInit(): void {
    this.multiviewService.getOperations().subscribe((resp:ResponseInterface) => {
      this.operations = resp.data as Operation[];
    });
  }

  onHide(){
    // //console.log('on hide...');
    this.onHideEvent.emit(false);
  }
  onOption(e : string){
    console.log("option XD");
  }
  changeOperation(){
    this.multiviewService.getTrackersByOperation(this.selectedOperation).subscribe((resp:ResponseInterface) => {
      this.units = resp.data as UserTracker[];
    });
  }
  changeUnits(){
    if(this.selectedUnits.length > 20){
      this.selectedUnits.splice(20);
    }
    console.log("selectedUnits: ", this.selectedUnits);
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

  onChangeDisplayUnits(event : any){
    console.log("onChangeDisplayUnits: ", event);
    this.selectedUnits = event as UserTracker[];
  }
  onConfirmGroup(){
    this.loading = true;
    /*
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
          `El se creó exitosamente`,
          'success'
        );
      } else {
        console.log(`(Vehicle Group) Hubo un error al crear el nuevo ${currOption}`);
      }
      this.loading=false;
    });*/
  }
}
