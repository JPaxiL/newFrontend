import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MultiviewService {

  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
  ) { }

  public async initialize() {
    this.spinner.show('loadingDrivers');
  }

  public getOperations(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${environment.apiUrl}/api/operations`);
  }

  public getTrackersByOperation(operation_id:string): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${environment.apiUrl}/api/operations/trackers/${operation_id}`);
  }

}
