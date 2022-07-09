import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cred-config',
  templateUrl: './cred-config.component.html',
  styleUrls: ['./cred-config.component.scss']
})
export class CredConfigComponent implements OnInit {

  profileConfigForm = new FormGroup({
    actual_pass: new FormControl('', Validators.required),
    new_pass_1: new FormControl('', Validators.required),
    new_pass_2: new FormControl('', Validators.required),
  });
  constructor() { }

  ngOnInit(): void {
  }

}
