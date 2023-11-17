import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import {AuthInterceptor} from './vehicles/services/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { TreeTableModule } from 'primeng-lts/treetable';
import { DialogModule } from 'primeng-lts/dialog';
import { DropdownModule } from 'primeng-lts/dropdown';
import { InputTextModule } from 'primeng-lts/inputtext';
import { InputNumberModule } from 'primeng-lts/inputnumber';
import {ConfirmDialogModule} from 'primeng-lts/confirmdialog';
import {ConfirmationService} from 'primeng-lts/api';
import {SelectButtonModule} from 'primeng-lts/selectbutton';
import {RadioButtonModule} from 'primeng-lts/radiobutton';
import {PickListModule} from 'primeng-lts/picklist';
import {ListboxModule} from 'primeng-lts/listbox';
import {CardModule} from 'primeng-lts/card';
import {CheckboxModule} from 'primeng-lts/checkbox';
import {MultiSelectModule} from 'primeng-lts/multiselect';
import {CalendarModule} from 'primeng-lts/calendar';
import {ToggleButtonModule} from 'primeng-lts/togglebutton';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import { TableModule } from 'primeng-lts/table';
import { PanelModule } from 'primeng-lts/panel';
import { BadgeModule } from 'primeng-lts/badge';
import { SliderModule } from 'primeng-lts/slider';
import { OverlayPanelModule } from 'primeng-lts/overlaypanel';
import { TagModule } from 'primeng-lts/tag';
import { TooltipModule } from 'primeng-lts/tooltip';
import {SlideMenuModule} from 'primeng-lts/slidemenu';
import {SidebarModule} from 'primeng-lts/sidebar';
import {ScrollPanelModule} from 'primeng-lts/scrollpanel';
import {GalleriaModule} from 'primeng-lts/galleria';
// import { LeafletMarkerClusterModule } from '../../../leaflet-markercluster/leaflet-markercluster.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import {CarouselModule} from 'primeng-lts/carousel';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';

import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxSpinnerModule } from 'ngx-spinner';

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
import { PanelHistorialGraficoComponent } from './historial/components/panel-historial-grafico/panel-historial-grafico.component';


import { AlertModule } from './alerts/alert.module';
import { CommonModule } from '@angular/common';
import { PanelAlertsComponent } from './alerts/components/panel-alerts/panel-alerts.component';
import { TreeTableComponent } from './vehicles/components/tree-table/tree-table.component';
import { VehicleConfigComponent } from './vehicles/components/vehicle-config/vehicle-config.component';
import { GeocercaAddComponent } from './geofences/components/geocerca-add/geocerca-add.component';
import { GeocercaListsComponent } from './geofences/components/geocerca-lists/geocerca-lists.component';
import { GeocercaMainComponent } from './geofences/components/geocerca-main/geocerca-main.component';
import { VehicleGroupComponent } from './vehicles/components/vehicle-group/vehicle-group.component';
import { ReportComponent } from './reports/components/report/report.component';
import { FormComponent } from './reports/components/form/form.component';
import { ResultComponent } from './reports/components/result/result.component';
import { EventBoardComponent } from './events/components/event-board/event-board.component';
import { EventListComponent } from './events/components/event-list/event-list.component';
import { AddGeopointsComponent } from './geopoints/components/add-geopoints/add-geopoints.component';
import { ListGeopointsComponent } from './geopoints/components/list-geopoints/list-geopoints.component';

import { DataTablesModule } from 'angular-datatables';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { AreagraphsComponent } from './dashboard2/areagraphs/areagraphs.component';
import { ModalComponent } from './reports/components/modal/modal.component';
import { UserConfigComponent } from './profile-config/user-config/user-config.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PanalDashboardComponent } from './dashboard2/components/panal-dashboard/panal-dashboard.component';
import { AuditComponent } from './auditoria/components/audit/audit.component';
import { AuditformComponent } from './auditoria/components/auditform/auditform.component';
import { AuditresultComponent } from './auditoria/components/auditresult/auditresult.component';

