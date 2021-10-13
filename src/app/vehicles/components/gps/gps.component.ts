import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit {

  /*
  fa-wifi
  fa-wifi-1
  fa-wifi-2
  fa-wifi-off
  */
  private params: any;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

}
