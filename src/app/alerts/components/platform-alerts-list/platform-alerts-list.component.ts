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

  options = new Array(
    { id:'ALERTS-PLATFORM-CREATE', name:"Alertas Plataforma"},
  );
  strSearched: string = '';
  noResults: boolean = false;
  isRowDataEmpty: boolean = false;

  constructor(
    private AlertService: AlertService,
    public panelService: PanelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show('loadingPlatformAlertsSpinner');
    this.loadData();
  }

  ngOnDestoy(){
    this.AlertService.clearDataByType();
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

  public async loadData(){
    this.spinner.show('loadingPlatformAlertsSpinner');
    this.alerts = await this.AlertService.getAlertsByType('platform');
    this.isRowDataEmpty = this.alerts.length == 0;
    this.spinner.hide('loadingPlatformAlertsSpinner');
  }

  edit(id:string){
    let alert = this.alerts.find( (alert: Alert) => alert.id == id);
    this.AlertService.alertEdit = alert;

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = "ALERTS-PLATFORM-EDIT";
    this.panelService.nombreCabecera = "Alertas Plataforma";
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
