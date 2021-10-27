import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuthInterceptor} from './vehicles/services/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';


import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AuthState } from './core/store/auth.state';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { NavbarComponent } from './panel/components/navbar/navbar.component';
import { SidebarComponent } from './panel/components/sidebar/sidebar.component';
import { MapareaComponent } from './panel/components/maparea/maparea.component';
import { PanelConfComponent } from './panel/components/panel-conf/panel-conf.component';
import { VehiclesComponent } from './vehicles/components/vehicles/vehicles.component';
import { VehicleComponent } from './vehicles/components/vehicle/vehicle.component';
import { SessionComponent } from './vehicles/components/session/session.component';
import { MapComponent } from './vehicles/components/map/map.component';
import { PanelHistorialComponent } from './historial/components/panel-historial/panel-historial.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelMonitoreoComponent } from './panel/components/panel-monitoreo/panel-monitoreo.component';
import { PanelGeopointsComponent } from './geopoints/components/panel-geopoints/panel-geopoints.component';
import { PanelVehiclesComponent } from './vehicles/components/panel-vehicles/panel-vehicles.component';
import { EyeHeaderComponent } from './vehicles/components/eye-header/eye-header.component';
import { LimitHeaderComponent } from './vehicles/components/limit-header/limit-header.component';
import { FollowHeaderComponent } from './vehicles/components/follow-header/follow-header.component';
import { TransmissionHeaderComponent } from './vehicles/components/transmission-header/transmission-header.component';
import { TagHeaderComponent } from './vehicles/components/tag-header/tag-header.component';
import { SettingHeaderComponent } from './vehicles/components/setting-header/setting-header.component';
import { EyeComponent } from './vehicles/components/eye/eye.component';
import { GpsHeaderComponent } from './vehicles/components/gps-header/gps-header.component';
import { GsmHeaderComponent } from './vehicles/components/gsm-header/gsm-header.component';
import { MapViewComponent } from './map/components/map-view/map-view.component';
import { TransmissionComponent } from './vehicles/components/transmission/transmission.component';
import { GpsComponent } from './vehicles/components/gps/gps.component';
import { GsmComponent } from './vehicles/components/gsm/gsm.component';
import { SettingComponent } from './vehicles/components/setting/setting.component';
import { TagComponent } from './vehicles/components/tag/tag.component';
import { FollowComponent } from './vehicles/components/follow/follow.component';
import { VehicleHeaderComponent } from './vehicles/components/vehicle-header/vehicle-header.component';


import { AlertModule } from './alerts/alert.module';
import { CommonModule } from '@angular/common';
import { PanelAlertsComponent } from './alerts/components/panel-alerts/panel-alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    MapareaComponent,
    PanelConfComponent,
    VehiclesComponent,
    VehicleComponent,
    SessionComponent,
    MapComponent,
    PanelHistorialComponent,
    PanelMonitoreoComponent,
    PanelGeopointsComponent,
    PanelVehiclesComponent,
    EyeHeaderComponent,
    LimitHeaderComponent,
    FollowHeaderComponent,
    TransmissionHeaderComponent,
    TagHeaderComponent,
    SettingHeaderComponent,
    EyeComponent,
    GpsHeaderComponent,
    GsmHeaderComponent,
    MapViewComponent,
    TransmissionComponent,
    GpsComponent,
    GsmComponent,
    SettingComponent,
    TagComponent,
    FollowComponent,
    VehicleHeaderComponent,
    PanelAlertsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgxsModule.forRoot([AuthState]),
    AlertModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxsStoragePluginModule.forRoot({
      key: ['auth.token', 'auth.access_token', 'auth.name', 'auth.expires_in', 'auth.refresh_token']
    }),
    BrowserAnimationsModule,
    AgGridModule.withComponents([
      EyeComponent,
      TagHeaderComponent,
      FollowHeaderComponent,
      EyeHeaderComponent,
      LimitHeaderComponent,
      TransmissionHeaderComponent,
      SettingHeaderComponent,
      VehicleComponent,
      GpsHeaderComponent,
      GsmHeaderComponent,
      SettingComponent,
      GpsComponent,
      GsmComponent,
      TagComponent,
      FollowComponent,
      VehicleHeaderComponent
    ])

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
