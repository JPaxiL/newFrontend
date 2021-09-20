import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelConfComponent } from './panel/components/panel-conf/panel-conf.component';
import { VehiclesComponent } from './vehicles/components/vehicles/vehicles.component';

const routes: Routes = [
  {
    path: 'panel',
    component: PanelConfComponent

  },
  {
    path: 'vehicles',
    component: VehiclesComponent

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
