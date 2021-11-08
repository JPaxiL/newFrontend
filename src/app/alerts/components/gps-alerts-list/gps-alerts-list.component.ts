import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent,  ColumnApi } from 'ag-grid-community';
import { Alert } from '../../models/alert.interface';
import { ActiveAlertComponent } from '../active-alert/active-alert.component';
import { EmailAlertComponent } from '../email-alert/email-alert.component';
import { SystemAlertComponent } from '../system-alert/system-alert.component';
import { AlertService } from '../../../alerts/service/alert.service';
import { ActionsAlertComponent } from '../actions-alert/actions-alert.component';

@Component({
  selector: 'app-gps-alerts-list',
  templateUrl: './gps-alerts-list.component.html',
  styleUrls: ['./gps-alerts-list.component.scss']
})
export class GpsAlertsListComponent implements OnInit {

  public alerts:Alert[] = [];
  public rowHeight: number = 38;
  public api: GridApi = new GridApi();
  public columnApi: ColumnApi = new ColumnApi();
  public defaultColDef:any = [];

  columnDefs: ColDef[] = [
    {headerName: 'Nº', field: 'id', resizable: true, width: 60, minWidth: 40, maxWidth: 90, wrapText: true},
    { headerName: 'Nombre', field: 'nombre', wrapText: true, resizable: true,  width: 150, minWidth: 110, maxWidth: 90},
    { headerName: 'Tipo', field: 'tipo', resizable: true, wrapText: true,width: 150},
    { headerName: 'Activos', field: 'activo_bol', resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: ActiveAlertComponent},
    { headerName: 'Sistema', field: 'sonido_sistema_bol', resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: SystemAlertComponent},
    { headerName: 'E-Mail', field: 'notificacion_email_bol', resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: EmailAlertComponent},
    { icons: {
        menu: '<i class="fa fa-wrench fa-lg"></i>',
        filter: '<i class="fa fa-wrench fa-lg"></i>',
        columns: '<i class="fa fa-wrench fa-lg"></i>',
        sortAscending: '<i class="fa fa-sort-alpha-up"/>',
        sortDescending: '<i class="fa fa-sort-alpha-down"/>',
      },
    resizable: true, wrapText: true,width: 150, valueGetter: params=>{return params.data}, cellRendererFramework: ActionsAlertComponent},
  ];

  constructor(private AlertService: AlertService) { }

  ngOnInit(): void {
    this.loadData();
  }

   public async loadData(){
    this.alerts = await this.AlertService.getAlertsByType('gps');
  }

  public onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

}
