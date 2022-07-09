import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PanelConfComponent } from './panel/components/panel-conf/panel-conf.component';
import { VehiclesComponent } from './vehicles/components/vehicles/vehicles.component';
import { SessionComponent } from './vehicles/components/session/session.component';
import { AuthGuard } from './core/guards/auth.guard';
import { IsLoggedGuard } from './core/guards/islogged.guard';
import { MapComponent } from './vehicles/components/map/map.component';
import { ReportComponent } from './reports/components/report/report.component';
import { ResultComponent } from './reports/components/result/result.component';
import { DashboardComponent } from './dashboard/dashboard.component';
/* import { Dashboard2Component } from './dashboard2/dashboard2.component'; */

// import { AuthGuard } from './vehicles/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canActivate: [IsLoggedGuard],
  },
/*   {
    path: 'dashboard',
    component: Dashboard2Component,
    canActivate: [AuthGuard]
  }, */
  {
    path: 'panel',
    component: PanelConfComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicles',
    // canActivate: [ AuthGuard ],
    component: MapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: ReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports/result',
    component: ResultComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'session',
    component: SessionComponent
  },
  {
    path: '**',
    component: PanelConfComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
