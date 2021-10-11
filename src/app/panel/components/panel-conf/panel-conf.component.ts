import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-panel-conf',
  templateUrl: './panel-conf.component.html',
  styleUrls: ['./panel-conf.component.scss']
})
export class PanelConfComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $(document).ready(function() {
        $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });
    });



  }

}
