import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TabService } from 'src/app/panel/services/tab.service';
import { AuditmapComponent } from '../auditmap/auditmap.component';
import { AuditresultComponent } from '../auditresult/auditresult.component';

interface Data {
	show: boolean;
  ip_address: string;
  properties: string;
  subject_type: string;
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
  onActivitySelection(data: any): void{this.auditmapComponent.getDataActivity(data);}

  isUnderConstruction: boolean = true;
  displayGroup: boolean = false;
  ip_address: string = "";
  properties: string = "";
  subject_type: string = "";

  constructor(
    private tabService: TabService,
    private titleService: Title,
  ) {
    this.tabService.setCurrentTab('audit-tab');
    this.titleService.setTitle('Auditoría');
  }

  ngOnInit(): void {
  }

  onHideDisplayGroup(event : boolean){

    this.displayGroup = event;
  }
  eventDisplayGroup(event :Data){

    this.displayGroup = event.show;
    this.ip_address = event.ip_address;
    this.properties = event.properties;
    this.subject_type = event.subject_type;
  }

}
