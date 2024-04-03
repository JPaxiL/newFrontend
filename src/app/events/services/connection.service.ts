/*
destinado para ver la calidad de la conexion, aun en proceso de construccion 
*/

import { EventEmitter, Injectable, Output, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { interval, Subscription, Observable } from 'rxjs';
// import { NetworkInformation } from '@angular/common';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';

@Injectable({
  providedIn: 'root',
})


export class ConnectionService {
  @Output() connectionStatus: EventEmitter<any> = new EventEmitter<any>();
  // subscription: Subscription;
  counter: number = 0;

  constructor(
    private http: HttpClient
  ){}

  public saludo ():void {
    console.log("Hola mundo de connection ...");
  }

  public monitor (): void {
    console.log("servicio de status connection ...")
    let aux = interval(1000)
      .subscribe(() => {
        this.counter++;
        console.log('Valor del contador:', this.counter);
        this.getConnectionInfo().subscribe(
          (data) => {
            // this.connectionInfo = data;
            console.log(data);
          },
          (error) => {
            console.error('Error al obtener la información de conexión:', error);
          }
        );
        // this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        // console.log("connection: ",this.connection);
      });
  }

  public getConnectionInfo(): Observable<any> {
    return this.http.get('http://localhost:8000');
  }

}
