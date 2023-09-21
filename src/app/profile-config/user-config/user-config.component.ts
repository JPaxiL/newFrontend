import { Component, OnInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PanelService } from 'src/app/panel/services/panel.service';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

  profileConfigForm = new FormGroup({
    actual_pass: new FormControl('', Validators.required),
    new_pass_1: new FormControl('', Validators.required),
    new_pass_2: new FormControl('', Validators.required),
  });

  pngNewPass: string = '';
  pngNewPassR: string = '';

  isUnderConstruction: boolean = true;
  switchPoint: boolean = false;
  switchCircle: boolean = false;
  switchMobile: boolean = false;


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
    public panelService: PanelService,
  ) { }

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

}
