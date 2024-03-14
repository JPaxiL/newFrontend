import { AfterContentChecked, Component, OnDestroy, OnInit, NgZone, AfterContentInit, AfterViewInit, Input } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { GeofenceImportExportService } from '../../services/geofence-import-export.service';
import { DataGeofence } from '../../models/interfaces';
import { MapItemConfiguration } from 'src/app/multiview/models/interfaces';

@Component({
  selector: 'app-geofences-modal',
  templateUrl: './geofences-modal.component.html',
  styleUrls: ['./geofences-modal.component.scss']
})
export class GeofencesModalComponent implements OnInit, AfterContentChecked, OnDestroy, AfterViewInit {
  datosGeo: DataGeofence[] = [];
  minimapElement: HTMLElement | null = null;

  minimapGeo: any;
  map!: L.Map;
  confGeoMap: MapItemConfiguration = {
    containerId: "geofence-minimap",
    zoom: 14,
    maxZoom: 16,
    dataFitBounds: [[-16.39889, -71.535]],
  }
  constructor(
    public geofencesService: GeofencesService,
    public geofenceImportExportService: GeofenceImportExportService,
    private ngZone: NgZone
  ) { }

  guardarRegistro(): void {
    console.log('Datos recibidos:');
  }

  geocercaDet(item: DataGeofence) {
    console.log("detalle1: ", item);
    let prueba: DataGeofence []=[];
    prueba.push(item);
    const setCoordinates: number[][][] = this.geofenceImportExportService.coordinatesGeo(prueba);
    console.log("detalle3", setCoordinates);
    this.geofenceImportExportService.alignGeofence(setCoordinates);
    //this.geofenceImportExportService.prueba();
  }

  enviarDatosOtroComponente() {
    this.geofencesService.setData(this.datosGeo);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit", this.datosGeo);
  }
  ngOnInit(): void {

  }

  ngAfterContentChecked(): void {

  }

  ngOnDestroy(): void {

    if (this.minimapElement) {
      this.minimapElement.remove();
    }
  }

  generateMap(datos: DataGeofence[]) {
    this.datosGeo = datos;
    this.geofenceImportExportService.startMiniMap(this.confGeoMap);
    console.log("generatemap", datos);
    const setCoordinates: number[][][] = this.geofenceImportExportService.coordinatesGeo(datos);
    console.log("setCoordinates", setCoordinates);
    this.geofenceImportExportService.alignGeofence(setCoordinates);
    this.geofenceImportExportService.addGeofences(setCoordinates, datos);
  }
}
