import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridComponent } from '../grid/grid.component';
import { GridItem, ScreenView, UnitItem } from '../models/interfaces';
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
  show_not_found = false;
  @ViewChild('_gridChild') gridChild!: GridComponent;

  constructor(private route: ActivatedRoute, public multiviewService: MultiviewService, private layersService: LayersService) { }
  ngOnInit() : void{
    this.layersService.initializeServices();
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
        }
        this.updateGridItems();
      } catch (error) {
        this.show_not_found = true;
        console.log(error);
      }
    });
  }

  updateGridItems(){
    this.gridItems = this.multiviewService.calculateStructure(this.items,"minimap");
    if(this.gridItems && this.gridItems.length>0){
      this.gridChild.setItems(this.gridItems);
    }
  }

  onExchange(event: any){
    const { current_item: current, exchanged_item: exchanged }  = event;
    this.items = this.multiviewService.exchangeItems(this.items,current,exchanged);
    this.updateGridItems();
    
  }

}
