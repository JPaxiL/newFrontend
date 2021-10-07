import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Alert } from '../models/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private endpoint = 'alerts/list';

  constructor(private http: HttpClient) { }

  public get(endpoint:string):Observable<Alert[]> {
    return this.http.get<Alert[]>(environment.apiUrl + endpoint);
  }
}
