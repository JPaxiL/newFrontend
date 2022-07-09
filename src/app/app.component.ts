import { Component } from '@angular/core';
import { EventSocketService } from './events/services/event-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  constructor(
    private eventSocketService: EventSocketService
  ){
    this.eventSocketService.listen();
  }
}
