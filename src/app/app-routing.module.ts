import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelConfComponent } from './panel/components/panel-conf/panel-conf.component';

const routes: Routes = [
  {
    path: 'panel',
    component: PanelConfComponent

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
