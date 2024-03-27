import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';
import { DataTablesModule } from "angular-datatables";
import {MultiSelectModule} from 'primeng-lts/multiselect';
import {DropdownModule} from 'primeng-lts/dropdown';
import {CardModule} from 'primeng-lts/card';

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

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from 'ngx-spinner';
import { InputNumberModule } from 'primeng-lts/inputnumber';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { InputTextModule } from 'primeng-lts/inputtext';
import { CalendarModule } from 'primeng-lts/calendar';
import { HasPermissionDirective } from 'src/app/permiss/has-permission.directive';



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
    PlatformAlertsEditComponent,
    HasPermissionDirective
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
    DataTablesModule,
    MultiSelectModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    CalendarModule,
    CardModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
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
    PlatformAlertsEditComponent,
    HasPermissionDirective
  ]
})
export class AlertModule {

 }
