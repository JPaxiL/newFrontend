import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UsersService } from './service/users.service';
import { first } from 'rxjs/operators';


export interface User {

  name: String;
  email: String;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  users: User[] = [];


  constructor(
    private userService :UsersService
  ) { }

  ngOnInit(): void {
    this.loadAllUsers();
    // this.userService.getUsers('nuevoo').pipe(
    //   tap( nuevo => {
    //     console.log(nuevo);
    //   }),
    //   catchError((error: HttpErrorResponse) => throwError(error))
    //   )
    
  }

  private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.users = users;
    });
}

}
