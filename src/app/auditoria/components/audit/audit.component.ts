import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditmapComponent } from '../auditmap/auditmap.component';
import { AuditresultComponent } from '../auditresult/auditresult.component';

interface Data {
	show: boolean;
  ip_address: string;
  properties: string;
}

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  @ViewChild('subscritionDetails')
  auditresultComponent: AuditresultComponent = new AuditresultComponent;
  onPlanSelection(data:any): void{this.auditresultComponent.getDataResult(data);}

  @ViewChild('subscritionIp')
  auditmapComponent!: AuditmapComponent;
  onActivitySelection(ip_address: any): void{this.auditmapComponent.getIpForActivity(ip_address);}

  isUnderConstruction: boolean = true;
  displayGroup: boolean = false;
  ip_address: string = "";
  properties: string = "";
  constructor() { }

  ngOnInit(): void {
  }

  onHideDisplayGroup(event : boolean){

    this.displayGroup = event;
  }
  eventDisplayGroup(event :Data){

    this.displayGroup = event.show;
    this.ip_address = event.ip_address;
    this.properties = event.properties;
  }

}
