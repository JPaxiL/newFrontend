import { Component, OnInit } from '@angular/core';
import { GeofencesService } from '../services/geofences.service';


@Component({
  selector: 'app-geofences-modal',
  templateUrl: './geofences-modal.component.html',
  styleUrls: ['./geofences-modal.component.scss']
})
export class GeofencesModalComponent implements OnInit {
  public nombreZona: string;
  public colorZona: string;
  public visibleZona: string;
  public nomVisibleZona: string;
  public verticesZona: string;
  public velActZona: string;
  public tiempoZona: string;
  public velZona: string;
  public tiempoActZona: string;
  public geom: string;
  public catZona: number = 0;
  public vel2Zona: number = 0;
  public vel3Zona: number = 0;
  public velMax: number = 0;
  public updatedAt: Date;
  public descripcion: string;
  public bolEliminado: boolean;
  public tagNameFontSize: number = 0;
  public zoneType: string;
  public grupoConvoyId: number = 0;
  public operationGrupeId: number = 0;
  public geoTags: string;

  constructor(public geofencesService: GeofencesService) {
    this.nombreZona = '';
    this.colorZona = '';
    this.visibleZona = '';
    this.nomVisibleZona = '';
    this.verticesZona = '';
    this.velActZona = '';
    this.tiempoZona = '';
    this.velZona = '';
    this.tiempoActZona = '';
    this.geom = '';
    this.updatedAt = new Date();
    this.descripcion = '';
    this.bolEliminado = false;
    this.zoneType = '';
    this.geoTags = '';
  }
  guardarRegistro(): void {

    console.log('Datos recibidos:', this.nombreZona, this.colorZona);
    // Puedes realizar cualquier lógica adicional con los datos aquí
  }

  fileKml(event: any) {
    const file: File = event.target.files[0];
    console.log("johan1", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        console.log("johan2", fileContent);
        const regex = /<name>\s*([\s\S]*?)\s*<\/name>|<description>\s*([\s\S]*?)\s*<\/description>|<coordinates>\s*([\s\S]*?)\s*<\/coordinates>|<color>\s*([a-fA-F0-9]+)\s*<\/color>/g;
        const datas: { name?: string, description?: string, coordinates?: string, color?: string }[] = [];
        let item: { name?: string, description?: string, coordinates?: string, color?: string } = {};
        let match;
        while ((match = regex.exec(fileContent)) !== null) {
          if (match[1] !== undefined) item['name'] = match[1].trim();
          if (match[2] !== undefined) item['description'] = match[2].trim();
          if (match[3] !== undefined) item['coordinates'] = match[3].trim();
          if (match[4] !== undefined) {
            item['color'] = match[4].trim();
            datas.push(item);
            item = {}; // Reiniciar el objeto para el próximo conjunto de coincidencias
          }
        }
        console.log("johan3: ", datas);
        this.datas.getProductsSmall().then(datas => this.datas = data);
      };
      reader.readAsText(file);
    }
  }
  
  ngOnInit(): void {
    
  }


}
