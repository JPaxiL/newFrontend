import { Component, OnInit } from '@angular/core';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
// import { MapServicesService } from '../../../map/services/map-services.service';
import { GeofencesService } from '../../services/geofences.service';

@Component({
  selector: 'app-geocerca-main',
  templateUrl: './geocerca-main.component.html',
  styleUrls: ['./geocerca-main.component.scss']
})

export class GeocercaMainComponent implements OnInit {
  //alerts:Alert[] = [];
  options = new Array(
    { id:'LISTAR' ,     name:"Listar"},
    { id:'ADD GEOPOL' , name:"Agregar"},
    { id:'EDITAR' ,     name:"Editar"},
    { id:'ADD TAG',     name: "addTag"}
  );

  displayTags: boolean = false;
  constructor(
    // public mapService: MapServicesService,
    public geofencesService: GeofencesService
    ) {};

  ngOnInit(): void {
    this.geofencesService.nameComponentPol =  "LISTAR";
  }

  onHideDisplayGroup(event : boolean){
    console.log('hide tagss panel...',event);
    this.displayTags = event;
  }
  eventDisplayGroup(event : boolean){
    console.log('desde panel',event);
    this.displayTags = event;
  }

  // openModal() {
  //   this.displayTags = true;
  // }
  
  closeModal(event : boolean) {
    //this.displayTags= false;
    this.displayTags = event;
  }
  
  eventDisplayTags(event : boolean){
    this.displayTags = event;
  }

}
