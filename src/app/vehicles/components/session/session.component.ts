import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
// import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  loginForm!: FormGroup;
  // o 	form: FormGroup | undefined; XDDD
  isSubmitted  =  false;
  // public submitted: Boolean = false;
  // public error: {code: number, message: string} = null;

    // loginGroup: FormGroup;
    // username = '';
    // password = '';
    // matcher = new MyErrorStateMatcher();
    isLoadingResults = false;
    // us
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm  =  this.formBuilder.group({
       username: ['', Validators.required],
       password: ['', Validators.required]
   });

  }
  onSubmit(): void {

    // console.log(this.loginForm);
    // this.isLoadingResults = true;
    this.isSubmitted = true;
    this.authService.login(this.loginForm.value)
      .subscribe(() => {
        this.isLoadingResults = false;
        this.router.navigate(['/vehicles']).then(_ => console.log('Estas en modulo vehiculos!'));
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
        this.isSubmitted = false;
      });
  }
  get formControls() { return this.loginForm.controls; }

}
