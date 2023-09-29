import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';

import { MinimapService } from '../services/minimap.service';
import { HistorialService } from 'src/app/historial/services/historial.service';
import { UserTracker } from '../models/interfaces';
import { MinimapServiceService } from '../services/minimap-service.service';
import { CircularGeofencesMinimapService } from '../services/circular-geofences-minimap.service';
import { GeofencesMinimapService } from '../services/geofences-minimap.service';
import { GeopointsMinimapService } from '../services/geopoints-minimap.service';

import { LayersService } from '../services/layers.service';


@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: [
    './minimap.component.scss'
  ],
})
export class MinimapComponent implements OnInit, AfterViewInit {
  @Input() configuration!: UserTracker;

  minimapServiceService = new MinimapServiceService(
    this.minimapService, this.historialService,
    this.circularGeofencesService, this.geofencesService,
    this.geopointsService, this.layersService);
  constructor(
    public minimapService: MinimapService,
    public historialService: HistorialService,
    public layersService: LayersService,
    private circularGeofencesService: CircularGeofencesMinimapService,
    public geofencesService: GeofencesMinimapService,
    public geopointsService: GeopointsMinimapService
  ) {}

  ngOnInit(): void {

  }

  async ngAfterViewInit() {
    this.createMap();
  }

  createMap() {
    console.log("CREATE MAPPPPPPPPPP");
    const containerId = 'map-container-'+this.configuration.numero_placa;
    const mapContainer = document.getElementById(containerId);
    if (mapContainer) {
      this.minimapServiceService.createMap(containerId, this.configuration);
    }
  }
}
