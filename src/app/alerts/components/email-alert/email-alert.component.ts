import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-alert',
  templateUrl: './email-alert.component.html',
  styleUrls: ['./email-alert.component.scss']
})
export class EmailAlertComponent implements OnInit {
  @Input() alert:any;
  params: any;
  notificacion_email: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.notificacion_email = (this.alert.notificacion_email.toLowerCase() === 'true');
  }

  agInit(params: any){
    this.params = params;
    this.notificacion_email = (this.params.value.notificacion_email.toLowerCase() === 'true');
  }

}
