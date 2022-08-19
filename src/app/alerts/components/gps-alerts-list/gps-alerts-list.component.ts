import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-gps-alerts-list',
  templateUrl: './gps-alerts-list.component.html',
  styleUrls: ['./gps-alerts-list.component.scss']
})
export class GpsAlertsListComponent implements OnInit {

  public alerts:Alert[] = [];
  public rowHeight: number = 38;
  public defaultColDef:any = [];
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
    this.spinner.show('loadingGPSAlertsSpinner'); //En caso de ser llamado por delete
    this.alerts = await this.AlertService.getAlertsByType('gps');
    this.spinner.hide('loadingGPSAlertsSpinner');
  }

  edit(id:string){
    let alert = this.alerts.find( (alert: Alert) => alert.id == id);
    this.AlertService.alertEdit = alert;

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = "ALERTS-GPS-EDIT";
    this.panelService.nombreCabecera = "Alertas GPS";
  }

}
