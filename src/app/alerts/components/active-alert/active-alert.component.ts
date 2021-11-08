import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-alert',
  templateUrl: './active-alert.component.html',
  styleUrls: ['./active-alert.component.scss']
})
export class ActiveAlertComponent implements OnInit {
  params: any;
  activo:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
    this.activo = (this.params.value.activo.toLowerCase() === 'true');
  }
}
