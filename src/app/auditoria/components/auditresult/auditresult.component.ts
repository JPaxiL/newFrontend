import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { replace } from 'lodash';
import * as XLSX from 'xlsx';

interface Activity {
	id?: number;
	description: string;
  ip_address: string;
  properties: string;
  subject_type: string;
}
interface Data {
	show: boolean;
  ip_address: string;
  properties: string;
  subject_type: string;
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
  ACTIVITIES_EXCEL: Activity[] = [];
  page = 1;
	pageSize = 25;
	collectionSize = this.ACTIVITIES.length;
  activities: Activity[] = [];
  activities_excel: Activity[] = [];
  tableCount = (this.page - 1) * this.pageSize;

  searchTerm:string = "";

  loadActivities = false;
  

  constructor() { 
  }

  ngOnInit(): void {
  }

  getDataResult(data: any){

    this.ACTIVITIES = data;
    this.activities = this.ACTIVITIES;
    this.collectionSize = this.ACTIVITIES.length;
    
    this.ACTIVITIES_EXCEL = JSON.parse(JSON.stringify(data));
    this.activities_excel = this.ACTIVITIES_EXCEL;
    this.activities_excel.forEach(activity_excel => {
      activity_excel.description = activity_excel.description.replace(/<[^>]*>?/g, '');
    });

    this.refreshActivity();

    this.loadActivities = true;
  }

  refreshActivity() {

    let term = this.searchTerm.toLocaleLowerCase();
    this.activities = this.ACTIVITIES.filter(function(tag) {
        return tag.description.toLocaleLowerCase().indexOf(term) >= 0;
    });

    this.activities_excel = this.ACTIVITIES_EXCEL.filter(function(tag_excel) {
      return tag_excel.description.toLocaleLowerCase().indexOf(term) >= 0;
  });

    this.collectionSize = this.activities.length;

    this.tableCount = (this.page - 1) * this.pageSize;
		this.activities = this.activities.map((activity, i) => ({ id: i + 1, ...activity })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);

	}

  onClickGroup(ip_address: string, properties: string, subject_type: string){

    if(subject_type){

      let subject_type_split = subject_type.split(/[\\]/g);
      this.eventDisplayGroup.emit({show: true, ip_address, properties, subject_type: subject_type_split[subject_type_split.length - 1]});
    }else{
      this.eventDisplayGroup.emit({show: true, ip_address, properties, subject_type: ''});
    }
  }

  onShowLocation(ip_address: string){

    this.selectedActivityEvent.emit(ip_address);
  }

  exportexcel(): void
  {
    
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    XLSX.writeFile(wb, 'Log.xlsx');
 
  }
 

  

}
