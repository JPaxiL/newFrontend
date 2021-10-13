import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  private params: any;

  constructor() { }

  ngOnInit(): void {
  }
  agInit(params: any){
    this.params = params;
  }

}
