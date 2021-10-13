import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gsm',
  templateUrl: './gsm.component.html',
  styleUrls: ['./gsm.component.scss']
})
export class GsmComponent implements OnInit {

  private params: any;

  constructor() { }

  ngOnInit(): void {
  }
  agInit(params: any){
    this.params = params;
  }
}
