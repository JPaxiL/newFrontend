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
    this.loadData();
    
  }

  public async loadData(){
    this.alerts = await this.AlertService.getAll();
    this.spinner.hide('loadingAlertsSpinner');
  }

  public onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

}
