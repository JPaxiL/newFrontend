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
  originalValues: any[] | undefined;

  constructor(       
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private panelService: PanelService) {
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


    //OJO FILTRAR POR SOLO TIPO DE VEHICULOS QUE TIENE EL USER...

    //CONFIGURACION DE TIPO VEHICULOS GUARDADA DEL USUARIO
    this.initFormTableVehicles();
    console.log(this.typeVehiclesList);
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

  initFormTableVehicles(){
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
    this.originalValues = JSON.parse(JSON.stringify(this.typeVehiclesList)); // Guardar una copia profunda de los valores originales


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
    this.usersForm.get('newPass')?.setValue('');    
    this.usersForm.get('newPassRepeat')?.setValue('');    
    this.usersForm.get('bol_ondas')?.setValue(this.userDataService.userData.bol_ondas);    
    this.usersForm.get('bol_cursor')?.setValue(this.userDataService.userData.bol_cursor);    
    this.usersForm.get('bol_vehicle')?.setValue(this.userDataService.userData.bol_vehicle);    
    this.typeVehiclesList = JSON.parse(JSON.stringify(this.originalValues)); // Restaurar los valores originales
    this.panelService.nombreComponente = '';
    $("#panelMonitoreo").hide( "slow" );

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
      this.userDataService.getUserData();
    });
  }

}
