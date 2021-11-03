import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-alert',
  templateUrl: './system-alert.component.html',
  styleUrls: ['./system-alert.component.scss']
})
export class SystemAlertComponent implements OnInit {
  params: any;

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

}
