import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';

import Swal from 'sweetalert2';

import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';

// import { Draw } from 'leaflet-draw';

import 'leaflet-draw';

@Component({
  selector: 'app-geocerca-lists',
  templateUrl: './geocerca-lists.component.html',
  styleUrls: ['./geocerca-lists.component.scss']
})
export class GeocercaListsComponent implements OnInit {

  tblDataGeo = new Array();
  datosCargados = false;

  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,

  ) { }

  ngOnInit(): void {

    console.log("DATOS DE GEOCERCAS");
    // console.log(geocercas);
    this.mostrar_tabla();
  }

  mostrar_tabla() {
      let geos = this.geofencesService.getData();
      console.log(geos);

      this.tblDataGeo = [];

      for (let i = 0; i < geos.length; i++) {
        geos[i].zone_name_visible_bol = (geos[i].zone_name_visible === 'true');
        this.tblDataGeo.push({trama:geos[i]});
      }
      // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});

  }

  clickLocate(geo:any){
    console.log("localizar una geocerca");
    console.log(geo);
  }

  clickConfigurarGeocerca(id:number) {
    console.log('clickConfigurarGeocerca');
    this.geofencesService.nombreComponente = "AGREGAR";
    console.log(id);
    this.geofencesService.action         = "edit";
    this.geofencesService.idGeocercaEdit = id;



  }

  clickEliminarGeocerca(event:any, id:number) {
    console.log('clickEliminarGeocerca');
    console.log(id);
    this.geofencesService.action = "delete";

    event.preventDefault();
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];


    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar ${geo.zone_name}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          const res = await this.geofencesService.delete(id);
          // this.deleteAlert.emit();
          // this.clickShowPanel(this.nameComponent);

          for (var i = 0; i < this.geofencesService.geofences.length; i++) {
            if (this.geofencesService.geofences[i].id === id) {
              this.geofencesService.geofences.splice(i, 1);
              i--;
            }
          }
          this.mostrar_tabla();

        }
    }).then(data => {
      if(data.isConfirmed){
        Swal.fire(
          'Eliminado',
          'Los datos se eliminaron correctamente!!',
          'success'
        );
      }
    });


  }

  clickAgregarGeocerca() {
    this.geofencesService.nombreComponente = "AGREGAR";
    this.geofencesService.action         = "add";

    // var editableLayers = L.featureGroup().addTo(this.mapService.map);
    // var drawControl = new L.Control.Draw({
    //   edit: {
    //     featureGroup: editableLayers
    //   }
    // });


      // var polylineDrawer = new L.Draw.Polyline(this.mapService.map); // <-- throws error
      // polylineDrawer.enable();



  }

}
