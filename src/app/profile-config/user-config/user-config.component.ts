import { Component, Output, EventEmitter, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PanelService } from 'src/app/panel/services/panel.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
  @Output() eventDisplay = new EventEmitter<boolean>();
  
  usersForm!: FormGroup;
  form :any = {};

  isUnderConstruction: boolean = true;
  selectedType: any = {};
  loading : boolean = false;
  typeVehiclesList:any = {};
  userTypeVehicleConfig: any = {};
  
  bol_ondas!:boolean;
  bol_cursor!:boolean;
  bol_vehicle!:boolean;

  typeVehiclesForm: any = [];
  constructor(       
    private fb: FormBuilder,
    private userDataService: UserDataService) {
  }

  onSubmit(){
    this.typeVehiclesForm = [];
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach((row: any) => {
      const id = row.querySelector('input[type="hidden"]').value;
      const color = row.querySelector('input[type="color"]').value;
      const galon = row.querySelector('input[type="text"]').value;

      this.typeVehiclesForm.push({ id, var_color: color, var_galon: galon });
    });

    console.log(this.usersForm.value);
    console.log(this.typeVehiclesForm);
    // VARIABLE para enviar DATOS 
    let req = {
      vehicles : this.typeVehiclesForm,
      newPass : this.usersForm.value.newPass,
      newCopyPass : this.usersForm.value.newPassRepeat,
      bol_ondas : this.usersForm.value.bol_ondas,
      bol_cursor: this.usersForm.value.bol_cursor,
      bol_vehicle: this.usersForm.value.bol_vehicle,
      // }
    };
    return req;
  }

  ngOnInit(): void {
    this.usersForm = this.initForm();
    this.typeVehiclesList = this.userDataService.typeVehicles;
    // this.typeVehiclesList.forEach((item: { var_color: string; var_galon: string; }) => {
    //   item.var_color = ''; // Asignar un valor inicial a var_color
    //   item.var_galon = ''; // Asignar un valor inicial a var_galon
    // });
    //OJO FILTRAR POR SOLO TIPO DE VEHICULOS QUE TIENE EL USER...

    // console.log(this.userDataService.typeVehicles);
    //CONFIGURACION DE TIPO VEHICULOS GUARDADA DEL USUARIO
    let aux = this.userDataService.typeVehiclesUserData;
    for (const userDataItem of this.typeVehiclesList) {
      const itemVehicle = aux.find((item: { type_vehicle_id: any; }) => item.type_vehicle_id === userDataItem.id);
      if (itemVehicle) {
        userDataItem.var_color = itemVehicle.var_color;
        userDataItem.var_galon = itemVehicle.var_galon;
      } else {
        userDataItem.var_color = '#c3c4c4';
        userDataItem.var_galon = '';
      }
    }
  }

  initForm(): FormGroup{
    return this.fb.group({
      newPass: [''],
      newPassRepeat: [''],
      bol_ondas: [this.userDataService.userData.bol_ondas],
      bol_cursor:[this.userDataService.userData.bol_cursor],
      bol_vehicle:[this.userDataService.userData.bol_vehicle],
    })
  }

  switchActive(switchNumber: number){
    if (switchNumber === 1) {
      this.usersForm.get('bol_ondas')?.setValue(true);
      this.usersForm.get('bol_cursor')?.setValue(false);
      this.usersForm.get('bol_vehicle')?.setValue(false);
      
    } else if (switchNumber === 2) {
      this.usersForm.get('bol_ondas')?.setValue(false);
      this.usersForm.get('bol_cursor')?.setValue(true);
      this.usersForm.get('bol_vehicle')?.setValue(false);
      
    } else if (switchNumber === 3) {
      this.usersForm.get('bol_ondas')?.setValue(false);
      this.usersForm.get('bol_cursor')?.setValue(false);
      this.usersForm.get('bol_vehicle')?.setValue(true);
    }
  }

  onClickCancel(){
    this.eventDisplay.emit(false);
  }

  confirm(){
    this.loading=true;

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
        var response:any;
        response = await this.onSubmit();
        this.userDataService.updateUserConfig(response).subscribe(
          (response) => {
            // Manejar la respuesta del servidor si es necesario
            // console.log('Actualización exitosa:', response);
            if (!response.res){
              Swal.fire(
                'Error',
                response.message,
                'warning'
              );
            }else if (response.res){
              Swal.fire(
                '',
                'Los datos se guardaron correctamente!!',
                'success'
              );
            }
          },
          (error) => {
            // Manejar errores si la actualización falla
            console.error('Error al actualizar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error...',
              'warning'
            );
          }
        );
      },
    }).then((data) => {
      // console.log('testing respuesta...',data);
      this.loading=false;
    });
  }

  switchActive(switchNumber: number){
    if (switchNumber === 1) {
      this.switchCircle = true;
      this.switchPoint = false;
      this.switchMobile = false;
      this.usersForm.value.type_follow= 'circle';
    } else if (switchNumber === 2) {
      this.switchCircle = false;
      this.switchPoint = true;
      this.switchMobile = false;
      this.usersForm.value.type_follow= 'point';
    } else if (switchNumber === 3) {
      this.switchCircle = false;
      this.switchPoint = false;
      this.switchMobile = true;
      this.usersForm.value.type_follow= 'mobile';
    }
  }

  types: any = [
    {id: '0', name: 'MOTO'},
    {id: '1', name: 'AUTO'},
    {id: '2', name: 'CAMIONETA'},
    {id: '3', name: 'MINIBUS'},
    {id: '4', name: 'BUS'},
    {id: '5', name: 'CARGA'},
    {id: '6', name: 'TRACKER'},
    {id: '7', name: 'TRAILER'},
  ];

  updateIconsDropdown(){
    let found = false;
    // this.dropdownIcons = this.icons.filter((icon: any) => {
    //   return icon.type == this.selectedType.id;
    // });
    // for(let i = 0; i < this.dropdownIcons.length; i++){
    //   if(this.dropdownIcons[i].code == this.selectedIcon.code){
    //     this.selectedIcon = this.dropdownIcons[i];
    //     found = true;
    //   }
    // }
    // if(!found){
    //   this.selectedIcon = this.selectedIcon = this.dropdownIcons[0];
    // }
  }
  clickShowPanel(){

  }

  onColorSelected(color: string): void {
    // Aquí, enviarlo al servidor.
  }
  onClickCancel(){
    this.eventDisplay.emit(false);
  }

  confirm(){
    this.loading=true;
    if(this.pngNewPass!=this.pngNewPassR){
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un problema al guardar la información.',
        icon: 'error',
        allowOutsideClick: true,
      });
      // Swal.fire({
      //   title: 'Falló!',
      //   text: 'No coinsiden la contraseña, ingrese de nuevo.',
      //   icon: 'error',
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     // Lógica al confirmar
      //   } else if (result.isDismissed) {
      //     // Lógica al cerrar la alerta
      //   }
      // });
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
          'Los cambios se guardaron exitosamente',
          'success'
        );
      } else {
        console.log('(Vehicle Config) Hubo un error al guardar los cambios');
      }
      this.loading=false;
    });
  }

}
