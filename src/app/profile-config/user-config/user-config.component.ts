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
  @Output() submit = new EventEmitter<string>();
  @Output() eventDisplay = new EventEmitter<boolean>();

  @Output() colorSelected = new EventEmitter<string>();
    selectedColor: string = ''; // Color initial
    vehiculoColor = 'blue'; // Cambia este valor según la preferencia del usuario  

  
  perfileConfigForm = new FormGroup({
    actual_pass: new FormControl('', Validators.required),
    new_pass_1: new FormControl('', Validators.required),
    new_pass_2: new FormControl('', Validators.required),
  });
  
  onColorChange() {
    //this.userDataService.changeColor(this.selectedColor);
    
  }
  pngNewPass: string = '';
  pngNewPassR: string = '';
  usersForm!: FormGroup;
  indGalon: any;
  form :any = {};

  isUnderConstruction: boolean = true;
  switchPoint: boolean = false;
  switchCircle: boolean = false;
  switchMobile: boolean = false;
  selectedType: any = {};
  loading : boolean = false;
  activeSwitch: number = 0;
  mostrarDirVehicle: number = 0;
  mostrarIcono: number = 0;
  sizeIcono: number = 2;
  configIconOptions = [
    { id: 0, name: 'Ícono'},
    { id: 1, name: 'Flecha 1'},
    { id: 2, name: 'Flecha 2'},
  ];
  sizeIconOptions = [
    { id: 1, name: '1x'},
    { id: 2, name: '2x'},
    { id: 3, name: '3x'},
    { id: 4, name: '4x'},
  ];

  showVehicleDirOptions = [
    { id: 1, name: 'Flecha de dirección' },
    { id: 2, name: 'Cola de dirección' },
  ];
  typeVehiclesList:any = {};
  userTypeVehicleConfig: any = {};
  constructor(       
    private fb: FormBuilder,
    private userDataService: UserDataService,
    public panelService: FormBuilder) {
      this.perfileConfigForm = this.panelService.group({
        color: ['#RRGGBB']
      });
  }

  onSubmit(){
    // const color = this.perfileConfigForm.value.color;
    // this.submit.emit(color);
    console.log(this.usersForm.value);
    return;

  }

  ngOnInit(): void {
    console.log(this.userDataService.userData);
    this.usersForm = this.initForm();
    this.usersForm.value.type_follow= 'point';
    this.typeVehiclesList = this.userDataService.typeVehicles;
    console.log(this.userDataService.typeVehicles);
    document.documentElement.style.setProperty('--vehiculo-color', this.vehiculoColor);
    this.typeVehiclesList.forEach((item: { id: any; }, index: string) => {
      this.usersForm.addControl('id' + index, this.fb.control(item.id));
      this.usersForm.addControl('var_color' + index, this.fb.control(''));
      this.usersForm.addControl('var_galon' + index, this.fb.control(''));
    });
  }

  initForm(): FormGroup{
    return this.fb.group({
      password: [''],
      passwordRepeat: [''],
      bol_ondas: [''],
      bol_cursor:[''],
      bol_vehicle:[''],
    })
  }

  consoleMostrar(){
    console.log(this.mostrarDirVehicle);
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
  changeGeoColor(id:number) {
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
