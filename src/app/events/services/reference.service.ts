import { EventEmitter, Injectable, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';

@Injectable({
  providedIn: 'root',
})

export class ReferenceService {
  @Output() searchReferenceEventCompleted: EventEmitter<any> = new EventEmitter<any>();

  public status: boolean = true;
  public buffer: any[] = [];

  constructor(
    private http: HttpClient
  ){}

  public saludo ():void {
    console.log("Hola mundo de referencias ...");
  }

  public getBuffer () : any {
    return this.buffer;
  }
  async searchReferenceEvent (event: any) {
    // if(this.buffer[event.id]==undefined){
    //   console.log("buscando en servicio");
      this.queryReferenceEvent(event);
    // }else{
    //
    //   event.referencia = this.buffer[event.id];
    //   console.log(" referencia --->",event.referencia);
    //   // event.referenci a = "lalalalalal ";
    //   console.log("buscando en cache",event);
    //   this.searchReferenceEventCompleted.emit(event);
    // }

  }
  async queryReferenceEvent (event: any) {
    await this.http
      .get<ResponseInterface>(
        `${environment.apiUrl}/api/event-user/get-reference`,
        {
          params: {
            latitud: event.lat,
            longitud: event.lng,
          },
        }
      )
      .toPromise()
      .then((res)=>{
        console.log("exito en la consulta",res.data);
        event.referencia = res.data.referencia;

        this.buffer[event.id]=res.data.referencia;
        this.searchReferenceEventCompleted.emit(event);
      });

  }


}
