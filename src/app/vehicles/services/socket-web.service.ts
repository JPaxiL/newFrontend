import { Injectable, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {

  @Output() callback: EventEmitter<any> = new EventEmitter();

  constructor() {
    super({
      url: environment.socketUrl
    });

    this.listen();
  }

  listen = ()=>{
    this.ioSocket.on('envio', (res:string, data: any) => {
      // if(data.IMEI=='860640057372346'){
      //   console.log('envio ====>',data);
      //
      // }
      this.callback.emit(data)
    });
  }
}
