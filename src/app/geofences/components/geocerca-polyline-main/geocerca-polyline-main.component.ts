import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import Swal from 'sweetalert2';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';

@Component({
  selector: 'app-geocerca-polyline-main',
  templateUrl: './geocerca-polyline-main.component.html',
  styleUrls: ['./geocerca-polyline-main.component.scss']
})
export class GeocercaPolylineMainComponent implements OnInit {

  
  constructor(private polylineGeofenceService: PolylineGeogencesService) { }

  ngOnInit(): void {
    
    this.polylineGeofenceService.nameComponentLin =  "LISTAR";
  }

  get nameComponentLin(){
    return this.polylineGeofenceService.nameComponentLin;
  }


}
