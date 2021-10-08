import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eye',
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.scss']
})
export class EyeComponent implements OnInit {

  params: any;

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

}
