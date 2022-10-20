import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {
   
  constructor(private httpClient: HttpClient) { }
  
  getInfoFromIp(ip_address: string){
    let url = 'https://ipapi.co/' + ip_address + '/json';

    return this.httpClient.get(url);
  }
}
