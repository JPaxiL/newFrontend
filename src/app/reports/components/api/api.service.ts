import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url:string = "http://api.glmonitoreo.com/api/"
  constructor(private http:HttpClient) { }

  

}
