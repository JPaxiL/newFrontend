import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../services/panel.service';

declare var $: any;

@Component({
  selector: 'app-panel-monitoreo',
  templateUrl: './panel-monitoreo.component.html',
  styleUrls: ['./panel-monitoreo.component.scss']
})
export class PanelMonitoreoComponent implements OnInit {

  constructor( public panelService: PanelService ) { }

  ngOnInit(): void {
  }


  clickHidePanel(): void {
    $("#panelMonitoreo").hide( "slow" );
  }

}
