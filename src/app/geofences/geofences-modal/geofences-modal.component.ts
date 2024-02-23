import { Component, OnInit } from '@angular/core';
import { GeofencesService } from '../services/geofences.service';
import { Modales, Datas } from './geofences-modal';
import { MinimapService } from 'src/app/multiview/services/minimap.service';
@Component({
  selector: 'app-geofences-modal',
  templateUrl: './geofences-modal.component.html',
  styleUrls: ['./geofences-modal.component.scss']
})
export class GeofencesModalComponent implements OnInit {
  datos: Modales[] = [];
  dataGeo: Datas[] = [];

  constructor(public geofencesService: GeofencesService, public minimapServices:MinimapService ) {
  }
  guardarRegistro(): void {

    console.log('Datos recibidos:');

  }

  fileKml(event: any) {
    const file: File = event.target.files[0];
    console.log("johan1", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        console.log("johan2", fileContent);
        const regex = /<Placemark>\s*<name>\s*([\s\S]*?)\s*<\/name>|<description>\s*([\s\S]*?)\s*<\/description>|<coordinates>\s*([\s\S]*?)\s*<\/coordinates>|<LineStyle>\s*<color>\s*([a-fA-F0-9]+)\s*<\/color>/g;
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
            item = {};
          }
        }
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
  }
  geocercaDet(item: string) {
    console.log("detallados: ", item);
    for (const i of this.dataGeo) {
      if (i.name == item) {
        console.log("aver: ",i);
        this.geofencesService.setData([i]);
        this.geofencesService.modalActiveGeoDet = true;
        this.geofencesService.action = 'add';
      }
    }

  }
  enviarDatosOtroComponente() {
    this.geofencesService.setData(this.dataGeo);
  }


  ngOnInit(): void {
    this.getdatacomp();
    this.minimapServices.mapCreationSource$.next(true);
  }
  getdatacomp() {
    this.geofencesService.getdatos().subscribe(
      response => {
        console.log("otradata:", response);
        this.datos = response;
      }
    )
  }

  activarCreateMap() {
    console.log("geocercamap");
    this.minimapServices.mapCreationSource$.next(true);
  }

}
