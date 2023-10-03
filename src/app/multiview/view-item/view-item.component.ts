import { Component, Input, OnInit } from '@angular/core';
import { GridItem, MinimapContent, UserTracker } from '../models/interfaces';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss']
})
export class ViewItemComponent implements OnInit {

  @Input() configuration!: UserTracker | MinimapContent;
  @Input() type:string = "minimap";
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
