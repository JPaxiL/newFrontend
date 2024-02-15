import { Component } from '@angular/core';
import { EventSocketService } from './events/services/event-socket.service';
import { EventService } from './events/services/event.service';
import { TabService } from './panel/services/tab.service';
import { UserDataService } from './profile-config/services/user-data.service';
import { VehicleService } from './vehicles/services/vehicle.service';

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
    private userDataService: UserDataService,
    private tabService: TabService,
    private vehicleService: VehicleService,
  ){
    if(localStorage.getItem('user_id') != null){
      this.tabService.currentTabReady.subscribe({
        next: (response: boolean) => {
          if(response){
            if(this.tabService.requiresVehicleServices()){
              // this.vehicleService.initialize();
            }
            if(this.tabService.requiresEventServices()){
              this.eventService.getAll();
              this.eventSocketService.listen();
            } 
            if(this.tabService.requiresUserDataServices()){
              // this.userDataService.getUserData();
            }
            
          }
        },
        error: (errorMsg: any) => {
          console.log(errorMsg);
        }
      });
    }
  }
}
