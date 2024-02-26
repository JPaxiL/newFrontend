import { Component, OnInit } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { Datas} from '../geofences-modal/geofences-modal';

@Component({
  selector: 'app-modal-geo-det',
  templateUrl: './modal-geo-det.component.html',
  styleUrls: ['./modal-geo-det.component.scss']
})
export class ModalGeoDetComponent implements OnInit {
  dataCompartida: Datas[] = [];

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

    this.geofencesService.getData1().subscribe((data:any) => {
      this.dataCompartida = data;
  console.log('Datos recibidos en otro componente:', this.dataCompartida);

  if (data.length > 0) {
    this.nombreZona = data[0].name;
    this.colorZona = data[0].color;
    this.verticesZona = data[0].coordinates;
    this.descripcion = data[0].descripcion;
  }
    });
   }

  ngOnInit(): void {
  }

}