import { SubcuentasComponent } from './subcuentas/subcuentas.component';
import { SubcuentasListComponent } from './subcuentas/components/subcuentas-list/subcuentas-list.component';
import { SubcuentasPanelComponent } from './subcuentas/components/subcuentas-panel/subcuentas-panel.component';
import { SubcuentasModalComponent } from './subcuentas/components/subcuentas-modal/subcuentas-modal.component';
import { AuditdetailComponent } from './auditoria/components/auditdetail/auditdetail.component';
import { AuditmapComponent } from './auditoria/components/auditmap/auditmap.component';
import { AuditInfoActivityComponent } from './auditoria/components/auditdetail/audit-info-activity/audit-info-activity.component';
import { NotFoundComponent } from './panel/not-found/not-found.component';
import { GeocercaCircularMainComponent } from './geofences/components/geocerca-circular-main/geocerca-circular-main.component';
import { GeocercaCircularAddComponent } from './geofences/components/geocerca-circular-add/geocerca-circular-add.component';
import { GeocercaCircularListsComponent } from './geofences/components/geocerca-circular-lists/geocerca-circular-lists.component';
import { GeocercaPolylineMainComponent } from './geofences/components/geocerca-polyline-main/geocerca-polyline-main.component';
import { GeocercaPolylineAddComponent } from './geofences/components/geocerca-polyline-add/geocerca-polyline-add.component';
import { GeocercaPolylineListsComponent } from './geofences/components/geocerca-polyline-lists/geocerca-polyline-lists.component';
import { DriversListComponent } from './drivers/components/drivers-list/drivers-list.component';
import { DriversPanelComponent } from './drivers/components/drivers-panel/drivers-panel.component';
import { DriversModalComponent } from './drivers/components/drivers-modal/drivers-modal.component';
import { GridComponent } from './multiview/grid/grid.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogComponent } from './multiview/dialog/dialog.component';
import { DragItemComponent } from './multiview/drag-item/drag-item.component';
import { PreviewComponent } from './multiview/preview/preview.component';
import { ScreenViewComponent } from './multiview/screen-view/screen-view.component';
import { MinimapComponent } from './multiview/minimap/minimap.component';
import { PanelHistorialRecorridoModalComponent } from './historial/components/panel-historial-recorrido-modal/panel-historial-recorrido-modal.component';
import { AlphaNumericDashDirective } from './directives/alpha-numeric-dash.directive';
import { ScreenRecorderComponent } from './multiview/screen-recorder/screen-recorder.component';
import { CipiaComponent } from './cipia/cipia.component';
import { FootbarComponent } from './panel/components/footbar/footbar.component';
import { EventPopupComponent } from './events/components/event-popup/event-popup.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { DriversHistoryComponent } from './drivers/components/drivers-history/drivers-history.component';

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
    PanelHistorialGraficoComponent,
    PanelAlertsComponent,
    TreeTableComponent,
    VehicleConfigComponent,
    DashboardComponent,
    GeocercaAddComponent,
    GridComponent,
    GeocercaListsComponent,
    GeocercaMainComponent,
    VehicleGroupComponent,
    ReportComponent,
    FormComponent,
    ResultComponent,
    EventBoardComponent,
    EventListComponent,
    AddGeopointsComponent,
    ListGeopointsComponent,
    ModalComponent,
    UserConfigComponent,
    Dashboard2Component,
    AreagraphsComponent,
    PanalDashboardComponent,
    AuditComponent,
    AuditresultComponent,
    AuditformComponent,
    SubcuentasComponent,
    SubcuentasListComponent,
    SubcuentasPanelComponent,
    SubcuentasModalComponent,
    AuditformComponent,
    AuditresultComponent,
    AuditdetailComponent,
    AuditmapComponent,
    AuditInfoActivityComponent,
    NotFoundComponent,
    GeocercaCircularMainComponent,
    GeocercaCircularAddComponent,
    GeocercaCircularListsComponent,
    GeocercaPolylineMainComponent,
    GeocercaPolylineAddComponent,
    GeocercaPolylineListsComponent,
    DriversListComponent,
    DriversPanelComponent,
    DriversModalComponent,
    DialogComponent,
    DragItemComponent,
    PreviewComponent,
    ScreenViewComponent,
    MinimapComponent,
    PanelHistorialRecorridoModalComponent,
    AlphaNumericDashDirective,
    ScreenRecorderComponent,
    CipiaComponent,
    FootbarComponent,
    EventPopupComponent,
    CarouselComponent,
    DriversHistoryComponent
  ],
  imports: [
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-right',
      maxOpened: 4,
      autoDismiss: true,
    }),
    RouterModule, 
    BrowserModule,
    DataTablesModule,
    CommonModule,
    NgxSpinnerModule,
    NgxsModule.forRoot([AuthState]),
    AlertModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    NgSelectModule,
    TreeTableModule,
    DropdownModule,
    DialogModule,
    ScrollPanelModule,
    InputTextModule,
    InputSwitchModule,
    TableModule,
    NgbModule,
    SliderModule,
    ToggleButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    SelectButtonModule,
    RadioButtonModule,
    PickListModule,
    ListboxModule,
    CardModule,
    BadgeModule,
    CheckboxModule,
    OverlayPanelModule,
    TagModule,
    TooltipModule,
    MultiSelectModule,
    CalendarModule,
    SlideMenuModule,
    GalleriaModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    SidebarModule,
    CarouselModule,
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
    ]),
    NgxChartsModule
  ],
  providers: [
    ConfirmationService,
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
