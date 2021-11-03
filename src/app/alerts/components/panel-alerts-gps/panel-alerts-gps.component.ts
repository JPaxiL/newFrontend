import { Component, OnInit } from '@angular/core';
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
    { id:'ALERTS-GPS', name:"Alertas Gps"},
    { id:'ALERTS-GPS-CREATE', name:"Alertas Gps"},
  );

  constructor(public panelService: PanelService) { }

  ngOnInit(): void {
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

}
