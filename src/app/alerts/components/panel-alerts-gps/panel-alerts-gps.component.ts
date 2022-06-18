import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PanelService } from 'src/app/panel/services/panel.service';

declare var $: any;

@Component({
  selector: 'app-panel-alerts-gps',
  templateUrl: './panel-alerts-gps.component.html',
  styleUrls: ['./panel-alerts-gps.component.scss']
})
export class PanelAlertsGpsComponent implements OnInit {
  options = new Array(
    { id:'ALERTS', name:"Alertas"},
    { id:'ALERTS-GPS', name:"Alertas GPS"},
    { id:'ALERTS-GPS-CREATE', name:"Alertas GPS"},
  );

  constructor(
    public panelService: PanelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show('loadingGPSAlertsSpinner');
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

}
