import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventSocketService } from 'src/app/events/services/event-socket.service';
import { EventService } from 'src/app/events/services/event.service';
import { GridComponent } from '../grid/grid.component';
import { GridItem, ScreenView, StructureGrid, UnitItem } from '../models/interfaces';
import { LayersService } from '../services/layers.service';
import { MultiviewService } from '../services/multiview.service';

@Component({
  selector: 'app-screen-view',
  templateUrl: './screen-view.component.html',
  styleUrls: ['./screen-view.component.scss']
})
export class ScreenViewComponent implements OnInit, AfterViewInit {
  configName = "";
  screenView!: ScreenView;
  gridItems: GridItem[] = [];
  items: UnitItem[] = [];
  structures: StructureGrid[] = [];
  show_not_found = false;
  @ViewChild('_gridChild') gridChild!: GridComponent;

  constructor(
    private route: ActivatedRoute, 
    public multiviewService: MultiviewService, 
    private layersService: LayersService,
    private eventService: EventService,
    private eventSocketService: EventSocketService
    ) { }
  ngOnInit() : void{
    this.layersService.initializeServices();
    this.eventService.getAll();
    this.eventSocketService.listen();
  }
  ngAfterViewInit(): void {
    // Obtiene el parámetro configId de la URL
    this.route.params.subscribe(params => {
      this.configName = params['name'];      
      try {
        this.screenView = this.multiviewService.getMultiviewFromLocalStorage(this.configName)[0] as ScreenView;
        this.gridItems = this.screenView.grids! as GridItem[];
        console.log("this.gridItems: ", this.gridItems);
        
        for (let item of this.gridItems) {
          this.items.push(item.content!);
          this.structures.push(item.structure!);
        }
        this.updateGridItems();
      } catch (error) {
        this.show_not_found = true;
        console.log(error);
      }
    });
  }

  setGritItems(){
    if(this.gridItems && this.gridItems.length>0){
      this.gridChild.setItems(this.gridItems);
    }
  }

  updateGridItems(){
    this.structures = this.multiviewService.calculateStructure(this.structures);
    this.gridItems.forEach(item => {
      item.structure = this.structures.find(st => st.gridItem_id == item.label)!;
      item.content_type = "minimap";
      item.show_only_label = false;
    })
    this.setGritItems();
  }

  updateGridStructureInChild(){
    this.gridChild.updateStructure(this.structures);
  }

  onExchange(event: any){
    const { current_item: current, exchanged_item: exchanged }  = event;
    this.structures = this.multiviewService.calculateStructure(this.multiviewService.exchangeItems(this.structures,current,exchanged));
    this.updateGridStructureInChild();
  }
  deleteView(idContainer: string){
    this.structures = this.structures.filter(st => st.gridItem_id !== idContainer);
    this.structures = this.multiviewService.calculateStructure(this.structures);
    this.updateGridStructureInChild();
  }
}
