import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actions-alert',
  templateUrl: './actions-alert.component.html',
  styleUrls: ['./actions-alert.component.scss']
})
export class ActionsAlertComponent implements OnInit {
  params: any;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
    console.log("this.params =======> ", this.params)
  }

}
