import { Component, OnInit,Input, Output, EventEmitter,AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-auditdetail',
  templateUrl: './auditdetail.component.html',
  styleUrls: ['./auditdetail.component.scss']
})
export class AuditdetailComponent implements AfterViewInit{

  @Input('display') display: boolean = false;
  @Input() ip: string = "";
  @Input() properties: string = "";

  @Output() onHideEvent = new EventEmitter<boolean>();

  attributes = {};
  old = {};
  display_old: boolean = false;
  display_new: boolean = false;

  constructor() { 
    
  }

  ngAfterViewInit(): void {
    
  }

  onHide(){
    
    this.onHideEvent.emit(false);
    this.attributes = {};
    this.old = {};
    this.display_new = false;
    this.display_old= false;
  }

  onShow(){
    
    let properties_json = JSON.parse(this.properties)
    this.attributes = properties_json.attributes;
    this.old = properties_json.old;

    if(this.attributes){
      this.display_new = true;
    }
    if(this.old){
      this.display_old= true;
    }
  }


}
