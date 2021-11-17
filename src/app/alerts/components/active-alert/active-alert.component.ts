import { Alert } from './../../models/alert.interface';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-alert',
  templateUrl: './active-alert.component.html',
  styleUrls: ['./active-alert.component.scss']
})
export class ActiveAlertComponent implements OnInit {
  @Input() alert:any;
  params: any;
  activo:boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.activo = (this.alert.activo.toLowerCase() === 'true');
  }

  agInit(params: any){
    this.params = params;
    this.activo = (this.params.value.activo.toLowerCase() === 'true');
  }
}
