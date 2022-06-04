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
      if(this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width < 0.275 * window.innerWidth) { 
        $('#panelMonitoreo').css("width", 0.275 * window.innerWidth);
      } else if (this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width > 0.725 * window.innerWidth) {
        $('#panelMonitoreo').css("width", 0.725 * window.innerWidth);
      }
    }, true);

    /* Redimiensionar en drag */
    $('#dragbar').on('mousedown touchstart gesturestart', function(e:any){
      $('#dragbar').addClass('dragging');
      e.preventDefault();  
      $(document).on('mousemove touchmove gesturechange', function(e:any){
        if(e.originalEvent.touches){
          $('#panelMonitoreo').css("width",(e.targetTouches[0].pageX<0.275 * window.innerWidth? 0.275 * window.innerWidth + 2: (e.targetTouches[0].pageX> 0.725 * window.innerWidth? 0.725 * window.innerWidth + 2: e.targetTouches[0].pageX + 2)));
        } else {
          $('#panelMonitoreo').css("width",(e.pageX<0.275 * window.innerWidth? 0.275 * window.innerWidth + 2: (e.pageX> 0.725 * window.innerWidth? 0.725 * window.innerWidth + 2: e.pageX + 2)));
        }
     });
    });
    $(document).on('mouseup touchend gestureend', function(e:any){
      $('#dragbar').removeClass('dragging');
      $(document).unbind('mousemove touchmove gesturechange');
    });

  }

  clickHidePanel(): void {
    $("#panelMonitoreo").hide( "slow" );
    this.panelService.nombreComponente = '';
  }

}