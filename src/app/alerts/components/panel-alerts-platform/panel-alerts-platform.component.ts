import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PanelService } from 'src/app/panel/services/panel.service';

declare var $: any;

@Component({
  selector: 'app-panel-alerts-platform',
  templateUrl: './panel-alerts-platform.component.html',
  styleUrls: ['./panel-alerts-platform.component.scss']
})
export class PanelAlertsPlatformComponent implements OnInit {
  options = new Array(
    { id:'ALERTS-PLATFORM-CREATE', name:"Alertas Plataforma"},
  );

  constructor(
    private panelService: PanelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show('loadingPlatformAlertsSpinner');
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

}
