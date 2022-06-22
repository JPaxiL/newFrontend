import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-panel-alerts',
  templateUrl: './panel-alerts.component.html',
  styleUrls: ['./panel-alerts.component.scss']
})
export class PanelAlertsComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show('loadingAlertsSpinner');
  }

}
