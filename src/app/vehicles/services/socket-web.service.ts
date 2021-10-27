import { Injectable, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {
  
  @Output() callback: EventEmitter<any> = new EventEmitter();

  constructor() {

    super({
      url: 'http://escucha.glmonitoreo.com/'
    });

    this.listen();
  }

  listen = ()=>{
    this.ioSocket.on('envio', (res:string, data: any) => {
      this.callback.emit(data)
    });
  }
}
