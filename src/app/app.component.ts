import { Component } from '@angular/core';
import { EventSocketService } from './events/services/event-socket.service';
import { EventService } from './events/services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  constructor(
    private eventService: EventService,
    private eventSocketService: EventSocketService,
  ){
    if(localStorage.getItem('user_id') != null){
      this.eventService.getAll();
      this.eventService.getUnreadCount();
      this.eventSocketService.listen();
    }
  }
}
