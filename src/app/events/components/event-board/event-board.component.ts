import { Component, OnInit } from '@angular/core';
import { EventService } from './../../services/event.service';
@Component({
  selector: 'app-event-board',
  templateUrl: './event-board.component.html',
  styleUrls: ['./event-board.component.scss']
})
export class EventBoardComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.initialize();
  }

}
