import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
    console.log('Wrong path. Redirecting...');
    this.router.navigate(['/'], { replaceUrl: true });
  }

  ngOnInit(): void {
  }

}
