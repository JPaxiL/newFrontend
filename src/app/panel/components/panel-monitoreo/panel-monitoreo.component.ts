import { Component, Input, OnInit } from '@angular/core';
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

    /* Redimensionar el window resize */
    window.addEventListener('resize', function(e: any) {
      if(this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width < 0.25 * window.innerWidth) { 
        $('#panelMonitoreo').css("width", 0.25 * window.innerWidth);
      } else if (this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width > 0.75 * window.innerWidth) {
        $('#panelMonitoreo').css("width", 0.75 * window.innerWidth);
      }
    }, true);

    /* Redimiensionar en drag */
    $('#dragbar').mousedown(function(e:any){
      e.preventDefault();
      $(document).mousemove(function(e:any){
        $('#dragbar').addClass('dragging');
        $('#panelMonitoreo').css("width",(e.pageX<0.25 * window.innerWidth? 0.25 * window.innerWidth + 2: (e.pageX> 0.75 * window.innerWidth? 0.75 * window.innerWidth + 2: e.pageX + 2)));
     });
    });
    $(document).mouseup(function(e:any){
      $('#dragbar').removeClass('dragging');
      $(document).unbind('mousemove');
    });

  }

  clickHidePanel(): void {
    $("#panelMonitoreo").hide( "slow" );
    this.panelService.nombreComponente = '';
  }

}