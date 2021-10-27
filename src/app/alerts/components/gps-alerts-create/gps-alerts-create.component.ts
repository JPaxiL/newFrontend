import { Component, OnInit } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';

@Component({
  selector: 'app-gps-alerts-create',
  templateUrl: './gps-alerts-create.component.html',
  styleUrls: ['./gps-alerts-create.component.scss']
})
export class GpsAlertsCreateComponent implements OnInit {
  public events:any = [];

  public loading:boolean = true;

  constructor(private AlertService: AlertService) { }

  ngOnInit(): void {
    this.loading = false;
    this.loadData();
  }

  public async loadData(){
    this.events = await this.AlertService.getEventsByType('gps');
  }

  onSubmit(){

  }
}
