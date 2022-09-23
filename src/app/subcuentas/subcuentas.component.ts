import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subcuentas',
  templateUrl: './subcuentas.component.html',
  styleUrls: ['./subcuentas.component.scss']
})
export class SubcuentasComponent implements OnInit {
  isUnderConstruction: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
