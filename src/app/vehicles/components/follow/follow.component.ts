import { Component, OnInit} from '@angular/core';

import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss']
})
export class FollowComponent implements OnInit {

  params: any;


  constructor(private followService:FollowService) { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

  onClick(){
    this.params.value = !this.params.value;
    this.followService.add(this.params.data);

  }

}
