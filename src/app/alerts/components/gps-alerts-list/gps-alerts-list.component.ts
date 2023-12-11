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

  strSearched: string = '';
  noResults: boolean = false;
  isRowDataEmpty: boolean = false;

  options = new Array(
    { id:'ALERTS', name:"Alertas"},
    { id:'ALERTS-GPS', name:"Alertas GPS Tracker"},
    { id:'ALERTS-GPS-CREATE', name:"Alertas GPS Tracker"},
  );

  constructor(
    private AlertService: AlertService,
    public panelService: PanelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show('loadingGPSAlertsSpinner');
    this.loadData();
  }

  ngOnDestoy(){
    this.AlertService.clearDataByType();
  }

  public async loadData(){
    this.spinner.show('loadingGPSAlertsSpinner'); //En caso de ser llamado por delete
    this.alerts = await this.AlertService.getAlertsByType('gps');
    this.isRowDataEmpty = this.alerts.length == 0;
    this.spinner.hide('loadingGPSAlertsSpinner');
  }

  edit(id:string){
    let alert = this.alerts.find( (alert: Alert) => alert.id == id);
    this.AlertService.alertEdit = alert;

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = "ALERTS-GPS-EDIT";
    this.panelService.nombreCabecera = "Alertas GPS";
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

  public onSearch(){
    if(this.strSearched == ''){
      this.alerts = this.AlertService.getDataByType();
      this.noResults = false;
    }else {
      this.alerts = this.AlertService.getDataByType().filter( (alert:any)  => {
        return (alert.nombre??'').toLowerCase().match(this.strSearched.toLowerCase()) 
          || (alert.tipo??'').toLowerCase().match(this.strSearched.toLowerCase());
      });
      this.noResults = this.alerts.length == 0;
    }
  }

}
