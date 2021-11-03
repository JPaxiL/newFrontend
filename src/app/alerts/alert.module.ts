import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';

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

@NgModule({
  declarations: [
    AlertListComponent,
    ActiveAlertComponent,
    SystemAlertComponent,
    EmailAlertComponent,
    PanelAlertsGpsComponent,
    GpsAlertsListComponent,
    GpsAlertsCreateComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlertRoutingModule,
    AgGridModule,
    Select2Module
  ],
  exports:[
    AlertListComponent,
    ActiveAlertComponent,
    PanelAlertsGpsComponent,
    GpsAlertsListComponent,
    GpsAlertsCreateComponent
  ]
})
export class AlertModule {

 }
