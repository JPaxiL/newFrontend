import { AlertService } from './../../service/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-gps',
  templateUrl: './alert-gps.component.html',
  styleUrls: ['./alert-gps.component.scss']
})
export class AlertGpsComponent implements OnInit {

  constructor(private AlertService:AlertService) { }
  public alerts:any = [];
  ngOnInit(): void {
    // this.loadData();
  }

  public loadData(){
    // this.AlertService.get('alert/gps').subscribe(response => {
    //   this.alerts = response;
    // });
  }
}
