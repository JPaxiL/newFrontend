import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { GridItem, StructureGrid, UnitItem, UserTracker } from '../models/interfaces';
import { MultiviewService } from '../services/multiview.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnChanges,AfterViewInit {

  @Input() items: UnitItem[] = [];
  structures: StructureGrid[] = [];
  gridItems: GridItem[] = [];

  @Output() itemsChange: EventEmitter<GridItem[]> = new EventEmitter<GridItem[]>();
  @ViewChild('gridChild') gridChild!: GridComponent;

  constructor(private multiviewService: MultiviewService) { }
  ngAfterViewInit(): void {
    console.log("itemsss: ", this.items);
    if(this.items.length>0){
      this.updateGridItems();
    }
  }

  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges) {
    // Aquí puedes acceder a los cambios en items
    if (changes.items) {
      this.updateGridItems();
    }
  }

  setGritItems(){
    if(this.gridItems){
      this.gridChild.setItems(this.gridItems);
      this.itemsChange.emit(this.gridItems);
    }
  }

  updateGridItems(newStructure=true){
    if(newStructure){
      this.structures = this.multiviewService.calculateStructureFromUnitItems(this.items);
      this.gridItems = [];
      for (let item of this.items){
        this.gridItems.push({
          structure: this.structures.find(st => st.gridItem_id == item.nombre)!,
          content_type: "minimap",
          show_only_label: true,
          content: item,
          label: item.nombre,
          title: item.nombre + (item.operation? ' ('+item.operation+')' : "")
        });
      }
    }else{
      this.structures = this.multiviewService.calculateStructure(this.structures);
      this.gridItems.forEach(item => {
          item.structure = this.structures.find(st => st.gridItem_id == item.label)!;
      })
    }
    this.setGritItems();
  }

  onExchange(event: any){
    const { current_item: current, exchanged_item: exchanged }  = event;
    this.structures = this.multiviewService.exchangeItems(this.structures,current,exchanged);
    this.items = this.multiviewService.exchangeItems(this.items,this.items.find(ite=>ite.nombre == current.gridItem_id),this.items.find(ite=>ite.nombre == exchanged.gridItem_id));
    this.updateGridItems(false);
  }
}
