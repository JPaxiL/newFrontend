import { Component, OnInit } from '@angular/core';

import { HistorialService } from '../../services/historial.service';
import { } from "primeng-lts/steps";


import {SliderModule} from 'primeng-lts/slider';
import {InputTextModule} from 'primeng-lts/inputtext';



@Component({
  selector: 'app-panel-historial-recorrido-modal',
  templateUrl: './panel-historial-recorrido-modal.component.html',
  styleUrls: ['./panel-historial-recorrido-modal.component.scss']
})
export class PanelHistorialRecorridoModalComponent implements OnInit {

  value = 100;
  constructor(
    public historialService: HistorialService,
  ) { }

  ngOnInit(): void {
  }

}
