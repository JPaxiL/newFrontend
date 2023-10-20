import { Component, OnInit } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';

import { PanelService } from '../../../panel/services/panel.service';

import Swal from 'sweetalert2';
import { TreeNode } from 'primeng-lts/api';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';
// import { Draw } from 'leaflet-draw';
import 'leaflet-draw';

@Component({
  selector: 'app-geofence-table',
  templateUrl: './geofence-table.component.html',
  styleUrls: ['./geofence-table.component.scss']
})
export class GeofenceTableComponent implements OnInit {
  datosCargados: boolean = false;
  NomBusqueda: string = "";
  noResults: boolean = false;

  geofences: TreeNode[]=[];
  loading: boolean=true;
  cols: any[]=[];
  sortOrder: number=1;

  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,
    public panelService: PanelService,
    private circularGeofencesService: CircularGeofencesService,
    private polylineGeofenceService: PolylineGeogencesService,
  ) { }

  ngOnInit(): void {
    if(!this.geofencesService.initializingGeofences || !this.geofencesService.initializingUserPrivleges){
      this.geofencesService.spinner.show('loadingGeofencesSpinner');
    }
    if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
      this.polylineGeofenceService.spinner.show('loadingPolylineGeofencesSpiner');
    }
    if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
      this.circularGeofencesService.spinner.show('loadingCircularGeofencesSpiner');
    }
  }

  onBusqueda(gaaa?:any) {
    console.log(gaaa);
    if(this.NomBusqueda == ''){
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData();
      this.noResults = false;
    } else {
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData().filter( (geocerca: any) => {
        return geocerca.trama.orden != null && geocerca.trama.orden.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.geofencesService.tblDataGeoFiltered.length == 0;
    }
  }

  headerScrollHandler(){
    setTimeout(()=> {
      const headerBox = document.querySelector('.p-treetable-scrollable-header-box') as HTMLElement;
      const contentBox = document.querySelector('.p-treetable-tbody') as HTMLElement;
      if(headerBox != null && contentBox != null){
        if(headerBox!.offsetWidth > contentBox!.offsetWidth){
          headerBox!.classList.remove('no-scroll');
        } else {
          headerBox!.classList.add('no-scroll');
        }
      }
    }, 1000);
  }

}
