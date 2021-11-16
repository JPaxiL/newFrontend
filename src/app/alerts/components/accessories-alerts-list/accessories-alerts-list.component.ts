import { Component, OnInit, OnDestroy } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { Subject } from 'rxjs';
import { PanelService } from 'src/app/panel/services/panel.service';

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

  constructor(
    private AlertService: AlertService,
    private panelService: PanelService
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      "paging": false,
      "searching": false,
      "info": false
    };
    this.loadData();
  }

  public async loadData(){
    this.alerts = await this.AlertService.getAlertsByType('accessories');
    // this.dtTrigger.next();
  }

  ngOnDestroy(): void {
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
    this.panelService.nombreCabecera =   "Alerta Accesorio";
  }

}
