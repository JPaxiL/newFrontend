import { Component, OnInit } from '@angular/core';
import { GeofencesService } from '../services/geofences.service';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

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
  public catZona: number=0;
  public vel2Zona: number=0;
  public vel3Zona:number=0;
  public velMax: number=0;
  public updatedAt: Date;
  public descripcion: string;
  public bolEliminado: boolean;
  public tagNameFontSize: number=0;
  public zoneType: string;
  public grupoConvoyId: number=0;
  public operationGrupeId: number=0;
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
    this.updatedAt = new Date(); // O asigna un valor apropiado
    this.descripcion = '';
    this.bolEliminado = false; // O asigna un valor booleano apropiado
  
    this.zoneType = '';
    this.geoTags = '';
}
  guardarRegistro(): void {

    console.log('Datos recibidos:', this.nombreZona, this.colorZona);
    // Puedes realizar cualquier lógica adicional con los datos aquí
  }
  ngOnInit(): void {
  }


}
