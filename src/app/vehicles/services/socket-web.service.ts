import { Injectable, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { VehicleService } from './vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {

  @Output() callback: EventEmitter<any> = new EventEmitter();
  whitelist : string[] = [];
  constructor(
    private vehicleService: VehicleService
  ) {
    super({
      url: environment.socketUrl
    });
    this.start();
    this.listen();
  }

  start(){
    if(!this.vehicleService.statusDataVehicle){
      this.vehicleService.dataCompleted.subscribe(vhs => {
        this.whitelist = vhs.map((vh:any) => vh.IMEI.toString());
      })
    }
  }

  listen = ()=>{
    this.ioSocket.on('envio', (res:string, data: any) => {
      // if(data.IMEI=='860640057372346'){
      //   console.log('envio ====>',data);
      //
      // }
      if(this.whitelist.includes(data.IMEI.toString())){
        console.log('envio ====>',data);
        this.callback.emit(data)
      }
    });
  }
}
