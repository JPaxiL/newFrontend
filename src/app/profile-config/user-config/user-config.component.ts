import { Component, Output, EventEmitter, OnInit, NgModule } from '@angular/core';
import { PanelService } from 'src/app/panel/services/panel.service';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
  
  private userDataCompletedSubscription: Subscription | undefined;

  userForm :any = {};

  isUnderConstruction: boolean = true;
  selectedType: any = {};
  loading : boolean = false;
  typeVehiclesList:any = {};
  userTypeVehicleConfig: any = {};
  showChangeItem:boolean = false;
  bol_ondas!:boolean;
  bol_cursor!:boolean;
  bol_vehicle!:boolean;

  typeVehiclesForm: any = [];
  originalValues: any[] | undefined;

  filteredColorsVehicles: any[] = [];
  colorsVehicles: any[] = [
    { name: 'Por defecto', code: 'c4c2c1',color: '#c4c2c1' }, // Celeste
    { name: 'Celeste', code: '00FFFF',color: '#00FFFF' }, // Celeste
    { name: 'Verde', code: '1DA80E',color: '#1DA80E' }, // Verde 
    { name: 'Azul', code: '45A9FF',color: '#45A9FF' }, // Azul
    { name: 'Guinda', code: '800000',color: '#800000' }, // Guinda
    { name: 'Morado', code: '9370db',color: '#9370DB' }, // Morado
    { name: 'Rosado', code: 'BA00FF',color: '#BA00FF' }, // Rosado
    { name: 'Dorado', code: 'F1C700',color: '#F1C700' }, // Dorado
    { name: 'Naranja', code: 'ffa500',color: '#FFA500' }, // Naranja
    { name: 'Amarillo', code: 'ffff00',color: '#FFFF00' }, // Amarillo
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
    // console.log(this.typeVehiclesList,this.userDataService.userData);
    if (this.userDataService.changeItemIcon){
      this.showChangeItem = true;
      console.log('VALOR DE CHANGE ITEM ->',this.userDataService.changeItemIcon);
    }
    if(this.userForm.bol_ondas == true || this.userForm.bol_vehicle == true){
      this.hideStateColors(true)
    }else{
      this.hideStateColors(false)
    }
    this.initFormTableVehiclesDefault();

  }

  initForm() {
    // this.userForm.oldPass = ''; 
    // this.userForm.newPass = ''; 
    // this.userForm.newPassRepeat = '';
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
        userDataItem.var_color = '#c4c2c1';
        userDataItem.var_galon = '';
      }
    }
    this.userDataService.spinner.hide('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner

    this.originalValues = JSON.parse(JSON.stringify(this.typeVehiclesList)); // Guardar una copia profunda de los valores originales
  }

  changeItemCheckbox(){
    if (this.showChangeItem == false){
      this.userForm.bol_ondas = false;
      this.userForm.bol_cursor = false;
      this.userForm.bol_vehicle = false;
      this.hideStateColors(false);
    }else{
      this.userForm.bol_ondas = this.userDataService.userData.bol_ondas;
      this.userForm.bol_cursor = this.userDataService.userData.bol_cursor;
      this.userForm.bol_vehicle = this.userDataService.userData.bol_vehicle;
      if(this.userForm.bol_ondas == true || this.userForm.bol_vehicle == true){
        this.hideStateColors(true)
      }else{
        this.hideStateColors(false)
      }
    }
  }
  switchActive(option:number){
    if (option == 1) {
      this.userForm.bol_cursor = false;
      this.userForm.bol_vehicle = false;
      this.hideStateColors(this.userForm.bol_cursor);
    } else if (option == 2) {
      this.userForm.bol_ondas = false;
      this.userForm.bol_vehicle = false;
      this.hideStateColors(false);
      
    } else if (option == 3) {
      this.userForm.bol_ondas = false;
      this.userForm.bol_cursor = false;
      this.hideStateColors(this.userForm.bol_vehicle);
    }else{
      this.userForm.bol_ondas = false;
      this.userForm.bol_cursor = false;
      this.userForm.bol_vehicle = false;
      this.hideStateColors(false);
    }
    // console.log('Mostrando changes...',this.userForm);
  }

  onClickCancel(){
    // this.userForm.oldPass = '';
    // this.userForm.newPass = '';
    // this.userForm.newPassRepeat = '';
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
      const existingIndex = this.userForm.vehicles.findIndex((vehicle: any) => vehicle.id == item.id);
      if (existingIndex !== -1) {
        console.log('NUNCA VA ENCONTRAR');
        this.userForm.vehicles[existingIndex] = {
          id: item.id,
          var_nombre: item.var_nombre,
          var_color: item.var_color,
          var_galon: item.var_galon
        };
      } else {
        if(item.var_color == "#c4c2c1"){
          item.var_color = "c4c2c1";
        }
        this.userForm.vehicles.push({
          id: item.id,
          var_nombre: item.var_nombre,
          var_color: item.var_color,
          var_galon: item.var_galon
        });
      }
    });


    // Preparación de la solicitud para enviar datos
    let req = {
      vehicles: this.userForm.vehicles,
      // oldPass: this.userForm.oldPass,
      // newPass: this.userForm.newPass,
      // newCopyPass: this.userForm.newPassRepeat,
      bol_ondas: this.userForm.bol_ondas,
      bol_cursor: this.userForm.bol_cursor,
      bol_vehicle: this.userForm.bol_vehicle,
      itemChanges: this.showChangeItem
    };
    console.log(req); // Información del formulario general
    return req;
  }

  confirm(){
    this.loading=true;
    var response:any;
    response = this.onSubmit();
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
        
        this.userDataService.updateUserConfig(response).subscribe(
          (response) => {
            // Manejar la respuesta del servidor si es necesario
            console.log('Actualización exitosa:', response);  
            if (!response.res){
              this.loading=false;
              Swal.fire(
                'Error',
                response.message,
                'warning'
              );
            }else if (response.res){
              // console.log('INICIANDO USER DATA SERVICE PRIMERO');
              this.userDataService.getUserData();
              // Desuscribe el observador anterior si existe
              if (this.userDataCompletedSubscription) {
                this.userDataCompletedSubscription.unsubscribe();
              }
              // Crea una nueva suscripción y guárdala en la variable para poder desuscribirte luego
              this.userDataCompletedSubscription = this.userDataService.userDataCompleted.subscribe(async (completed: boolean) => {
                if (completed) {
                  this.vehicleService.initialize();
                  this.vehicleService.vehicleCompleted.subscribe(async (vehicleComplete: boolean)=>{
                    if (vehicleComplete){
                      this.loading=false;
                      Swal.fire(
                        '',
                        'Los datos se guardaron y actualizaron correctamente!!',
                        'success'
                      );
                    }
                  })
                }
              });
              
            }
          },
          (error) => {
            // Manejar errores si la actualización falla
            console.error('Error al actualizar:', error);
            this.loading=false;
            Swal.fire(
              'Error',
              'Ocurrió un error...',
              'warning'
            );
          }
        );
      },
    }).then(async (data) => {
      // console.log('testing respuesta...',data);
    });
  }

  hideStateColors(hideColor:boolean){
    if (hideColor == true) {
      // console.log('CAMBIOS EN TRUE');
      //ACTUALIZAR COLORES SELECCIONADOS
      this.typeVehiclesList.forEach((vehicle: { var_color: string; }) => {
        if (vehicle.var_color === '45A9FF' || vehicle.var_color === '1DA80E') {
          vehicle.var_color = 'c4c2c1'; // Cambiar al color por defecto c4c2c1
        }
      });
      //FILTRAR LISTA DE COLORES
      this.filteredColorsVehicles = this.colorsVehicles.filter(
        (color) => color.code !== '45A9FF' && color.code !== '1DA80E'
      );
    } else {
      // console.log('CAMBIOS EN FALSE');
      this.filteredColorsVehicles = this.colorsVehicles;
    }
  }

}
