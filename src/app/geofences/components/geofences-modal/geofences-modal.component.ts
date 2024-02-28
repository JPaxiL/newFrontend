import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { Modales } from './geofences-modal';
import { MinimapService } from 'src/app/multiview/services/minimap.service';
import { MiniMap } from 'src/app/multiview/models/mini-map';
import { GeofenceImportExportService } from '../../services/geofence-import-export.service';
import { MapItemConfiguration } from 'src/app/multiview/models/interfaces';
import { Data } from '@angular/router';
import { DataGeofence } from '../../models/interfaces';
@Component({
  selector: 'app-geofences-modal',
  templateUrl: './geofences-modal.component.html',
  styleUrls: ['./geofences-modal.component.scss']
})
export class GeofencesModalComponent implements OnInit, AfterViewInit {
  dataGeo: DataGeofence[] = [];
  map!: L.Map;
  confGeoMap: MapItemConfiguration = {
    containerId: "geofence-minimap",
    zoom: 14,
    maxZoom: 16,
    dataFitBounds: [[-16.39889, -71.535]],
  }
  constructor(public geofencesService: GeofencesService, public geofenceImportExportService: GeofenceImportExportService) {
  }
  guardarRegistro(): void {

    console.log('Datos recibidos:');

  }

  /*fileKml(event: any) {
    const file: File = event.target.files[0];
    console.log("johan1", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        console.log("johan2", fileContent);
        const regex = /<Placemark>\s*<name>\s*([\s\S]*?)\s*<\/name>|<description>\s*([\s\S]*?)\s*<\/description>|<LineStyle>\s*<color>\s*([a-fA-F0-9]+)\s*<\/color>|<LinearRing>\s*<coordinates>\s*([\s\S]*?)\s*<\/coordinates>/g;
        const datas: { name?: string, description?: string, coordinates?: string, color?: string }[] = [];
        let match;
        
        // Itera sobre todas las coincidencias
        while ((match = regex.exec(fileContent)) !== null) {
            const item: { name?: string, description?: string, coordinates?: string, color?: string } = {};
        
            // Verifica qué grupo de captura se obtuvo y asigna el valor correspondiente
            if (match[1] !== undefined) item['name'] = match[1].trim();
            if (match[2] !== undefined) item['description'] = match[2].trim();
            if (match[3] !== undefined) item['color'] = match[3].trim();
            if (match[4] !== undefined) item['coordinates'] = match[4].trim();
        
            // Agrega el item al arreglo de datos
            datas.push(item);
        }
        
        // Muestra los datos
        console.log(datas);
        
        console.log("johan3: ", datas);

        const convertedData: Datas[] = datas.map((data: any) => {
          return {
            name: data.name || '',
            description: data.description || '',
            coordinates: data.coordinates || '',
            color: data.color || ''
          };
        });
        this.dataGeo = convertedData;
        console.log("datageo: ", this.dataGeo);
      };
      reader.readAsText(file);

    }
  }*/
  geocercaDet(item: any) {
    console.log("detallados: ", item);
    this.geofenceImportExportService.coordinateGeofence(item);

  }
  enviarDatosOtroComponente() {
    this.geofencesService.setData(this.dataGeo);
  }


  ngOnInit(): void {
    //this.getdatacomp();
    this.dataGeo=this.geofencesService.importedGeofencesTemp;;
  }
  ngAfterViewInit(): void {
    if (this.geofencesService.dataGeofencesCompleted) {
      this.dataGeo = this.geofencesService.importedGeofencesTemp;
      console.log("fuera subscribe", this.dataGeo);
      this.activarCreateMap(this.geofencesService.importedGeofencesTemp);
    } else {
      this.geofencesService.datos$.subscribe(datos => {
        this.dataGeo = datos;
        console.log("subscribe", this.dataGeo);
        this.activarCreateMap(datos);
      });
    }
  }

  activarCreateMap(datos: DataGeofence[]) {
    console.log("geocercamap", datos);
    // Verifica si this.dataGeo es un array de objetos Datas[]
    console.log("activarCreateMap", datos, "---");
    this.geofenceImportExportService.startMiniMap(this.confGeoMap, datos);
    /*
    if (Array.isArray(datos)) {
      // Pasar el primer objeto del array a startMiniMap()
      this.geofenceImportExportService.startMiniMap(this.confGeoMap, datos);
    } else {
      // datos=datos;
      console.log("arrayaux", datos);
      this.geofenceImportExportService.startMiniMap(this.confGeoMap, datos);
    }*/
  }

}
