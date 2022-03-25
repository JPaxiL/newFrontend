import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.scss']
})
export class ProfileConfigComponent implements OnInit {

  constructor(
    private router: Router

  ) { }

  backgroundImage = '';
  images = [
    `./assets/images/login/fondo1.jpg`,
    `./assets/images/login/fondo2.jpg`
  ];
  logo:string = "assets/images/navbar/logo-gltracker.svg";
  profileConfigForm = new FormGroup({
    actual_pass: new FormControl('', Validators.required),
    new_pass_1: new FormControl('', Validators.required),
    new_pass_2: new FormControl('', Validators.required),

  });

  ngOnInit(): void {
    this.backgroundImage = this.images[(new Date().getHours() < 17)? 1:0];
  }

  updateProfile(): void {
    //console.log(this.profileConfigForm.value);
  }

  goToPanel(): void {
    this.router.navigate(['/panel']);
  }

}


