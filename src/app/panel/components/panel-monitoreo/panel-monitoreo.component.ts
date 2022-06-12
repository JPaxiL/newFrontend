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
    const dragbarToggleWidth = 20; /* 16 margen del elemento + 4 */ 
    /* Redimensionar panel en window resize */
    window.addEventListener('resize', function(e: any) {
      if(this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width < 0.275 * window.innerWidth) { 
        $('#panelMonitoreo').css("width", 0.275 * window.innerWidth);
      } else if (this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width > 0.725 * window.innerWidth) {
        $('#panelMonitoreo').css("width", 0.725 * window.innerWidth);
      }
    }, true);

    /* Redimiensionar panel en drag */
    $('#dragbar > div').on('mousedown touchstart gesturestart', function(e:any){
      $('#dragbar').addClass('dragging');
      e.preventDefault();  
      $(document).on('mousemove touchmove gesturechange', function(e:any){
        if(e.originalEvent.touches){
          $('#panelMonitoreo').css("width",(e.targetTouches[0].pageX - dragbarToggleWidth < 0.275 * window.innerWidth? 0.275 * window.innerWidth - dragbarToggleWidth: (e.targetTouches[0].pageX - dragbarToggleWidth > 0.725 * window.innerWidth? 0.725 * window.innerWidth - dragbarToggleWidth: e.targetTouches[0].pageX - dragbarToggleWidth)));
        } else {
          $('#panelMonitoreo').css("width",(e.pageX - dragbarToggleWidth < 0.275 * window.innerWidth? 0.275 * window.innerWidth - dragbarToggleWidth: (e.pageX - dragbarToggleWidth > 0.725 * window.innerWidth? 0.725 * window.innerWidth - dragbarToggleWidth: e.pageX - dragbarToggleWidth)));
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