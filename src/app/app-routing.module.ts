import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PanelConfComponent } from './panel/components/panel-conf/panel-conf.component';
import { VehiclesComponent } from './vehicles/components/vehicles/vehicles.component';
import { SessionComponent } from './vehicles/components/session/session.component';
import { AuthGuard } from './core/guards/auth.guard';

//import { AuthGuard } from './vehicles/services/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }, 
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) , canActivate: [AuthGuard]},

  {
    path: 'panel',
    component: PanelConfComponent
  },
  {
    path: 'vehicles',
    canActivate: [ AuthGuard ],
    component: VehiclesComponent },
  {
    path: 'session',
    component: SessionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
