import { Alert } from './../../models/alert.interface';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from '../../../alerts/service/alert.service';
import { ColDef, GridApi, GridReadyEvent,  ColumnApi } from 'ag-grid-community';
import { ActiveAlertComponent } from '../active-alert/active-alert.component';
import { SystemAlertComponent } from '../system-alert/system-alert.component';
import { EmailAlertComponent } from '../email-alert/email-alert.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PanelService } from 'src/app/panel/services/panel.service';


@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {

  public alerts:Alert[] = [];
  public rowHeight: number = 38;
  public api: GridApi = new GridApi();
  public columnApi: ColumnApi = new ColumnApi();
  public defaultColDef:any = [];
  public strSearched: string = '';
  public noResults: boolean = false;
  public isRowDataEmpty: boolean = false;

  panelAlertKey: Number = 0;
  panelAlertBeforeOpening: Number = 0;

  columnDefs: ColDef[] = [
    {headerName: 'Nº', field: 'nr', resizable: true, width: 60, minWidth: 40, maxWidth: 90, wrapText: true},
    { headerName: 'Nombre', field: 'nombre', wrapText: true, resizable: true,  width: 150, minWidth: 110, maxWidth: 90},
    { headerName: 'Tipo', field: 'tipo', resizable: true, wrapText: true,width: 150},
    { headerName: 'Activos', field: 'activo_bol', resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: ActiveAlertComponent},
    { headerName: 'Sistema', field: 'sonido_sistema_bol', resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: SystemAlertComponent},
    { headerName: 'E-Mail', field: 'notificacion_email_bol', resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: EmailAlertComponent},
  ];

  constructor(
    private AlertService: AlertService, 
    private spinner: NgxSpinnerService,
    public panelService: PanelService,
  ) { }


  ngOnInit(): void {
    this.panelAlertBeforeOpening = this.AlertService.panelAlertKey;
    this.panelAlertKey = + new Date();
    this.AlertService.panelAlertKey = this.panelAlertKey;
    this.spinner.show('loadingAlertsSpinner');
    this.loadData();
  }

  ngOnDestroy(){
    this.panelAlertKey = 0;
    //this.AlertService.clearDataAll();
  }

  public async loadData(){
    console.log("Loading alerts in Alert-list");
    
    this.alerts = await this.AlertService.getAll();
    this.isRowDataEmpty = this.alerts.length == 0; 
    if(this.AlertService.panelAlertKey == this.panelAlertKey){
      this.spinner.hide('loadingAlertsSpinner');
    }
  }

  public onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  public onSearch(){
    if(this.strSearched == ''){
      this.alerts = this.AlertService.getDataAll();
      this.noResults = false;
    }else {
      this.alerts = this.AlertService.getDataAll().filter( (alert:any)  => {
        return (alert.nombre??'').toLowerCase().match(this.strSearched.toLowerCase()) 
          || (alert.tipo??'').toLowerCase().match(this.strSearched.toLowerCase());
      });
      this.noResults = this.alerts.length == 0;
    }
  }

}
