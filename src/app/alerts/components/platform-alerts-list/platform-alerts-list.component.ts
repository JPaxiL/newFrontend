import { Component, OnInit } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-platform-alerts-list',
  templateUrl: './platform-alerts-list.component.html',
  styleUrls: ['./platform-alerts-list.component.scss']
})
export class PlatformAlertsListComponent implements OnInit {
  public alerts:Alert[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private AlertService: AlertService,
    private panelService: PanelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  public async loadData(){
    this.spinner.show('loadingPlatformAlertsSpinner');
    this.alerts = await this.AlertService.getAlertsByType('platform');
    this.spinner.hide('loadingPlatformAlertsSpinner');
  }

  edit(id:string){
    let alert = this.alerts.find( (alert: Alert) => alert.id == id);
    this.AlertService.alertEdit = alert;

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = "ALERTS-PLATFORM-EDIT";
    this.panelService.nombreCabecera = "Alertas Plataforma";
  }

}
