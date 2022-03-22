import { Component, OnInit } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-platform-alerts-list',
  templateUrl: './platform-alerts-list.component.html',
  styleUrls: ['./platform-alerts-list.component.scss']
})
export class PlatformAlertsListComponent implements OnInit {
  public alerts:Alert[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private AlertService: AlertService,private panelService: PanelService) { }

  ngOnInit(): void {
    this.loadData();
  }

  public async loadData(){
    this.alerts = await this.AlertService.getAlertsByType('platform');
  }

  edit(id:string){
    let alert = this.alerts.find( (alert: Alert) => alert.id == id);
    this.AlertService.alertEdit = alert;

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = "ALERTS-PLATFORM-EDIT";
    this.panelService.nombreCabecera =   "Alerta Plataforma";
  }

}
