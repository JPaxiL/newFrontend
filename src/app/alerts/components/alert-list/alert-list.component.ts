import { Alert } from './../../models/alert.interface';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from '../../../alerts/service/alert.service';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {

  constructor(private AlertService: AlertService) { }
  public alerts:Alert[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(){
    this.AlertService
    .get('alert')
    .subscribe( ( response:Alert[] ) => {
      this.alerts = response.map((alert:Alert)=> {
        let sistema_notificacion = alert?.sistema_notificacion?.split(",");
        alert.sonido_sistema_bol = (sistema_notificacion[2] == 'true');
        alert.activo_bol = (alert.activo == 'true');
        alert.notificacion_email_bol = (alert.notificacion_email == 'true');

        return alert;
      });

    });
  }

}
