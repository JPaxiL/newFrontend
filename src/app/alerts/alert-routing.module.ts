import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertGpsComponent } from './components/alert-gps/alert-gps.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';

const routesAlerts: Routes = [
  {
    path: 'alerts/list',
    component: AlertListComponent
  },
  {
    path: 'alerts/gps',
    component: AlertGpsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesAlerts)],
  exports: [RouterModule]
})
export class AlertRoutingModule { }
