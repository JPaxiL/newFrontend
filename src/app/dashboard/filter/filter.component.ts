import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  constructor() { }

  dateFrom!:Date;
  dateTo!:Date;
  today!: Date;
  strYearRange = "";

  ngOnInit(): void {
    this.today = new Date();
    this.strYearRange = '2010:' + new Date().getFullYear();
    this.dateFrom = new Date(moment(Date.now()).format("MM/DD/YYYY"));
    this.dateTo = this.dateFrom;

  }

  onTimeChange(){
    console.log("onTimeChange");
  }

  validateForm(){
    console.log("validateForm");
  }

}
