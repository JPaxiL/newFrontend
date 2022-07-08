import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PanelService } from 'src/app/panel/services/panel.service';

declare var $: any;

@Component({
  selector: 'app-panel-alerts-accessories',
  templateUrl: './panel-alerts-accessories.component.html',
  styleUrls: ['./panel-alerts-accessories.component.scss']
})
export class PanelAlertsAccessoriesComponent implements OnInit {
  options = new Array(
    { id:'ALERTS', name:"Alertas"},
    { id:'ALERTS-ACCESSORIES', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-ACCESSORIE-CREATE', name:"Crear Alertas Seguridad Vehicular"},
  );
  constructor(
    public panelService: PanelService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show('loadingAccesoriesAlertsSpinner');
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

}
