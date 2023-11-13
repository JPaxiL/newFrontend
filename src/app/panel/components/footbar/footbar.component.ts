import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng-lts/api';
import { EventPopupComponent } from 'src/app/events/components/event-popup/event-popup.component';
import { EventSocketService } from 'src/app/events/services/event-socket.service';
import { PopupContent } from 'src/app/multiview/models/interfaces';
import { LayersService } from 'src/app/multiview/services/layers.service';
import { MultimediaService } from 'src/app/multiview/services/multimedia.service';
import { CarouselService } from 'src/app/shared/services/carousel.service';

@Component({
  selector: 'app-footbar',
  templateUrl: './footbar.component.html',
  styleUrls: ['./footbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FootbarComponent implements OnInit {

  itemsMenu: MenuItem[]=[];
  showScreenRecorder = false;
  showCipiaExample = false;
  showPopupDialog = true;
  
  events:PopupContent[] = [];


  @ViewChild('MapView') mapView!: ElementRef;

  slideConfig = {"slidesToShow": 4, "slidesToScroll": 1};

  constructor(
    private multimediaService: MultimediaService,
    private layersService: LayersService,
    private eventSocketService: EventSocketService,
    private carouselService: CarouselService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.layersService.initializeServices();
    this.itemsMenu = [
      {
        id: '1',
        label: 'Grabar Pantallas',
        icon: 'pi pi-fw pi-video',
        command: (event) => {
          console.log("grabar pantallas: ", event);
          this.showScreenRecorder = true;
        },
      },
      {
        id: '2',
        label: 'Tomar captura',
        icon: 'pi pi-fw pi-camera',
        command: (event) => {
          this.multimediaService.screenShot(this.mapView.nativeElement);
        },
      },
      {
        id: '3',
        label: 'Ejemplo cipia video',
        icon: 'pi pi-fw pi-video',
        command: (event) => {
          this.showCipiaExample = true;
        },
      }
    ];
    this.eventSocketService.eventPopup.subscribe(data => {
      this.onEvent(data);
    });
    
  }

  closeScreenRecorder(){
    this.showScreenRecorder = false;
  }

  closeMinimapPopup(event: any){
    console.log("CloseMinimapPopup: ", event)
  }

  onEvent(event:any){
    console.log("popupEVENTS: ",event);
    /*
    const newEvents = [
      ...this.events,
      {
        vehicles: [event.tracker],
        event: event.event,
        mapConf: { containerId: "popup-container-" + event.event.evento_id.toString() + Date.now()}
      }
    ];
    this.events = [];
    this.events = newEvents;
    this.changeDetector.detectChanges();*/
    // this.popupWraper.find(item => !item.active)!.content = {
    //   id: Date.now().toString(),
    //   vehicles: [event.tracker],
    //   event: event.event,
    //   mapConf: { containerId: "popup-container-" + event.event.evento_id.toString() + Date.now()}
    // }
    // this.popupWraper.find(item => !item.active)!.active = true;
    const auxEvent = {
      id: Date.now().toString(),
      vehicles: [event.tracker],
      event: event.event,
      mapConf: { containerId: "popup-container-" + event.event.evento_id.toString() + Date.now()}
    }
    this.carouselService.add(EventPopupComponent,{configuration: auxEvent})
    this.events.push({
      id: Date.now().toString(),
      vehicles: [event.tracker],
      event: event.event,
      mapConf: { containerId: "popup-container-" + event.event.evento_id.toString() + Date.now()}
    });
    //this.changeDetector.detectChanges()
    
  }

  trackByFn(index: number, item: any): any {
    return item.id; 
  }
}
