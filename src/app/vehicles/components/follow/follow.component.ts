import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss']
})
export class FollowComponent implements OnInit {

  private params: any;

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

}
