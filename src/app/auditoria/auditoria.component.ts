import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  isUnderConstruction: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
