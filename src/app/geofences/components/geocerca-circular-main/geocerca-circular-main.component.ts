import { Component, OnInit } from '@angular/core';
import { CircularGeofencesService } from '../../services/circular-geofences.service';

@Component({
  selector: 'app-geocerca-circular-main',
  templateUrl: './geocerca-circular-main.component.html',
  styleUrls: ['./geocerca-circular-main.component.scss']
})
export class GeocercaCircularMainComponent implements OnInit {

  constructor(private circularGeofencesService: CircularGeofencesService) { }

  ngOnInit(): void {

    //this.circularGeofencesService.nombreComponente =  "LISTAR";
  }

  // get nombreComponente(){
  //   return this.circularGeofencesService.nombreComponente;
  // }

}
