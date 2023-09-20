import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { GridItem, UserTracker } from '../models/interfaces';
import { MultiviewService } from '../services/multiview.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnChanges {

  @Input() items: UserTracker[] = [];
  gridItems: GridItem[] = [];

  @Output() itemsChange: EventEmitter<GridItem[]> = new EventEmitter<GridItem[]>();
  @ViewChild('gridChild') gridChild!: GridComponent;

  constructor(private multiviewService: MultiviewService) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    // Aquí puedes acceder a los cambios en miVariableDeEntrada
    if (changes.items) {
      this.updateGridItems();
    }
  }

  updateGridItems(){
    this.gridItems = this.multiviewService.calculateStructure(this.items, "minimap", true);
    if(this.gridItems && this.gridItems.length>0){
      this.gridChild.setItems(this.gridItems);
      this.itemsChange.emit(this.gridItems);
    }
  }

  onExchange(event: any){
    const { current_item: current, exchanged_item: exchanged }  = event;
    this.items = this.multiviewService.exchangeItems(this.items,current,exchanged);
    this.updateGridItems();
  }
}
