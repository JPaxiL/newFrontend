import { Component, Output, EventEmitter, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PanelService } from 'src/app/panel/services/panel.service';
import { UserDataService } from '../services/user-data.service';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
  @Output() submit = new EventEmitter<string>();
  @Output() eventDisplay = new EventEmitter<boolean>();


  perfileConfigForm = new FormGroup({
    actual_pass: new FormControl('', Validators.required),
    new_pass_1: new FormControl('', Validators.required),
    new_pass_2: new FormControl('', Validators.required),
  });
  
  pngNewPass: string = '';
  pngNewPassR: string = '';

  isUnderConstruction: boolean = true;
  switchPoint: boolean = true;
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

  constructor(
    public panelService: FormBuilder) {
      this.perfileConfigForm = this.panelService.group({
        color: ['#RRGGBB']
      });
  }

  onSubmit(){
    const color = this.perfileConfigForm.value.color;
    this.submit.emit(color);
  }

  ngOnInit(): void {
  }

  consoleMostrar(){
    console.log(this.mostrarDirVehicle);
  }

  switchActive(switchNumber: number){
    if (switchNumber === 1) {
      this.switchCircle = true;
      this.switchPoint = false;
      this.switchMobile = false;
    } else if (switchNumber === 2) {
      this.switchCircle = false;
      this.switchPoint = true;
      this.switchMobile = false;
    } else if (switchNumber === 3) {
      this.switchCircle = false;
      this.switchPoint = false;
      this.switchMobile = true;
    }
  }

  setActiveSwitch(selectedSwitch: number){
    this.activeSwitch = selectedSwitch;
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
