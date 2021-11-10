import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vehicle-config',
  templateUrl: './vehicle-config.component.html',
  styleUrls: ['./vehicle-config.component.scss']
})
export class VehicleConfigComponent implements OnInit {

  // display: boolean = false;
  @Input('display') display: boolean = false;
  @Input('config') config: any = [];
  @Output() cancel = new EventEmitter<number>();


  selectedIcon: any={};
  selectedType: any = {};

  types: any = [
    {name: 'NO ASIGNADO', id: '0'},
    {name: 'CAMIONETA PASAJEROS', id: '1'},
    {name: 'BUS DE PASAJEROS', id: '2'},
    {name: 'CAMIONETA CONCENTRADO', id: '3'},
    {name: 'CONCENTRADO', id: '4'}
  ];
  /*

  campos bloqueadoes
  imei
  Conductor
  GRUPO
  tamque

  */
  groups: any = [
    { name: "CLIENTES TACNA", id:'0'},
    { name: "GPSTEL", id:'1'},
    { name: "Unidades Sin Grupo", id:'2'},
    { name: "WARI SERVICE", id:'3'}

  ];
  icons: any = [
    { name: "1.png", code: "vehicle" },
    { name: "2.png", code: "vehicle" },
    { name: "3.png", code: "vehicle" },
    { name: "4.png", code: "vehicle" },
    { name: "5.png", code: "vehicle" },
    { name: "6.png", code: "vehicle" },
    { name: "7.png", code: "vehicle" },
    { name: "8.png", code: "vehicle" },
    { name: "9.png", code: "vehicle" },
    { name: "10.png", code: "vehicle" },
    { name: "11.png", code: "vehicle" },
    { name: "12.png", code: "vehicle" },
    { name: "13.png", code: "vehicle" },
    { name: "14.png", code: "vehicle" },
    { name: "15.png", code: "vehicle" },
    { name: "16.png", code: "vehicle" },
    { name: "17.png", code: "vehicle" },
    { name: "18.png", code: "vehicle" },
    { name: "19.png", code: "vehicle" },
    { name: "20.png", code: "vehicle" },
    { name: "26.png", code: "vehicle" },
    { name: "31.png", code: "vehicle" },
    { name: "33.png", code: "vehicle" },
    { name: "34.png", code: "vehicle" },
    { name: "41.png", code: "vehicle" },
    { name: "42.png", code: "vehicle" },
    { name: "43.png", code: "vehicle" },
    { name: "44.png", code: "vehicle" },
    { name: "45.png", code: "vehicle" },
    { name: "46.png", code: "vehicle" },
    { name: "47.png", code: "vehicle" }

  ];

  constructor() {}


  ngOnInit(): void {

  }
  onShow(){
    this.selectedIcon = {
      name: this.config.icon,
      code:'vehicle'
    }
    this.selectedType = {
      name: this.types[this.config.tipo]['name'],
      id: this.config.tipo
    };

  }
  onClickCancel(){
    this.cancel.emit(1);
  }

}
