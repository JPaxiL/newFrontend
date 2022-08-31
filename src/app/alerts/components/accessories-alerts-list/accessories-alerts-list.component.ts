import { Component, OnInit, OnDestroy } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { Subject } from 'rxjs';
import { PanelService } from 'src/app/panel/services/panel.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-accessories-alerts-list',
  templateUrl: './accessories-alerts-list.component.html',
  styleUrls: ['./accessories-alerts-list.component.scss']
})
export class AccessoriesAlertsListComponent implements OnInit, OnDestroy {

  public alerts:Alert[] = [];
  public rowHeight: number = 38;
  public defaultColDef:any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  strSearched: string = '';
  options = new Array(
    { id:'ALERTS', name:"Alertas"},
    { id:'ALERTS-ACCESSORIES', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-ACCESSORIE-CREATE', name:"Crear Alertas Seguridad Vehicular"},
  );

  constructor(
    private AlertService: AlertService,
    public panelService: PanelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show('loadingAccesoriesAlertsSpinner');

    this.dtOptions = {
      "paging": false,
      "searching": false,
      "info": false
    };
    this.loadData();
  }

  public async loadData(){
    this.spinner.show('loadingAccesoriesAlertsSpinner');
    this.alerts = await this.AlertService.getAlertsByType('accessories');
    this.spinner.hide('loadingAccesoriesAlertsSpinner');
    // this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.AlertService.clearDataByType();
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  //show name label
  showname(item:any) {
    //is true
    if (item.bol_mostrar_nombre) {
        //show
        $('div.label' + item.imei).css('opacity', 1);
    } else {
        //hide
        $('div.label' + item.imei).css('opacity', 0);
    }
  }

  edit(id:string){
    let alert = this.alerts.find( (alert: Alert) => alert.id == id);
    this.AlertService.alertEdit = alert;

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = "ALERTS-ACCESSORIE-EDIT";
    this.panelService.nombreCabecera =   "Alerta Seguridad Vehicular";
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
    }else {
      this.alerts = this.AlertService.getDataByType().filter( (alert:any)  => {
        return (alert.nombre??'').toLowerCase().match(this.strSearched.toLowerCase()) 
          || (alert.tipo??'').toLowerCase().match(this.strSearched.toLowerCase());
      });
    }
  }




}
