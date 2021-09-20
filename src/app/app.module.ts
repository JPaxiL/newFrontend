import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './panel/components/navbar/navbar.component';
import { SidebarComponent } from './panel/components/sidebar/sidebar.component';
import { MapareaComponent } from './panel/components/maparea/maparea.component';
import { PanelConfComponent } from './panel/components/panel-conf/panel-conf.component';
import { VehiclesComponent } from './vehicles/components/vehicles/vehicles.component';
import { VehicleComponent } from './vehicles/components/vehicle/vehicle.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    MapareaComponent,
    PanelConfComponent,
    VehiclesComponent,
    VehicleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
