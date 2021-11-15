import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-alert',
  templateUrl: './system-alert.component.html',
  styleUrls: ['./system-alert.component.scss']
})
export class SystemAlertComponent implements OnInit {
  @Input() alert:any;
  params: any;
  notificacion_system: boolean = false;
  constructor() { }

  ngOnInit(): void {
    let arrayNotificationSystem = this.alert.sistema_notificacion.split(',');
    this.notificacion_system = (arrayNotificationSystem[2].toLowerCase() === 'true');
  }

  agInit(params: any){
    this.params = params;
    let arrayNotificationSystem = this.params.value.sistema_notificacion.split(',');
    this.notificacion_system = (arrayNotificationSystem[2].toLowerCase() === 'true');
  }

}
