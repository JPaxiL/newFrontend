import { Component, Output, EventEmitter, OnInit, NgModule,OnDestroy} from '@angular/core';
import { PanelService } from 'src/app/panel/services/panel.service';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { Subscription } from 'rxjs';

import { ColorPickerModule } from 'primeng-lts/colorpicker';




@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {


  private userDataCompletedSubscription: Subscription | undefined;
  private vehicleCompletedSubscription: Subscription | undefined;
  userForm :any = {};

  isUnderConstruction: boolean = true;
  selectedType: any = {};
  loading : boolean = false;
  typeVehiclesList:any = {};
  userTypeVehicleConfig: any = {};
  showChangeItem:boolean = false;

  showDirectionVehicles:boolean=false;


  showIcon: boolean = false;

  bol_ondas!:boolean;
  bol_cursor!:boolean;
  bol_vehicle!:boolean;
  bol_direction!:boolean;

  typeVehiclesForm: any = [];
  originalValues: any[] | undefined;

  filteredColorsVehicles: any[] = [];

  colorsVehicles: any[] = [
    { name: 'Por defecto', code: 'c4c2c1',color: '#c4c2c1' }, // Celeste
    { name: 'Celeste', code: '00ffff',color: '#00FFFF' }, // Celeste
    { name: 'Verde', code: '1da80e',color: '#1DA80E' }, // Verde 
    { name: 'Azul', code: '45a9ff',color: '#45A9FF' }, // Azul
    { name: 'Guinda', code: '800000',color: '#800000' }, // Guinda
    { name: 'Morado', code: '9370db',color: '#9370DB' }, // Morado
    { name: 'Rosado', code: 'ba00ff',color: '#BA00FF' }, // Rosado
    { name: 'Dorado', code: 'f1c700',color: '#F1C700' }, // Dorado
    { name: 'Naranja', code: 'ffa500',color: '#FFA500' }, // Naranja
    { name: 'Amarillo', code: 'ffff00',color: '#FFFF00' }, // Amarillo
  ];
  constructor(       
    public userDataService: UserDataService,
    private panelService: PanelService,
    private vehicleService: VehicleService) {
  }

  ngOnInit(): void {
    console.log("vehicle",this.userDataService.typeVehiclesUserData)
    this.userDataService.spinner.show('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner
    this.typeVehiclesList = this.userDataService.typeVehicles;
    //console.log("this.typeVehiclesList",this.typeVehiclesList)
    this.initForm();
    // console.log(this.typeVehiclesList,this.userDataService.userData);
    if (this.userDataService.changeItemIcon){
      this.showChangeItem = true;
      console.log('VALOR DE CHANGE ITEM ->',this.userDataService.changeItemIcon);
    }
    this.showDirectionVehicles = this.userDataService.changeRotateIcon;


    this.initFormTableVehiclesDefault();
  }

  initForm() {
    // this.userForm.oldPass = ''; 
    // this.userForm.newPass = ''; 
    // this.userForm.newPassRepeat = '';
    this.userForm.bol_ondas = this.userDataService.userData.bol_ondas;
    this.userForm.bol_cursor = this.userDataService.userData.bol_cursor;
    this.userForm.bol_vehicle = this.userDataService.userData.bol_vehicle;
    this.userForm.bol_direction = this.userDataService.userData.bol_direction;
    this.userForm.vehicles = this.typeVehiclesList ?? [];
  }
  
  onColorChange(event: any, item: any):void {

    console.log("item", item, event);
  }
  


  initFormTableVehiclesDefault(){
    let aux = this.userDataService.typeVehiclesUserData;
    for (const userDataItem of this.typeVehiclesList) {
      const itemVehicle = aux.find((item: { type_vehicle_id: any; }) => item.type_vehicle_id === userDataItem.id);
      if (itemVehicle) {
        userDataItem.code_color = itemVehicle.code_color;
        userDataItem.var_galon = itemVehicle.var_galon;
      } else {
        userDataItem.code_color = '#c4c2c1';
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
      this.userForm.bol_direction = false;
      this.showIcon = false;
    }else{
      this.userForm.bol_ondas = this.userDataService.userData.bol_ondas;
      this.userForm.bol_cursor = this.userDataService.userData.bol_cursor;
      this.userForm.bol_vehicle = this.userDataService.userData.bol_vehicle;
      this.userForm.bol_direction = this.userDataService.userData.bol_direction;

    }

    
  }

  changeDirectionVehiclesCheckbox(){
    this.userForm.bol_direction = this.showDirectionVehicles;
    console.log(this.showDirectionVehicles);
  }


  switchActive(option: number) {
    switch (option) {
      case 1:
        this.userForm.bol_cursor = false;
        this.userForm.bol_vehicle = false;
        console.log("OPCION 1",this.userForm.bol_ondas);
        this.showIcon = false;
        break;
      case 2:
        this.userForm.bol_ondas = false;
        this.userForm.bol_vehicle = false;
        console.log("OPCION 2",this.userForm.bol_cursor);
        this.showIcon = false;

        break;
      case 3:
        this.userForm.bol_ondas = false;
        this.userForm.bol_cursor = false;
        console.log("OPCION 3",this.userForm.bol_vehicle);

        if (!this.userForm.bol_vehicle) {
          this.showIcon = false;
        }else{
          this.showIcon = true;
        }
        break;
      case 4:
        if (!this.userForm.bol_direction) {
          this.userForm.bol_direction = false;
          console.log("OPCION 4", this.userForm.bol_direction);
        }else{
          this.userForm.bol_direction = true;
          console.log("OPCION 4", this.userForm.bol_direction);
        }
        break;
      default:
        this.userForm.bol_direction = false;
        this.userForm.bol_ondas = false;
        this.userForm.bol_cursor = false;
        this.userForm.bol_vehicle = false;
        this.showIcon = false;
        break;
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

    this.userForm.bol_direction = this.userDataService.userData.bol_direction;


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
          code_color: item.code_color,
          var_galon: item.var_galon
        };
      } else {
        if(item.code_color == "#c4c2c1"){
          item.code_color = "c4c2c1";
        }
        this.userForm.vehicles.push({
          id: item.id,
          var_nombre: item.var_nombre,
          code_color: item.code_color,
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

      bol_direction: this.userForm.bol_direction,

      itemChanges: this.showChangeItem

    };
    console.log("SOLICITUDDATOS",req); // Información del formulario general
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
          async (response) => {
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
              // await this.userDataService.setDefaultStatusUserData();
              // await this.userDataService.getUserData();
              // while (!this.userDataService.userDataInitialized) {
              //   await this.delay(1000); // Espera 1 segundo antes de verificar nuevamente
              // }
              // await this.vehicleService.setDefaultStatusDataVehicle();
              // await this.vehicleService.initialize();
              // this.loading = false;
              // Swal.fire(
              //   '',
              //   'Los datos se guardaron y actualizaron correctamente!!',
              //   'success'
              // );
              
              await this.userDataService.setDefaultStatusUserData();
              await this.userDataService.getUserData();
              this.userDataCompletedSubscription = this.userDataService.userDataCompleted.subscribe(async (userDataCompleted: boolean) => {
                if (userDataCompleted && this.userDataService.userDataInitialized) {
                  this.unSubscribeUserCompleted();
                  await this.vehicleService.setDefaultStatusDataVehicle();
                  await this.vehicleService.initialize();
                  this.vehicleCompletedSubscription = this.vehicleService.vehicleCompleted.subscribe(async (vehicleDataCompleted:boolean) =>{
                    if(vehicleDataCompleted && this.vehicleService.statusDataVehicle){
                      console.log('Resp 5');
                      this.unSubscribeVehicleCompleted();
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
      console.log('testing respuesta...',data);
      if(data.isDismissed==true){
        this.loading=false;
      }
    });
  }

  unSubscribeUserCompleted(){
    if (this.userDataCompletedSubscription) {
      this.userDataCompletedSubscription.unsubscribe();
    }
  }
  unSubscribeVehicleCompleted(){
    if (this.vehicleCompletedSubscription){
      this.vehicleCompletedSubscription.unsubscribe();
    }
  }

  // delay(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
}
