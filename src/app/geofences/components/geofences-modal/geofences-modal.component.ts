import { AfterContentChecked, Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { GeofenceImportExportService } from '../../services/geofence-import-export.service';
import { DataGeofence } from '../../models/interfaces';
import { MapItemConfiguration } from 'src/app/multiview/models/interfaces';

@Component({
  selector: 'app-geofences-modal',
  templateUrl: './geofences-modal.component.html',
  styleUrls: ['./geofences-modal.component.scss']
})
export class GeofencesModalComponent implements OnInit, AfterContentChecked, OnDestroy {
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
  ) {}

  guardarRegistro(): void {
    console.log('Datos recibidos:');
  }

  geocercaDet(item: any) {
    console.log("detallados: ", item);
    this.geofenceImportExportService.coordinateGeofence(item);
  }

  enviarDatosOtroComponente() {
    this.geofencesService.setData(this.datosGeo);
  }

  ngOnInit(): void {
    //this.getdatacomp();
    //this.datosGeo=this.geofencesService.importedGeofencesTemp;;
  }

  ngAfterContentChecked(): void {
    this.minimapElement = document.getElementById('geofence-minimap');
    this.geofencesService.data$.subscribe(data => {
      // Se retrasa la actualización de los datos dentro de NgZone.run
      this.ngZone.run(() => {
        this.datosGeo = data;
      });
      console.log("subscribe", this.datosGeo);
      this.geofenceImportExportService.startMiniMap(this.confGeoMap,data);
      // Aquí puedes hacer lo que necesites con los datos recibidos
    });
  }

  ngOnDestroy(): void {
    console.log("subscribe",this.minimapElement);
    // Destruir el mapa cuando el componente se destruye
    if (this.minimapElement) {
      this.minimapElement.remove();
    }
  }
}
