import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public events:any[] = [];
  public placa:string = '';
  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.events = this.eventService.getData();
  }

}
