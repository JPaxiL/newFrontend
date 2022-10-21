import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface Activity {
	id?: number;
	description: string;
  ip_address: string;
  properties: string;
}
interface Data {
	show: boolean;
  ip_address: string;
  properties: string;
}

@Component({
  selector: 'app-auditresult',
  templateUrl: './auditresult.component.html',
  styleUrls: ['./auditresult.component.scss']
})
export class AuditresultComponent implements OnInit {

  @Output() eventDisplayGroup = new EventEmitter<Data>();
  @Output() selectedActivityEvent = new EventEmitter<any>();

  ACTIVITIES: Activity[] = [];
  page = 1;
	pageSize = 25;
	collectionSize = this.ACTIVITIES.length;
  activities: Activity[] = [];
  tableCount = (this.page - 1) * this.pageSize;

  searchTerm:string = "";

  loadActivities = false;
  

  constructor() { 
  }

  ngOnInit(): void {
  }

  getDataResult(data: any ){

    this.ACTIVITIES = data;
    this.activities = this.ACTIVITIES;
    this.collectionSize = this.ACTIVITIES.length;

    this.refreshCountries();

    this.loadActivities = true;
  }

  refreshCountries() {

    let term = this.searchTerm.toLocaleLowerCase();
    this.activities = this.ACTIVITIES.filter(function(tag) {
        return tag.description.toLocaleLowerCase().indexOf(term) >= 0;
    });

    this.collectionSize = this.activities.length;

    this.tableCount = (this.page - 1) * this.pageSize;
		this.activities = this.activities.map((activity, i) => ({ id: i + 1, ...activity })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);

    
    
    
	}

  onClickGroup(ip_address: string, properties: string){

    this.eventDisplayGroup.emit({show: true, ip_address, properties});
  }

  onShowLocation(ip_address: string){

    this.selectedActivityEvent.emit(ip_address);
  }
 

  

}
