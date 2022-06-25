import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

  mostrarDirVehicle: number = 0;
  mostrarIcono: number = 0;
  sizeIcono: number = 2;
  configIcon = [
    { id: 0, name: 'Ícono'},
    { id: 1, name: 'Flecha 1'},
    { id: 2, name: 'Flecha 2'},
  ];
  sizeIcon = [
    { id: 1, name: '1x'},
    { id: 2, name: '2x'},
    { id: 3, name: '3x'},
    { id: 4, name: '4x'},
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

  consoleMostrar(){
    console.log(this.mostrarDirVehicle);
  }

}
