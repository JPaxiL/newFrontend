import { Component, OnInit } from '@angular/core';
import { EventSocketService } from './../../services/event-socket.service';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { EventService } from '../../services/event.service';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public events:any[] = [];
  public placa:string = '';
  constructor(
    private eventService: EventService,
    public mapService: MapServicesService,
    public ess:EventSocketService) {     }

  ngOnInit(): void {
    this.events = this.eventService.getData();
  }

  public showEvent(event:any){
    this.mapService.map.fitBounds([[event.layer.getLatLng().lat, event.layer.getLatLng().lng]], {padding: [50, 50]});
    event.layer.addTo(this.mapService.map).openPopup();
  }

  public hideEvent(event:any){
    this.mapService.map.removeLayer(event.layer)
  }

}
