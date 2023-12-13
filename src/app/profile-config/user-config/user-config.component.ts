import { Component, Output, EventEmitter, OnInit, NgModule } from '@angular/core';
import { PanelService } from 'src/app/panel/services/panel.service';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
  
  userForm :any = {};

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

  colorsVehicles: any[] = [
    { name: 'Por defecto', code: 'c4c2c1',color: '#c4c2c1' }, // Celeste
    { name: 'Celeste', code: '00AAE4',color: '#00AAE4' }, // Celeste
    { name: 'Morado', code: '9370db',color: '#9370db' }, // Morado
    { name: 'Naranja', code: 'ffa500',color: '#ffa500' }, // Naranja
    { name: 'Amarillo', code: 'ffff00',color: '#ffff00' }, // Amarillo
    { name: 'Verde', code: '17d244',color: '#17d244' }, // Verde Claro
    { name: 'Guinda', code: '800000',color: '#800000' }, // Guinda
    { name: 'Dorado', code: 'ffd700',color: '#ffd700' }, // Dorado
  ];
  constructor(       
    private userDataService: UserDataService,
    private panelService: PanelService,
    private vehicleService: VehicleService) {
  }

  ngOnInit(): void {
    this.userDataService.spinner.show('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner
    this.typeVehiclesList = this.userDataService.typeVehicles;
    this.initForm();
    console.log(this.typeVehiclesList,this.userDataService.userData);
    this.initFormTableVehiclesDefault();

  }

  initForm() {
    this.userForm.oldPass = ''; 
    this.userForm.newPass = ''; 
    this.userForm.newPassRepeat = '';
    this.userForm.bol_ondas = this.userDataService.userData.bol_ondas;
    this.userForm.bol_cursor = this.userDataService.userData.bol_cursor;
    this.userForm.bol_vehicle = this.userDataService.userData.bol_vehicle;
    this.userForm.vehicles = this.typeVehiclesList ?? [];
  }
  
  initFormTableVehiclesDefault(){
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
    this.userDataService.spinner.hide('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner

    this.originalValues = JSON.parse(JSON.stringify(this.typeVehiclesList)); // Guardar una copia profunda de los valores originales
  }

  switchActive(switchNumber: number){
    if (switchNumber === 1) {
      this.userForm.bol_ondas = true;
      this.userForm.bol_cursor = false;
      this.userForm.bol_vehicle = false;
      
    } else if (switchNumber === 2) {
      this.userForm.bol_ondas = false;
      this.userForm.bol_cursor = true;
      this.userForm.bol_vehicle = false;
      
    } else if (switchNumber === 3) {
      this.userForm.bol_ondas = false;
      this.userForm.bol_cursor = false;
      this.userForm.bol_vehicle = true;
    }
  }

  onClickCancel(){
    this.userForm.oldPass = '';
    this.userForm.newPass = '';
    this.userForm.newPassRepeat = '';
    this.userForm.bol_ondas = this.userDataService.userData.bol_ondas;
    this.userForm.bol_cursor = this.userDataService.userData.bol_cursor;
    this.userForm.bol_vehicle = this.userDataService.userData.bol_vehicle;

    this.typeVehiclesList = JSON.parse(JSON.stringify(this.originalValues)); // Restaurar los valores originales
    this.panelService.nombreComponente = '';
    $("#panelMonitoreo").hide( "slow" );

  }
  onSubmit(){
  
    // Limpiar el array antes de agregar los datos actualizados
    this.userForm.vehicles = [];
    
    // Iterar sobre la lista de vehículos y agregarlos al array userForm.Vehicle
    this.typeVehiclesList.forEach((item: any) => {
      const existingIndex = this.userForm.vehicles.findIndex((vehicle: any) => vehicle.id === item.id);
      
      if (existingIndex !== -1) {
        console.log('NUNCA VA ENCONTRAR');
        this.userForm.vehicles[existingIndex] = {
          id: item.id,
          var_nombre: item.var_nombre,
          var_color: item.var_color,
          var_galon: item.var_galon
        };
      } else {
        this.userForm.vehicles.push({
          id: item.id,
          var_nombre: item.var_nombre,
          var_color: item.var_color,
          var_galon: item.var_galon
        });
      }
    });
    console.log(this.userForm); // Información del formulario general


    // Preparación de la solicitud para enviar datos
    let req = {
      vehicles: this.userForm.vehicles,
      oldPass: this.userForm.oldPass,
      newPass: this.userForm.newPass,
      newCopyPass: this.userForm.newPassRepeat,
      bol_ondas: this.userForm.bol_ondas,
      bol_cursor: this.userForm.bol_cursor,
      bol_vehicle: this.userForm.bol_vehicle
    };
    return req;
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
            console.log('Actualización exitosa:', response);  
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
      this.vehicleService.initialize();
    });
  }

}
