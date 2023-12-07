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
  noResults: boolean = false;
  isRowDataEmpty: boolean = false;

  options = new Array(
    { id:'ALERTS', name:"Alertas"},
    { id:'ALERTS-ACCESSORIES', name:"Alertas 360"},
    { id:'ALERTS-ACCESSORIE-CREATE', name:"Crear Alertas 360"},
    { id:'ALERTS-SECURITY-CREATE', name:"Crear Alerta Seguridad Vehicular"},
    { id:'ALERTS-MOBILE-CREATE', name:"Crear Alerta Solución Móvil"},
    { id:'ALERTS-360-CREATE', name:"Crear Alerta 360"},
  );
  type = ""; //security | mobile | 360
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
    this.type = this.panelService.nombreComponente == "ALERTS-SECURITY"? "security" : (this.panelService.nombreComponente == "ALERTS-MOBILE"? "mobile":"360");
    console.log("TYPE:::: ",this.type);
    
    this.loadData();
  }

  public async loadData(){
    this.spinner.show('loadingAccesoriesAlertsSpinner');
    this.alerts = await this.AlertService.getAlertsByType(this.type);
    this.isRowDataEmpty = this.alerts.length == 0;
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
    if(this.type == "security"){
      this.panelService.nombreComponente = "ALERTS-SECURITY-EDIT";
      this.panelService.nombreCabecera =   "Alerta Seguridad Vehicular";
    }else if(this.type == "mobile"){
      this.panelService.nombreComponente = "ALERTS-MOBILE-EDIT";
      this.panelService.nombreCabecera =   "Alerta Solución Móvil";
    }else{
      this.panelService.nombreComponente = "ALERTS-360-EDIT";
      this.panelService.nombreCabecera =   "Alerta Fatiga 360";
    }
  }

  clickShowPanel(): void {
    console.log("TYPE2:::: ",this.type);
    $("#panelMonitoreo").show( "slow" );
    if(this.type == "security"){;
      this.panelService.nombreComponente = "ALERTS-SECURITY-CREATE";
      this.panelService.nombreCabecera =   "Crear Alerta Seguridad Vehicular";
    }else if(this.type == "mobile"){
      this.panelService.nombreComponente = "ALERTS-MOBILE-CREATE";
      this.panelService.nombreCabecera =   "Crear Alerta Solución Móvil";
    }else{
      this.panelService.nombreComponente = "ALERTS-360-CREATE";
      this.panelService.nombreCabecera =   "Crear Alerta Fatiga 360";
    }
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
