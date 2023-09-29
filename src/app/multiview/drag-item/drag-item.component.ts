import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserTracker } from '../models/interfaces';

@Component({
  selector: 'app-drag-item',
  templateUrl: './drag-item.component.html',
  styleUrls: ['./drag-item.component.scss']
})
export class DragItemComponent implements OnInit {

  @Input() items:UserTracker[] = [];
  aux_exchanged_item!: UserTracker;

  @Output() itemsChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<UserTracker[]>) {
    if((event.previousContainer !== event.container)){
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
  
      if(event.currentIndex == 1){
        const originalElement = event.container.data.splice(0, 1)[0];
        this.aux_exchanged_item = originalElement;
        event.previousContainer.data.push(originalElement);
      }else{
        const originalElement = event.container.data.splice(1, 1)[0];
        this.aux_exchanged_item = originalElement;
        event.previousContainer.data.push(originalElement);
      }
      
      this.itemsChange.emit({
        current_item : this.items[0],
        exchanged_item : this.aux_exchanged_item
      });
    }
  }

}
