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
    var clickDistanceFromDragbar: number;
    var maxWidth: number;
    var minWidth: number;
    
    /* Redimensionar panel en window resize */
    window.addEventListener('resize', function(e: any) {
      minWidth = 425;
      if(window.innerWidth > 600) {
        maxWidth = 0.725 * window.innerWidth < 800? 0.725 * window.innerWidth: 800;
      } else {
        maxWidth = minWidth;
      }

      if(this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width < minWidth) {
        $('#panelMonitoreo').css("width", minWidth);
      } 
      else if(this.document.getElementById('panelMonitoreo')!.getBoundingClientRect().width > maxWidth) { 
        $('#panelMonitoreo').css("width", maxWidth);
      }
    }, true);

    /* Redimiensionar panel en drag */
    $('#dragbar > div').on('mousedown touchstart gesturestart', function(e:any){
      minWidth = 425;
      if(window.innerWidth > 600) {
        maxWidth = 0.725 * window.innerWidth < 800? 0.725 * window.innerWidth: 800;
      } else {
        maxWidth = minWidth;
      }

      clickDistanceFromDragbar = e.originalEvent.touches? e.targetTouches[0].pageX - document.getElementById('panelMonitoreo')!.offsetWidth: e.pageX - document.getElementById('panelMonitoreo')!.offsetWidth;

      $('#dragbar').addClass('dragging');
      e.preventDefault();  
      $(document).on('mousemove touchmove gesturechange', function(e:any){
        if(e.originalEvent.touches){
          $('#panelMonitoreo').css("width",(e.targetTouches[0].pageX - clickDistanceFromDragbar < minWidth? minWidth: (e.targetTouches[0].pageX - clickDistanceFromDragbar > maxWidth? maxWidth: e.targetTouches[0].pageX - clickDistanceFromDragbar)));
        } else {
          $('#panelMonitoreo').css("width",(e.pageX - clickDistanceFromDragbar < minWidth? minWidth: (e.pageX - clickDistanceFromDragbar > maxWidth? maxWidth: e.pageX - clickDistanceFromDragbar)));
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