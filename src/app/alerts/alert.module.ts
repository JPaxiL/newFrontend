import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';
import { DataTablesModule } from "angular-datatables";


import { AlertRoutingModule } from './alert-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { ActiveAlertComponent } from './components/active-alert/active-alert.component';
import { SystemAlertComponent } from './components/system-alert/system-alert.component';
import { EmailAlertComponent } from './components/email-alert/email-alert.component';
import { PanelAlertsGpsComponent } from './components/panel-alerts-gps/panel-alerts-gps.component';
import { GpsAlertsListComponent } from './components/gps-alerts-list/gps-alerts-list.component';
import { GpsAlertsCreateComponent } from './components/gps-alerts-create/gps-alerts-create.component';
import { ActionsAlertComponent } from './components/actions-alert/actions-alert.component';
import { PanelAlertsPlatformComponent } from 'src/app/alerts/components/panel-alerts-platform/panel-alerts-platform.component'
import { PlatformAlertsListComponent } from './components/platform-alerts-list/platform-alerts-list.component';
import { PlatformAlertsCreateComponent } from './components/platform-alerts-create/platform-alerts-create.component';
import { PanelAlertsAccessoriesComponent } from './components/panel-alerts-accessories/panel-alerts-accessories.component';
import { AccessoriesAlertsListComponent } from './components/accessories-alerts-list/accessories-alerts-list.component';
import { AlertAccessoriesCreateComponent } from './components/alert-accessories-create/alert-accessories-create.component';
import { AlertAccessoriesEditComponent } from './components/alert-accessories-edit/alert-accessories-edit.component';
import { AlertGpsEditComponent } from './components/alert-gps-edit/alert-gps-edit.component';
import { PlatformAlertsEditComponent } from './components/platform-alerts-edit/platform-alerts-edit.component';



@NgModule({
  declarations: [
    AlertListComponent,
    ActiveAlertComponent,
    SystemAlertComponent,
    EmailAlertComponent,
    PanelAlertsGpsComponent,
    GpsAlertsListComponent,
    GpsAlertsCreateComponent,
    ActionsAlertComponent,
    PanelAlertsPlatformComponent,
    PlatformAlertsListComponent,
    PlatformAlertsCreateComponent,
    PanelAlertsAccessoriesComponent,
    AccessoriesAlertsListComponent,
    AlertAccessoriesCreateComponent,
    AlertAccessoriesEditComponent,
    AlertGpsEditComponent,
    PlatformAlertsEditComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlertRoutingModule,
    AgGridModule,
    Select2Module,
    NgbModule,
    DataTablesModule
  ],
  exports:[
    AlertListComponent,
    ActiveAlertComponent,
    PanelAlertsGpsComponent,
    GpsAlertsListComponent,
    GpsAlertsCreateComponent,
    PanelAlertsPlatformComponent,
    PlatformAlertsListComponent,
    PlatformAlertsCreateComponent,
    PanelAlertsAccessoriesComponent,
    AlertAccessoriesCreateComponent,
    AlertAccessoriesEditComponent,
    AlertGpsEditComponent,
    PlatformAlertsEditComponent
  ]
})
export class AlertModule {

 }
