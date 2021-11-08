import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-alert',
  templateUrl: './system-alert.component.html',
  styleUrls: ['./system-alert.component.scss']
})
export class SystemAlertComponent implements OnInit {
  params: any;
  notificacion_system: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
    let arrayNotificationSystem = this.params.value.sistema_notificacion.split(',');
    this.notificacion_system = (arrayNotificationSystem[2].toLowerCase() === 'true');
  }

}
