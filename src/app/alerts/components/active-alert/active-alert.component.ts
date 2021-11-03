import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-alert',
  templateUrl: './active-alert.component.html',
  styleUrls: ['./active-alert.component.scss']
})
export class ActiveAlertComponent implements OnInit {
  params: any;

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }
}
