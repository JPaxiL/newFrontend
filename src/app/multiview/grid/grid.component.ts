import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridItem, StructureGrid } from '../models/interfaces';
import { MinimapService } from '../services/minimap.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  items: GridItem[] = [];

  @Output() itemsChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteGrid: EventEmitter<any> = new EventEmitter<any>();

  constructor(private minimapService: MinimapService) { }

  ngOnInit(): void {
  }
  setItems(items: GridItem[]){
    this.items = items;
  }
  updateStructure(structures: StructureGrid[]){
    this.items.forEach(item => {
      item.structure = structures.find(st => st.gridItem_id == item.label)!;
    })
  }

  onChangeDrops(event : any){
    //SOlo envo los drops que intercambiaron
    //{current_item: current, exchanged_item: exchanged }
    this.itemsChange.emit(event);
    setTimeout(() => {
      this.minimapService.resizeMaps();
    }, 300);
  }
  deleteGrid(idContainer: string){
    console.log("CURRENT GRIDS?", this.items.length);
    this.items = this.items.filter(item => item.label != idContainer);
    console.log("AFTER DELETE GRIDS?", this.items.length);
    this.onDeleteGrid.emit(idContainer);
  }
}
