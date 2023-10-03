import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridItem } from '../models/interfaces';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  items!: GridItem[];

  @Output() itemsChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  setItems(items: GridItem[]){
    this.items = items;
  }

  onChangeDrops(event : any){
    //SOlo envo los drops que intercambiaron
    //{current_item: current, exchanged_item: exchanged }
    this.itemsChange.emit(event);
  }
}
