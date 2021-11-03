import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-alert',
  templateUrl: './email-alert.component.html',
  styleUrls: ['./email-alert.component.scss']
})
export class EmailAlertComponent implements OnInit {
  params: any;

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

}
