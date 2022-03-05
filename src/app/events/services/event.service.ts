import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService  {
  private events: any[] = [];
  public nombreComponente:string = "EVENT-USER";
  constructor(private http: HttpClient) {}

  initialize(): void {
    this.getAll();
  }

  public async getAll(
    key: string = '',
    show_in_page: number = 15,
    page: number = 1
  ) {
    await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/event-user`)
      .toPromise()
      .then( response => {
        this.events = response.data
      });
  }

  public getData() {
    return this.events;
  }
}
