import {
  Injectable,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
// import { Component, OnInit, OnDestroy } from '@angular/core';

import { Vehicle } from '../models/vehicle';
import RefData from '../data/refData';
import * as L from 'leaflet';
import * as moment from 'moment';
import 'leaflet.markercluster';
import 'leaflet.markercluster.freezable';

import { VehicleConfigService } from './vehicle-config.service';
import { SocketWebService } from './socket-web.service';
import { VehicleService } from './vehicle.service';
import { FollowService } from './follow.service';
import { TabService } from 'src/app/panel/services/tab.service';
import { UserTracker } from 'src/app/multiview/models/interfaces';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { DriversService } from 'src/app/drivers/services/drivers.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/takeWhile';
// import 'rxjs/add/observable/timer'

@Injectable({
  providedIn: 'root',
})
export class MapService {
  gifBase64: string | undefined;
  @ViewChild('popupText') popupText!: ElementRef;

  public map!: L.Map;
  public respuesta: any = [];
  // public markerClusterGroup!: L.MarkerClusterGroup;
  public markerClusterGroup!: any;
  public markerClusterData!: any;
  public markerClusterGroupOnda!: any;
  public leafletEvent!: L.LeafletEvent;
  private dataFitBounds: [string, string][] = [];
  private marker: any = [];
  private markerOnda: any = [];
  private statusMap: boolean = false;
  private statusIcon: boolean = false;
  private interval!: any;
  private time: any = 1000;
  private time_stop = 'Calculando ...';
  private count = 0;
  private intervalStatus: boolean = false;
  private imeiPopup = 'ninguno';

  private clustering = true;

  private coords_vehicle: any[] = [];

  dif_mayor = 0.0;
  dif_divide = 0.0;
  dif_X = 0.0;
  dif_Y = 0.0;
  direction = '';
  final_direction = '';
  direction_X = '';
  direction_Y = '';
  // public mensaje: any = function(){
  //   console.log("lalalalal");
  // }
  // setInvterval = setInterval;

  timeNow: any = []; // Array para almacenar los tiempos
  timeWait: number = 7200000; // 7200 segundos en milisegundos
  //timeWait: number = 5000;

  @Output() sendData = new EventEmitter<any>();
  @Output() changeEye = new EventEmitter<any>();

  constructor(
    public vehicleService: VehicleService,
    private followService: FollowService,
    private socketWebService: SocketWebService,
    private tabService: TabService,
    private userDataService: UserDataService,
    private vehicleConfigService: VehicleConfigService,
    private driversService: DriversService,
    private http: HttpClient
  ) {
    // this.interval = setInterval(function(this){
    //   // this.localStorage
    //   this.mensaje();
    //   console.log("calculando ..",this);
    // },6000);
    this.markerClusterGroup = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      zoomToBoundsOnClick: false,
    });
    //PARA ONDAS
    this.markerClusterGroupOnda = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      zoomToBoundsOnClick: false,
    });

    this.vehicleService.drawIconMap.subscribe((e) => {
      this.onDrawIcon(this.map);
    });
    this.vehicleService.dataCompleted.subscribe((vehicles) => {
      if (this.tabService.currentTab == 'main-panel') {
        this.onDrawIcon(this.map);
      }
    });
    this.socketWebService.callback.subscribe((res) => {
      this.monitor(res, this.map);
    });
    this.followService.callback.subscribe((res) => {
      // //console.log("desde map service");
      this.followVehicle(res, this.map);
    });
    this.vehicleService.clickIcon.subscribe((res) => {
      this.followClickIcon(this.map, res);
    });
    this.vehicleService.clickEye.subscribe((res) => {
      this.eyeClick(this.map, res);
    });
    this.vehicleService.clickEyeAll.subscribe((res) => {
      this.eyeClickAll();
    });
    this.vehicleService.clickTag.subscribe((res) => {
      this.tagClick(res);
    });
    this.vehicleService.clickDriver.subscribe((res) => {
      this.tagDriver(res);
    });
    //CAMBIO DE NOMBRE/COD/NOMBRE
    this.vehicleService.clickSelection.subscribe((res) => {
      this.changeNameVehicles(res);
    });
    //ACTUALIZAR NOMBRE DEL VEHICLE
    this.vehicleConfigService.updateName.subscribe((res) => {
      this.updateNameMarker(res);
    });
    //ACTUALIZAR TOOLTIP Y POPUP INFO
    this.vehicleService.reloadNameDriver.subscribe((res) => {
      this.updateNameDriver(res);
    });
    this.vehicleService.calcTimeStop.subscribe((data) => {
      // console.log("event time stop res = ",data);

      let tiempoParada = '';
      //
      let aux_vehicle = this.vehicleService.getVehicle(data.imei);
      //
      let a = moment(new Date(data.dt_tracker));
      let b = moment(new Date());
      let d = moment(new Date(aux_vehicle.dt_tracker));

      /*
      c es el tiempo que demora en retornar la info desde backend (latencia)
      e corresponde a la ultima transmision???
      */
      let c = b.diff(a, 'seconds'); //retorno
      let e = d.diff(a, 'seconds'); //diff fecha
      // let c = 100;
      //dt_tracker es fecha tracker
      // console.log("speed  = ",data.speed);
      // console.log("calc c = ",c);
      // console.log("calc e = ",e);
      if (e == 0) {
        if (data.speed > 3 && c > 60) {
          // console.log("se cumplio condicion : item.speed > 3 km/h && c > 60 seg ");
          tiempoParada = '0 s';
        } else if (parseInt(data.res) == -1) {
          tiempoParada = 'Apagado mas de un día'; //"No se encontro Datos";
        } else if (parseInt(data.res) == -2) {
          tiempoParada = 'Duración mayor a 1 Dia';
        } else if (parseInt(data.res) == -3) {
          tiempoParada = 'En movimiento...';
        } else if (parseInt(data.res) == -5) {
          //inicio de parada
          tiempoParada = '0 s';
        } else if (parseInt(data.res) == -6) {
          //inicio de parada
          tiempoParada = '...Avise a soporte';
        } else if (parseInt(data.res) == -4) {
          // var tiempoParada = "En movimiento...";
          // item.paradaDesde  = item.paradaDesde;

          //var f_now = new Date( item.dt_tracker.replace(/-/g, "/") );
          let f_now = new Date();
          let f_past = new Date(data.paradaDesde);
          // var anios=f_now.diff(f_past,"seconds");
          let duracion = this.string_diffechas(f_past, f_now);
          //var tiempoParada = item.paradaDesde  + " - " +item.dt_tracker+ " - " +duracion;
          tiempoParada = duracion;
        } else {
          data.paradaDesde = data.res;

          //var f_now = new Date( item.dt_tracker.replace(/-/g, "/") );
          // let aux = moment(data.paradaDesde).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
          let f_now = new Date();
          // let f_past = new Date( aux );
          let f_past = new Date(data.paradaDesde);
          // let anios=f_now.diff(f_past,"seconds");
          let duracion = this.string_diffechas(f_past, f_now);
          // let tiempoParada = responseP[0] + " - " +item.dt_tracker+ " - " +duracion;
          tiempoParada = duracion;
        }
        // console.log("tiempoParada = ",tiempoParada);
        let aux = {
          imei: data.imei,
          name: data.name,
          dt_tracker: data.dt_tracker,
          nameconvoy: data.nameconvoy,
          namegrupo: data.namegrupo,
          nameoperation: data.nameoperation,
          namedriver: data.namedriver,
          longitud: data.longitud,
          latitud: data.latitud,
          speed: data.speed,
          ref: data.direction,
          tiempoParada: tiempoParada,
        };

        // console.log('DATA en MAP SERVICE ---------------->',data,aux);
        this.imeiPopup = data.imei;
        this.time_stop = tiempoParada;
        this.printPopup(aux);
      }
    });
  }
  setNameGroup(nameOpe: string, nameGru: string, nameCon: string): string {
    if (nameCon != 'Unidades Sin Convoy') {
      if (nameGru != 'Unidades Sin Grupo') {
        if (nameOpe != 'Unidades Sin Operacion') {
          return nameOpe + ' / ' + nameGru + ' / ' + nameCon;
          // return 'OPERACION/GRUPO/CONVOY: '+nameOpe+' / '+nameGru+' / '+nameCon;
        } else {
          return nameCon + ' / ' + nameGru;
          // return 'CONVOY/GRUPO:'+nameCon+' / '+nameGru;
        }
      } else {
        return nameCon;
        // return 'CONVOY: '+nameCon;
      }
    } else {
      return '';
      // return 'Vehículo Sin Agrupación';
    }
  }

  printPopup(data: any): void {
    let object = this.markerClusterGroup.getLayers();
    //console.log('printpopup', object);
    //console.log('printpopup', object);

    for (const key in object) {
      if (
        object[key]['_tooltip']['_content'] ==
        this.marker[data.imei]._tooltip._content
      ) {
        // Eliminar el tooltip activo
        const activeTooltip = document.querySelector('.tooltip');
        if (activeTooltip) {
          activeTooltip.remove();
        }

        const nameGroup = this.setNameGroup(
          data.nameoperation,
          data.namegrupo,
          data.nameconvoy
        );
        const googleMapsLink = `https://www.google.com/maps?q=${data.latitud},${data.longitud}`;

        if (nameGroup) {
          this.markerClusterGroup
            .getLayers()
            [key]['_popup'].setContent(
              '<div class="row"><div class="col-6" align="left"><strong>' +
                data.name +
                '</strong></div><div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded ">' +
                data.speed +
                ' km/h</strong></div></div>' +
                '<aside class="">' +
                '<small>' +
                nameGroup +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Conductor"><i class="fas fa-user-circle"></i></span> ' +
                data.namedriver +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Ubicacion"><i class="fas fa-crosshairs"></i></span><a href=" ' +
                googleMapsLink +
                '" target="_blank">' +
                data.latitud +
                ', ' +
                data.longitud +
                '</a></small><br>' +
                `<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Referencia"><i class="fas fa-map-marked-alt"></i></span> ` +
                data.ref +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Fecha de Transmision"><i class="fas fa-calendar-alt"></i></span> ' +
                data.dt_tracker +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Tiempo de Parada"><i class="fas fa-hourglass-half"></i></span> ' +
                data.tiempoParada +
                '</small>' +
                '</aside>'
            );
        } else {
          this.markerClusterGroup
            .getLayers()
            [key]['_popup'].setContent(
              '<div class="row"><div class="col-6" align="left"><strong>' +
                data.name +
                '</strong></div><div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded "> ' +
                data.speed +
                ' km/h</strong></div></div>' +
                '<aside class="">' +
                '<span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Conductor"><i class="fas fa-user-circle"></i></span> ' +
                data.namedriver +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Ubicacion"><i class="fas fa-crosshairs"></i></span><a href=" ' +
                googleMapsLink +
                '" target="_blank">' +
                data.latitud +
                ', ' +
                data.longitud +
                '</a></small><br>' +
                `<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Referencia"><i class="fas fa-map-marked-alt"></i></span> ` +
                data.ref +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Fecha de Transmision"><i class="fas fa-calendar-alt"></i></span> ' +
                data.dt_tracker +
                '</small><br>' +
                '<small><span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Tiempo de Parada"><i class="fas fa-hourglass-half"></i></span> ' +
                data.tiempoParada +
                '</small>' +
                '</aside>'
            );
        }
      }
    }
  }

  string_diffechas(a: any, b: any): any {
    let c = Math.floor((b - a) / 1000) % 60;
    let d = Math.floor((b - a) / 60000) % 60;
    let e = Math.floor((b - a) / 3600000) % 24;
    let f = Math.floor((b - a) / 86400000);
    let g = '';
    if (f > 0) {
      g = '' + f + ' d ' + e + ' h ' + d + ' min ' + c + ' s';
    } else if (e > 0) {
      g = '' + e + ' h ' + d + ' min ' + c + ' s';
    } else if (d > 0) {
      g = '' + d + ' min ' + c + ' s';
    } else if (c >= 0) {
      g = '' + c + ' s';
    }
    return g;
  }
  callMethod() {
    console.log('Call Function Every Five Seconds.', new Date());
  }
  eyeClick(map: any, IMEI: string) {
    //console.log('click eye IMEI = ',IMEI);
    const vehicles = this.vehicleService.vehicles;
    let vehicle = undefined;
    for (const i in vehicles) {
      if (vehicles[i].IMEI == IMEI) {
        vehicles[i].eye = !vehicles[i].eye;
        vehicle = vehicles[i];
      }
    }
    this.vehicleService.vehicles = vehicles;

    //
    //console.log(this.marker[IMEI]);
    if (vehicle!.eye == true) {
      // this.map.addLayer(this.marker[IMEI]);
      this.markerClusterGroup.addLayer(this.marker[IMEI]);
      // this.markerClusterGroupOnda.addLayer(this.markerOnda[IMEI]);
      this.tagClick(vehicle!.IMEI!, false);
      this.vehicleService.countOpenEyes++;
    } else {
      //console.log('quitar vehiculo del mapa ...',vehicle);
      // this.map.removeLayer(this.marker[IMEI]);
      this.markerClusterGroup.removeLayer(this.marker[IMEI]);
      // this.markerClusterGroupOnda.removeLayer(this.markerOnda[IMEI]);
      this.vehicleService.countOpenEyes--;
    }
    this.vehicleService.allEyes.state = this.vehicleService.countOpenEyes > 0;
  }
  eyeClickAll() {
    const vehicles = this.vehicleService.vehicles;
    for (const i in vehicles) {
      // if(vehicles[i].IMEI==IMEI){
      vehicles[i].eye = !vehicles[i].eye;
      //   vehicle = vehicles[i];
      // }
      if (vehicles[i].eye == true) {
        this.markerClusterGroup.addLayer(this.marker[vehicles[i].IMEI!]);
        // this.markerClusterGroupOnda.addLayer(this.markerOnda[vehicles[i].IMEI!]); //Para Ondas
        this.tagClick(vehicles[i].IMEI!, false);
      } else {
        this.markerClusterGroup.removeLayer(this.marker[vehicles[i].IMEI!]);
        // this.markerClusterGroupOnda.removeLayer(this.markerOnda[vehicles[i].IMEI!]); //Para Ondas
      }
    }
    this.vehicleService.vehicles = vehicles;
  }

  tagClick(IMEI: string, comesFromCheckbox?: boolean) {
    let vehicle = undefined;
    for (const i in this.vehicleService.vehicles) {
      if (this.vehicleService.vehicles[i].IMEI == IMEI) {
        if (comesFromCheckbox != false) {
          this.vehicleService.vehicles[i].tag =
            !this.vehicleService.vehicles[i].tag;
        }
        vehicle = this.vehicleService.vehicles[i];
      }
    }
    if (vehicle!.tag!) {
      this.marker[IMEI].openTooltip();
    } else {
      this.marker[IMEI].closeTooltip();
    }
  }
  tagDriver(IMEI: string, comesFromCheckbox?: boolean) {
    let vehicle = undefined;
    for (const i in this.vehicleService.vehicles) {
      if (this.vehicleService.vehicles[i].IMEI == IMEI) {
        if (comesFromCheckbox != false) {
          this.vehicleService.vehicles[i].tag_driver =
            !this.vehicleService.vehicles[i].tag_driver;
        }
        vehicle = this.vehicleService.vehicles[i];
      }
    }
    console.log(vehicle);
    const tempNameDriver =
      '<br><span style="display: block; text-align: center;">' +
      vehicle!.namedriver +
      '</span>';
    // Actualizar el contenido del tooltip del marcador específico
    if (vehicle!.tag_driver! && vehicle!.namedriver != 'No Especificado') {
      this.marker[IMEI].setTooltipContent(
        `<span>${vehicle!.name}</span>${tempNameDriver}`
      );
    } else {
      console.log('No tiene driver', vehicle!.namedriver, vehicle!.tag_driver);
      this.marker[IMEI].setTooltipContent(`<span>${vehicle!.name}</span>`);
    }
  }
  setDefaultName(show_name: string): string {
    if (show_name == 'num_plate') {
      return 'Número de placa';
    } else if (show_name == 'cod_interno') {
      return 'Código interno';
    } else {
      return 'Nombre';
    }
  }
  changeNameVehicles(show_name: string) {
    let vehicle = undefined;
    let tempShowName = '';
    let defaultName = 'Nombre';
    defaultName = this.setDefaultName(tempShowName);
    for (const i in this.vehicleService.vehicles) {
      vehicle = this.vehicleService.vehicles[i];
      if (show_name == 'num_plate') {
        tempShowName = vehicle!.plate_number!;
      } else if (show_name == 'cod_interno') {
        tempShowName = vehicle!.cod_interno!;
      } else if (show_name == 'name') {
        tempShowName = vehicle!.name_old!;
      }

      if (tempShowName == null) {
        tempShowName = 'Unidad Sin ' + defaultName;
      }

      if (
        vehicle!.tag_driver == true &&
        vehicle!.namedriver != 'No Especificado'
      ) {
        const tempNameDriver =
          '<br><span style="display: block; text-align: center;">' +
          vehicle!.namedriver +
          '</span>';
        this.marker[vehicle!.IMEI!].setTooltipContent(
          `<span>${tempShowName}</span>${tempNameDriver}`
        );
      } else {
        this.marker[vehicle!.IMEI!].setTooltipContent(
          `<span>${tempShowName}</span>`
        );
      }
    }
  }

  updateNameMarker(vehicle: any) {
    // console.log('ESTO LLEGO A UPDATE NAME MARKER',vehicle);
    // console.log('ESTO TIENE THIS MARKER',this.marker[vehicle.tracker_imei]);
    let vehicleFound = this.vehicleService.vehicles.find(
      (vh) => vh.IMEI == vehicle.tracker_imei
    );
    // console.log(vehicleFound);
    if (vehicleFound) {
      if (
        vehicleFound!.tag_driver == true &&
        vehicleFound!.namedriver != 'No Especificado'
      ) {
        const tempNameDriver =
          '<br><span style="display: block; text-align: center;">' +
          vehicleFound!.namedriver +
          '</span>';
        this.marker[vehicleFound!.IMEI!].setTooltipContent(
          `<span>${vehicle.nombre}</span>${tempNameDriver}`
        );
      } else {
        this.marker[vehicleFound!.IMEI!].setTooltipContent(
          `<span>${vehicle.nombre}</span>`
        );
      }
    }
  }
  generateContentPopUp(vehicle: any): string {
    const googleMapsLink = `https://www.google.com/maps?q=${vehicle.latitud},${vehicle.longitud}`;
    const nameGroup = this.setNameGroup(
      vehicle.nameoperation,
      vehicle.namegrupo,
      vehicle.nameconvoy
    );
    let popupContent =
      '<div class="row"><div class="col-6" align="left"><strong>' +
      vehicle.name +
      '</strong></div><div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded ">' +
      vehicle.speed +
      ' km/h</strong></div></div>' +
      '<aside class="">';
    if (nameGroup) {
      popupContent += '<small>' + nameGroup + '</small><br>';
      console.log('EXISTE nameGroup');
    }
    popupContent +=
      '<span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Conductor 2"><i class="fas fa-user-circle"></i></span> ' +
      vehicle.namedriver +
      '</small><br>' +
      '<small><i class="fas fa-crosshairs"> Ubicacion: </i><a href=" ' +
      googleMapsLink +
      '" target="_blank">' +
      vehicle.latitud +
      ', ' +
      vehicle.longitud +
      '</a></small><br>' +
      // '<small>UBICACION: ' + vehicle.latitud + ', ' + vehicle.longitud + '</small><br>' +
      `<small><i class="fas fa-map-marked-alt"> Referencia: </i> ` +
      vehicle.ref +
      '</small><br>' +
      '<small><i class="fas fa-calendar-alt"> Fecha de Transmision: </i> ' +
      vehicle.dt_tracker +
      '</small><br>' +
      '<small><i class="fas fa-hourglass-half"> Tiempo de Parada: </i> ' +
      vehicle.tiempoParada +
      '</small>' +
      '</aside>';
    return popupContent;
  }
  updateNameDriver(vehicle: any) {
    console.log('Llego vehicle a map service->', vehicle);
    console.log('this.Marker', this.marker[vehicle.IMEI]);
    // let auxContentPopUp = this.generateContentPopUp(vehicle);
    //ACTUALIZAR CONTENIDO DEL POPUP DEL ICONO MARKER y EL CLUSTER
    // const markerToUpdate = this.markerClusterGroup.getLayers().find((layer: any) => {
    //   return layer._leaflet_id === this.marker[vehicle.IMEI]._leaflet_id;
    // });
    // console.log('Cluster Group Found ->',markerToUpdate);
    vehicle.dt_tracker = moment(vehicle.dt_tracker)
      .subtract(5, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    let options = {
      imei: vehicle.IMEI,
      name: vehicle.name,
      nameconvoy: vehicle.nameconvoy,
      namegrupo: vehicle.namegrupo,
      nameoperation: vehicle.nameoperation,
      namedriver: vehicle.namedriver,
      longitud: vehicle.longitud.toString(),
      latitud: vehicle.latitud.toString(),
      speed: vehicle.speed,
      dt_tracker: vehicle.dt_tracker, //luego de pasar por filtro
      paradaDesde: '',
      vehicleService: this.vehicleService,
    };
    this.timeStopAux(options);

    // this.marker[vehicle!.IMEI].setPopupContent(auxContentPopUp);

    // markerToUpdate.setPopupContent(auxContentPopUp);
    //ACTUALIZA EL TOOLTIP LOS ACTIVADOS
    if (
      vehicle!.tag_driver == true &&
      vehicle!.namedriver != 'No Especificado'
    ) {
      const tempNameDriver =
        '<br><span style="display: block; text-align: center;">' +
        vehicle!.namedriver +
        '</span>';
      this.marker[vehicle!.IMEI!].setTooltipContent(
        `<span>${vehicle.name}</span>${tempNameDriver}`
      );
    } else {
      this.marker[vehicle!.IMEI!].setTooltipContent(
        `<span>${vehicle.name}</span>`
      );
    }
  }

  followClickIcon(map: any, IMEI: string) {
    const vehicles = this.vehicleService.vehicles;
    this.dataFitBounds = [];
    //
    for (const i in vehicles) {
      if (vehicles[i].IMEI == IMEI) {
        const aux2: [string, string] = [
          vehicles[i].latitud!,
          vehicles[i].longitud!,
        ];
        this.dataFitBounds.push(aux2);
        //console.log('coordenadas',aux2);
      }
    }
    //
    if (this.dataFitBounds.length > 0) {
      map.fitBounds(this.dataFitBounds);
    }
  }
  followVehicle(data: any, map: any): void {
    /*
      - aspecto grafico
      - interno

    */
    // update element
    const vehicles = this.vehicleService.vehicles;
    this.dataFitBounds = [];

    for (const i in vehicles) {
      if (data.IMEI == vehicles[i].IMEI) {
        vehicles[i].follow = !vehicles[i].follow;
      }
      if (vehicles[i].follow) {
        const aux2: [string, string] = [
          vehicles[i].latitud!,
          vehicles[i].longitud!,
        ];
        this.dataFitBounds.push(aux2);
      }
    }

    if (this.dataFitBounds.length > 0) {
      map.fitBounds(this.dataFitBounds);
    }
  }
  // timeStopexample(): void{
  //   console.log("hola ",localStorage.getItem("dateItem"));
  //   this.time_stop = "recalculandoXD";
  //   let object = this.markerClusterGroup.getLayers();
  //   let cont = 0;
  //   for (const key in object) {
  //     // console.log(object[key]['_popup']['_content']);
  //     let content = object[key]['_popup']['_content'];
  //     content = content.split(' ');
  //     content[20]="nuevo";
  //     content = content.join(" ");
  //     console.log("content",content);
  //     object[key]['_popup']['_content'] = content;
  //   }
  // }
  diffSecondsNow(fecha: string): boolean {
    // Obtener la fecha y hora actual
    const fechaActual = moment();
    // Parsear la fecha proporcionada
    const fechaComparar = moment(fecha);
    // Calcular la diferencia en segundos
    const diferenciaEnSegundos = fechaActual.diff(fechaComparar, 'seconds');
    // Comprobar si la diferencia es mayor a 15 segundos
    // console.log('Diff ',diferenciaEnSegundos);
    // console.log('Resulta ',diferenciaEnSegundos>15);
    return diferenciaEnSegundos > 15;
  }


  public async calculateDirection(coord1: any, coord2: any): Promise<string> {
    const angle = Math.atan2(coord1.lat - coord2.lat, coord1.lng - coord2.lng) * (180 / Math.PI);

    if (angle > -22.5 && angle <= 22.5) return 'right';
    if (angle > 22.5 && angle <= 67.5) return 'upright';
    if (angle > 67.5 && angle <= 112.5) return 'up';
    if (angle > 112.5 && angle <= 157.5) return 'upleft';
    if (angle > 157.5 || angle <= -157.5) return 'left';
    if (angle > -157.5 && angle <= -112.5) return 'downleft';
    if (angle > -112.5 && angle <= -67.5) return 'down';
    if (angle > -67.5 && angle <= -22.5) return 'downright';

    return '';
  }


  async monitor(data: any, map: any): Promise<void> {
    if (this.vehicleService.statusDataVehicle) {
      const vehicles = this.vehicleService.vehicles;
      const vehiclestree = this.vehicleService.vehiclesTree;

      //console.log('vehicles', vehicles);

      const resultado = vehicles.find(
        (vehi: any) => vehi.IMEI == data.IMEI.toString()
      );
      if (resultado) {
        // if(data.driver_id != '0'){
        //   console.log('DATA DRIVER_ID ',data.driver_id);
        // }
        // update dataCompleted
        // //console.log("update data");
        const index = vehicles.indexOf(resultado);
        const fecha_tracker = moment(data.fecha_tracker)
          .subtract(5, 'hours')
          .format('YYYY-MM-DD HH:mm:ss');
        // if(this.diffSecondsNow(fecha_tracker) && vehicles[index].timeLast == false){
        //   vehicles[index].timeLast = true;
        //   console.log('DATA NO ENTRA POR SER DE VOLCADO');
        //   return;
        // }

        if (
          vehicles[index].dt_tracker != fecha_tracker &&
          vehicles[index].driver_id != data.driver_id &&
          !this.diffSecondsNow(fecha_tracker)
        ) {
          data.fecha_tracker = fecha_tracker;
          // console.log('Fecha Diferente',vehicles[index].dt_tracker,fecha_tracker);
          // console.log('TRAMA',data);
          vehicles[index].driver_id = data.driver_id;
          // OBTENER EL NOMBRE EN BASE AL ID DRIVER
          vehicles[index].namedriver = this.driversService.getDriverById(
            data.driver_id
          );
          vehicles[index].id_conductor = data.driver_id;
          // console.log(
          //   'DRIVER ->',
          //   data.IMEI,
          //   ' - ',
          //   data.driver_id,
          //   ':',
          //   vehicles[index].namedriver
          // );
        }

        vehicles[index].latitud = data.Latitud.toString();
        vehicles[index].longitud = data.Longitud.toString();
        vehicles[index].speed = data.Velocidad;

        vehicles[index].dt_server = data.fecha_server;
        // vehicles[index].dt_tracker = data.fecha_tracker;
        vehicles[index].dt_tracker = fecha_tracker;
        vehicles[index].altitud = data.Altitud;
        vehicles[index].señal_gps = data.señal_gps;
        vehicles[index].señal_gsm = data.señal_gsm;
        vehicles[index].parametros = data.Parametros;
        // const date = moment(vehicles[index].dt_tracker).subtract(5, 'hours');

        vehicles[index] = this.vehicleService.formatVehicle(vehicles[index]);

        // MOSTRAR Ibutton ID de parametrosGet y su IMEI
        if (
          vehicles[index].parametros!.includes('iButton ID=') &&
          (vehicles[index].parametrosGet as any)['iButton ID'] !== 0
        ) {
          // console.log(
          //   'IButton ID:',
          //   (vehicles[index].parametrosGet as any)['iButton ID']
          // );
          // console.log('IMEI:', vehicles[index].IMEI);
        }
        if (this.imeiPopup == data.IMEI.toString()) {
          let options = {
            imei: data.IMEI,
            name: vehicles[index].name,
            nameconvoy: vehicles[index].nameconvoy,
            namegrupo: vehicles[index].namegrupo,
            nameoperation: vehicles[index].nameoperation,
            namedriver: vehicles[index].namedriver,
            longitud: data.Longitud,
            latitud: data.Latitud,
            speed: data.Velocidad,
            dt_tracker: vehicles[index].dt_tracker, //luego de pasar por filtro
            paradaDesde: '',
            vehicleService: this.vehicleService,
          };
          this.timeStopAux(options);
        }

        // vehicles[index].
        this.vehicleService.vehicles = vehicles;
        // //console.log('listable =====',this.vehicleService.listTable);
        if (this.vehicleService.listTable == 0) {
          this.vehicleService.reloadTable.emit();
        } else if (this.vehicleService.listTable == 1) {
          //add register to treetable;
          const tree = this.vehicleService.vehiclesTree;

          // Encuentra la operación en el árbol
          const existingOperation = tree.find(
            (node) => node.data.id === vehicles[index].idoperation
          );
          // console.log('************************************+ ----> ESTE ES EL VEHICULO ',vehicles[index]);

          if (existingOperation) {
            // Encuentra el grupo en la operación
            const existingGroup = existingOperation.children!.find(
              (node) => node.data.id === vehicles[index].idgrupo
            );

            if (existingGroup) {
              // Encuentra el convoy en el grupo
              const existingConvoy = existingGroup.children!.find(
                (node) => node.data.id === vehicles[index].idconvoy
              );

              if (existingConvoy) {
                // Si el convoy existe, actualiza su data con los datos de vehicle[index]
                // console.log('************************************+ ----> ESTE ES EL CONVOY ',existingConvoy);
                // Busca el vehículo dentro de existingConvoy.children
                const existingVehicle = existingConvoy.children!.find(
                  (vehiculo) => vehiculo.data.id === vehicles[index].id
                );

                if (existingVehicle) {
                  // // Aquí puedes actualizar la información del vehículo
                  // console.log('************************************+ ----> ESTE ES EL NAME VEHICLE ',vehicles[index].name);
                  // console.log('************************************+ ----> ESTE ES EL TREE SIN UPDATE ',tree);

                  existingVehicle.data = vehicles[index];

                  // Asigna la estructura de datos modificada a this.vehicleService.vehiclesTree
                  this.vehicleService.vehiclesTree = tree;

                  // Emite el evento para actualizar la vista (si es necesario)
                  this.vehicleService.reloadTableTree.emit();

                  // console.log('************************************+ ----> ESTE ES EL TREE UPDATE ',tree);
                  // Imprime la información actualizada del vehículo
                } else {
                  // El vehículo no se encontró
                  // console.log('Vehículo no encontrado');
                }
              }
            }
          }

          this.vehicleService.reloadTableTree.emit();
        }

        // this.map.removeLayer(this.marker[data.IMEI]);
        // this.markerClusterGroup.removeLayer(this.marker[data.IMEI]);
        if (vehicles[index].eye) {
          // console.log('data.longitud', data);
          // console.log('socket vehicles[index].name',vehicles[index].name);
          // console.log('socket vehicles[index]',vehicles[index]);
          // //console.log()
          //buscando layer
          // console.log('buscando layer');
          let cont = 0;
          let object = this.markerClusterGroup.getLayers();
          //let onda = this.markerClusterGroupOnda.getLayers();

          for (const key in object) {
            if (
              object[key]['_tooltip']['_content'] ==
              '<span>' + vehicles[index].name + '</span>'
            ) {
              cont++;
              let oldCoords = this.markerClusterGroup
                .getLayers()
                [key].getLatLng();



              let coord = {
                lat: vehicles[index].latitud,
                lng: vehicles[index].longitud,
              };


              if (
                vehicles[index].parametros!.includes('di4=') ||
                vehicles[index].parametros!.includes('Custom_ign=')
              ) {

                let iconUrl = vehicles[index].custom_svg;
                
                if (
                  vehicles[index].parametros!.includes('di4=1') ||
                  vehicles[index].parametros!.includes('Custom_ign=1')
                ) {
                  
                  if(this.userDataService.changeRotateIcon == true && this.userDataService.stateCustomDirectionSvg == true ){
                    this.dif_mayor = 0.0;
                    this.dif_divide = 0.0;
                    this.dif_X = 0.0;
                    this.dif_Y = 0.0;
                    this.direction = '';
                    this.final_direction = '';
                    this.direction_X = '';
                    this.direction_Y = '';

                    if (
                      coord.lat != oldCoords.lat &&
                      coord.lng != oldCoords.lng
                    ) {
                      this.direction = await this.calculateDirection(coord, oldCoords);


                      iconUrl = this.userDataService.getDirectionSvg(vehicles[index].tipo!,'default',this.direction);

                    } 
                  }

                  if (this.userDataService.changeItemIcon == 'vehicles') {
                     if(this.userDataService.changeRotateIcon == true  && this.userDataService.stateVehiclesDirectionSvg == true ){
                      this.dif_mayor = 0.0;
                      this.dif_divide = 0.0;
                      this.dif_X = 0.0;
                      this.dif_Y = 0.0;
                      this.direction = '';
                      this.final_direction = '';
                      this.direction_X = '';
                      this.direction_Y = '';

                      if (
                        coord.lat != oldCoords.lat &&
                        coord.lng != oldCoords.lng
                      ) {
                        this.direction = await this.calculateDirection(coord, oldCoords);
                        let state = this.getStateVehicle(vehicles[index]);

                        console.log("state",state, vehicles[index].name)

                        iconUrl = this.userDataService.getDirectionSvg(vehicles[index].tipo!,state,this.direction);
                        console.log("iconurlestado", state,this.direction)

                      } 
                    }else{
                      let state = this.getStateVehicle(vehicles[index]);
                      
                      iconUrl = this.userDataService.getDirectionSvg(vehicles[index].tipo!,state);
                    }
                     
    
                      


                  } else if (this.userDataService.changeItemIcon == 'ondas') {
                    console.log('ONDA');
                    let iconUrl2 = await this.getStateOndas(vehicles[index]);
                    this.markerClusterGroupOnda.getLayers()[key]['options'][
                      'icon'
                    ]['options']['iconUrl'] = iconUrl2;
                    this.markerClusterGroupOnda
                      .getLayers()
                      [key].setLatLng(coord);

                    
                  }
                }
                this.timeChangeIconUrl(
                  vehicles[index].IMEI!,
                  vehicles[index].custom_svg!,
                  key
                );
                // CREA EL MARKERCLUSTER
                const googleMapsLink = `https://www.google.com/maps?q=${vehicles[index].latitud},${vehicles[index].longitud}`;
                const nameGroup = this.setNameGroup(
                  vehicles[index].nameoperation!,
                  vehicles[index].namegrupo!,
                  vehicles[index].nameconvoy!
                );
                if (nameGroup) {
                  this.markerClusterGroup.getLayers()[key]['_popup'][
                    '_content'
                  ] =
                    '<div class="row"><div class="col-6" align="left"><strong>' +
                    vehicles[index].name +
                    '</strong></div><div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded ">' +
                    vehicles[index].speed +
                    ' km/h</strong></div></div>' +
                    '<aside class="">' +
                    '<small>' +
                    nameGroup +
                    '</small><br>' +
                    '<small><i class="fas fa-user-circle"></i> ' +
                    vehicles[index].namedriver +
                    '</small><br>' +
                    '<small><i class="fas fa-crosshairs"></i><a href=" ' +
                    googleMapsLink +
                    '" target="_blank">' +
                    vehicles[index].latitud +
                    ', ' +
                    vehicles[index].longitud +
                    '</a></small><br>' +
                    `<small><i class="fas fa-map-marked-alt"></i> ` +
                    '     Calculando ...' +
                    '</small><br>' +
                    '<small><i class="fas fa-calendar-alt"></i> ' +
                    vehicles[index].dt_tracker +
                    '</small><br>' +
                    '<small><i class="fas fa-hourglass-half"></i> ' +
                    '     Calculando ...';
                  ('</aside>');
                } else {
                  this.markerClusterGroup.getLayers()[key]['_popup'][
                    '_content'
                  ] =
                    '<div class="row"><div class="col-6" align="left"><strong>' +
                    vehicles[index].name +
                    '</strong></div><div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded ">' +
                    vehicles[index].speed +
                    ' km/h</strong></div></div>' +
                    '<aside class="">' +
                    '<small><i class="fas fa-user-circle"></i> ' +
                    vehicles[index].namedriver +
                    '</small><br>' +
                    // '<small>UBICACION: '+vehicles[index].latitud+', '+vehicles[index].longitud+'</small><br>'+
                    '<small><i class="fas fa-crosshairs"></i><a href=" ' +
                    googleMapsLink +
                    '" target="_blank">' +
                    vehicles[index].latitud +
                    ', ' +
                    vehicles[index].longitud +
                    '</a></small><br>' +
                    `<small><i class="fas fa-map-marked-alt"></i> ` +
                    '     Calculando ...' +
                    '</small><br>' +
                    '<small><i class="fas fa-calendar-alt"></i> ' +
                    vehicles[index].dt_tracker +
                    '</small><br>' +
                    '<small><i class="fas fa-hourglass-half"></i> ' +
                    '     Calculando ...';
                  ('</aside>');
                }

                this.markerClusterGroup.getLayers()[key]['options']['icon'][
                  'options'
                ]['iconUrl'] = iconUrl;

                this.markerClusterGroup.getLayers()[key]['options']['icon'][
                  'options'
                ]['shadowSize'] = [30, 30];
                // AÑADE LA FLECHA DE DIRECCION
                // if(vehicles[index].speed != 0){
                if (
                  (vehicles[index].parametros!.includes('|di4=1|') ||
                    vehicles[index].parametros!.includes('Custom_ign=1')) &&
                  vehicles[index].speed != 0
                ) {
                  //ESTA EN MOVIMIENTO

                  this.dif_mayor = 0.0;
                  this.dif_divide = 0.0;
                  this.dif_X = 0.0;
                  this.dif_Y = 0.0;
                  this.direction = '';
                  this.final_direction = '';
                  this.direction_X = '';
                  this.direction_Y = '';

                  if (
                    coord.lat != oldCoords.lat &&
                    coord.lng != oldCoords.lng
                  ) {
                    if (coord.lat! > oldCoords.lat) {
                      //arriba
                      this.direction_Y = 'up';
                      this.dif_Y = parseFloat(coord.lat!) - oldCoords.lat;
                      //console.log("dif_Y",this.dif_Y)
                      if (this.dif_Y >= this.dif_mayor) {
                        this.dif_mayor = this.dif_Y;
                        this.direction = 'up';
                        this.dif_divide = this.dif_Y / 2;
                      }
                    } else {
                      //abajo
                      this.direction_Y = 'down';
                      this.dif_Y = oldCoords.lat - parseFloat(coord.lat!);
                      if (this.dif_Y >= this.dif_mayor) {
                        this.dif_mayor = this.dif_Y;
                        this.direction = 'down';
                        this.dif_divide = this.dif_Y / 2;
                      }
                    }

                    if (coord.lng! > oldCoords.lng) {
                      //derecha
                      this.direction_X = 'right';
                      this.dif_X = parseFloat(coord.lng!) - oldCoords.lng;
                      if (this.dif_X >= this.dif_mayor) {
                        this.dif_mayor = this.dif_X;
                        this.direction = 'right';
                        this.dif_divide = this.dif_X / 2;
                      }
                    } else {
                      //izquierda
                      this.direction_X = 'left';
                      this.dif_X = oldCoords.lng - parseFloat(coord.lng!);
                      if (this.dif_X >= this.dif_mayor) {
                        this.dif_mayor = this.dif_X;
                        this.direction = 'left';
                        this.dif_divide = this.dif_X / 2;
                      }
                    }

                    if (this.direction == 'up' || this.direction == 'down') {
                      if (this.dif_X >= this.dif_divide) {
                        this.final_direction = `${this.direction}-${this.direction_X}`;
                        iconUrl = "./assets/images/objects/statevehicles/vanD.svg"
                      } else {
                        this.final_direction = `${this.direction}`;
                        iconUrl = "./assets/images/objects/statevehicles/vanD.svg"
                      }
                    } else {
                      if (this.dif_Y >= this.dif_divide) {
                        this.final_direction = `${this.direction_Y}-${this.direction}`;
                        iconUrl = "./assets/images/objects/statevehicles/vanD.svg"
                      } else {
                        this.final_direction = `${this.direction}`;
                        iconUrl = "./assets/images/objects/statevehicles/vanD.svg"
                      }
                    }

                    //this.changePositionArrow(this.final_direction,key);
                    if (
                      this.userDataService.changeItemIcon == 'cursor' &&
                      vehicles[index].speed! > vehicles[index].limit_speed!
                    ) {
                      this.markerClusterGroup.getLayers()[key]['options'][
                        'icon'
                      ]['options'][
                        'shadowUrl'
                      ] = `./assets/images/excessCursor/arrow_${this.final_direction}.webp`;
                      this.markerClusterGroup.getLayers()[key]['options'][
                        'icon'
                      ]['options']['shadowAnchor'] = [14, 60];
                    } else {
                      this.markerClusterGroup.getLayers()[key]['options'][
                        'icon'
                      ]['options'][
                        'shadowUrl'
                      ] = `./assets/images/arrow_${this.final_direction}.webp`;
                      this.markerClusterGroup.getLayers()[key]['options'][
                        'icon'
                      ]['options']['shadowAnchor'] = [14, 60];
                    }
                  } else {
                    if (
                      this.markerClusterGroup.getLayers()[key]['options'][
                        'icon'
                      ]['options']['shadowUrl']
                    ) {
                      let old_direction = this.markerClusterGroup
                        .getLayers()
                        [key]['options']['icon']['options']['shadowUrl'].split(
                          '_'
                        );
                      //this.changePositionArrow(old_direction[1],key);
                      if (
                        this.userDataService.changeItemIcon == 'cursor' &&
                        vehicles[index].speed! > vehicles[index].limit_speed!
                      ) {
                        this.markerClusterGroup.getLayers()[key]['options'][
                          'icon'
                        ]['options'][
                          'shadowUrl'
                        ] = `./assets/images/excessCursor/arrow_${old_direction[1]}`;




                        this.markerClusterGroup.getLayers()[key]['options'][
                          'icon'
                        ]['options']['shadowAnchor'] = [14, 60];
                      } else {
                        this.markerClusterGroup.getLayers()[key]['options'][
                          'icon'
                        ]['options'][
                          'shadowUrl'
                        ] = `./assets/images/arrow_${old_direction[1]}`;



                        this.markerClusterGroup.getLayers()[key]['options'][
                          'icon'
                        ]['options']['shadowAnchor'] = [14, 60];
                      }
                    } else {
                      this.markerClusterGroup.getLayers()[key]['options'][
                        'icon'
                      ]['options']['shadowUrl'] = '';
                      //console.log('se borra la flecha', vehicles[index].name);
                      //console.log(vehicles[index].name);
                    }
                  }
                } else if (
                  this.userDataService.changeItemIcon == 'cursor' &&
                  vehicles[index].speed == 0 &&
                  (vehicles[index].parametros!.includes('|di4=1|') ||
                    vehicles[index].parametros!.includes('Custom_ign=1'))
                ) {
                  if (
                    this.markerClusterGroup.getLayers()[key]['options']['icon'][
                      'options'
                    ]['shadowUrl']
                  ) {
                    let old_direction = this.markerClusterGroup
                      .getLayers()
                      [key]['options']['icon']['options']['shadowUrl'].split(
                        '_'
                      );
                    this.markerClusterGroup.getLayers()[key]['options']['icon'][
                      'options'
                    ][
                      'shadowUrl'
                    ] = `./assets/images/relentiCursor/arrow_${old_direction[1]}`;
                    this.markerClusterGroup.getLayers()[key]['options']['icon'][
                      'options'
                    ]['shadowAnchor'] = [14, 60];
                  } else {
                    this.markerClusterGroup.getLayers()[key]['options']['icon'][
                      'options'
                    ][
                      'shadowUrl'
                    ] = `./assets/images/relentiCursor/arrow_down-left.webp`;
                    this.markerClusterGroup.getLayers()[key]['options']['icon'][
                      'options'
                    ]['shadowAnchor'] = [14, 60];
                  }
                } else {
                  this.markerClusterGroup.getLayers()[key]['options']['icon'][
                    'options'
                  ]['shadowUrl'] = '';
                }
                this.markerClusterGroup.getLayers()[key].setLatLng(coord);

                let aux = this.markerClusterGroup.getLayers()[key];
                // console.log('despues content popup',this.markerClusterGroup.getLayers()[key]['_popup']['_content']);
                //follow true
                this.dataFitBounds = [];
                for (const i in vehicles) {
                  if (vehicles[i].follow) {
                    const aux2: [string, string] = [
                      vehicles[i].latitud!,
                      vehicles[i].longitud!,
                    ];
                    this.dataFitBounds.push(aux2);
                  }
                }
                if (this.dataFitBounds.length > 0) {
                  map.fitBounds(this.dataFitBounds);
                }
              } else {
                // console.log('TRAMA IGNORADA NO CAMBIA ESTADO VEHICULO ----->');
              }
            }
          }
        }
      } //end if index vehicle
    }
  }

  changeStatusEye(id: number): void {
    this.changeEye.emit(id);
  }

  sendDataMap(data: Vehicle[]): void {
    this.sendData.emit(data);
  }

  loadMap(map: any): void {
    // //console.log("loadMap");
    this.map = map;
  }

  changePositionArrow(direction: string, key: any) {
    switch (direction) {
      case 'up':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [14, 60];
        break;
      case 'up-left':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [50, 60];
        break;
      case 'up-right':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [-20, 60];
        break;
      case 'down':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [13, 0];
        break;
      case 'down-left':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [13, 30];
        break;
      case 'down-right':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [13, 30];
        break;
      case 'left':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [50, 30];
        break;
      case 'right':
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowAnchor'
        ] = [-20, 30];
        break;
    }
  }

  // deleteMarker(IMEI: string):void{
  //   this.map.removeLayer(this.marker[IMEI]);
  // }

  onDrawIcon(map: any): void {
    this.map = map;
    let group: any[] = [];
    const e = this.vehicleService.vehicles;
    let aux_cont = 0;

    const transmissionStatusColor: any = {
      10: 'green',
      20: 'blue',
      30: 'purple',
      40: 'black',
      50: 'orange',
      60: 'red',
      100: 'transm-color-not-defined',
    };

    this.markerClusterGroup.clearLayers();
    this.markerClusterGroupOnda.clearLayers();
    for (const property in e) {
      //console.log("e----- ", property);
      //console.log("e.hasOwnProperty(property)", e.hasOwnProperty(property));
      //console.log("e[property].eye", e[property].eye);
      if (e.hasOwnProperty(property) && e[property].eye == true) {
        if (this.statusMap == false) {
          const aux2: [string, string] = [
            e[property].latitud!,
            e[property].longitud!,
          ];
          this.dataFitBounds.push(aux2);
        }
        // this.map.removeLayer(this.demo);
        // this.drawIcon(e[property], map, Number(e[property].latitud), Number(e[property].longitud));
        this.drawIcon(e[property], map);
      }
    }

    if (this.dataFitBounds.length > 0) {
      // //console.log("dataFitBounds map",this.dataFitBounds);
      map.fitBounds(this.dataFitBounds);
    }
    this.statusMap = true;
    this.dataFitBounds = [];
    //EVENTO cluster lista
    this.markerClusterGroup.on('clusterclick', function (a: any) {
      //console.log('click cluster...........');
      var coords = a.layer.getLatLng();
      //console.log(a.layer.getAllChildMarkers());
      var lista = '<table class="infovehiculos"><tbody>';
      var array = a.layer.getAllChildMarkers();
      //console.log('array'+array);
      for (const i in array) {
        var aaa = array[i]['_tooltip']['_content'];
        //console.log(aaa.replace(/<\/?[^>]+(>|$)/g, ""));
        var vehicleData = e.find(
          (vehicle: UserTracker) =>
            vehicle.name == aaa.replace(/<\/?[^>]+(>|$)/g, '')
        );
        var transmissionColorClass =
          typeof vehicleData != 'undefined'
            ? transmissionStatusColor[vehicleData.point_color!]
            : 'transm-color-not-defined';
        lista =
          lista +
          '<tr><td><div class="dot-vehicle ' +
          transmissionColorClass +
          '"></div></td><td>' +
          aaa +
          '</td></tr>';
      }
      // for (var i=0; i<array.length; i++){
      //     var aaa = array[i].label._content.split(' <');
      //     // //console.log(aaa[0]);
      //     var bbb = array[i].label._content.split('color:');
      //     var ccc = bbb[1].split(';');
      //     //console.log(aaa[0]+" - color css : "+ccc[0]);
      //     lista = lista + '<tr style="margin:10px;"><td><div style="border-radius: 50%; width: 10px; height: 10px; background-color:' + ccc[0] + ';"></div></td><td style="font-size: 14px;">' + aaa[0] + '</td></tr>';
      // }
      lista = lista + '</tbody></table>';
      var popupMarker = L.popup({
        maxHeight: 400,
        closeButton: false,
        closeOnClick: true,
        autoClose: true,
        className: 'popupList',
      })
        .setLatLng([coords.lat, coords.lng])
        .setContent(lista)
        .openOn(map);
    });
  }
  // private
  private groupAllv2(distance: number): any {
    const e = this.vehicleService.vehicles;
    let group: any[] = [];
    let d = distance * -1;

    let i_group = 0;
    for (const index in e) {
      let i = parseInt(index);
      // group[i]={
      //   name:e[i].name,
      //   distance:0,
      //   data:[]
      // };
      // get x , y
      let x = Math.trunc(parseInt(e[i].longitud!) / d) * d + d;
      // //console.log('longitud vehicle ',e[i].longitud);
      // //console.log('longitud x', x);
      let y = Math.trunc(parseInt(e[i].latitud!) / d) * d + d;
      // //console.log('latitud vehicle ',e[i].latitud);
      // //console.log('latitud y', y);

      let status = true;
      for (const index2 in group) {
        let j = parseInt(index2);

        if (group[j]['long'] == x && group[j]['lat']) {
          group[j]['data'].push(e[i]);
          status = false;
        }
      }

      if (status) {
        //crate new group
        group[i_group] = {
          name: i_group + 1,
          long: x,
          lat: y,
          longitud: x + (d / 2) * -1,
          latitud: y + (d / 2) * -1,
          data: [],
        };
        group[i_group].data.push(e[i]);
        //console.log('create new group',i_group);
        i_group++;
      }
    }
    return group;
  }

  private mensaje() {
    //console.log("mensaje");
  }
  public timeStopAux(data: any): void {
    // console.log("calculando time stop aux ...");

    let ar_vel = data.speed;
    if (data.speed > 3) {
      ar_vel = data.speed;
      data.paradaDesde = false;
    } else {
      if (data.paradaDesde == false) {
        ar_vel = data.speed;
      } else {
        ar_vel = -1; // velocidad mayor a 6 para que no traiga historial
      }
    }
    let f_ini = moment(new Date())
      .add(-1, 'days')
      .add(5, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    let f_fin = moment(new Date())
      .add(5, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');

    let params = {
      imei: data.imei,
      name: data.name,
      nameconvoy: data.nameconvoy,
      namegrupo: data.namegrupo,
      nameoperation: data.nameoperation,
      namedriver: data.namedriver,
      longitud: data.longitud,
      latitud: data.latitud,
      speed: data.speed,
      dt_tracker: data.dt_tracker,
      paradaDesde: data.paradaDesde,
      fecha_i: f_ini,
      fecha_f: f_fin,
      vel: ar_vel,
    };

    this.vehicleService.postTimeStop(params);
  }
  //CUANDO SE HACE CLICK EN UN VEHICLE
  public timeStop(this: any): void {
    // console.log("this",this);
    // consultar data actual
    let vehicle = this.vehicleService.getVehicle(this.imei);
    // console.log('Click Vehicle ->',vehicle);
    this.speed = vehicle.speed;
    this.dt_tracker = vehicle.dt_tracker;

    // console.log("calculando time stop ...");

    let ar_vel = this.speed;
    if (this.speed > 3) {
      ar_vel = this.speed;
      this.paradaDesde = false;
    } else {
      if (this.paradaDesde == false) {
        ar_vel = this.speed;
      } else {
        ar_vel = -1; // velocidad mayor a 6 para que no traiga historial
      }
    }

    let f_ini = moment(new Date())
      .add(-1, 'days')
      .add(5, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    let f_fin = moment(new Date())
      .add(5, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');

    let params = {
      imei: this.imei,
      name: this.name,
      nameconvoy: this.nameconvoy,
      namegrupo: this.namegrupo,
      nameoperation: this.nameoperation,
      namedriver: vehicle.namedriver,
      longitud: this.longitud,
      latitud: this.latitud,
      speed: this.speed,
      dt_tracker: this.dt_tracker,
      paradaDesde: this.paradaDesde,
      fecha_i: f_ini,
      fecha_f: f_fin,
      vel: ar_vel,
    };
    this.vehicleService.postTimeStop(params);
  }

  public getStateVehicle(vehicle: UserTracker): string {
    //console.log("vehicle",vehicle)
    if (vehicle.speed != 0 && vehicle.speed! < vehicle.limit_speed!) {
      return 'movement';
    } else if (vehicle.speed == 0) {
      return 'relenti';
    } else if (vehicle.speed != 0 && vehicle.speed! > vehicle.limit_speed!) {
      return 'excess';
    }
    return 'default';
  }

  public async getStateOndas(data: any): Promise<string> {
    //console.log('detsateondas', data);
    if (
      data.parametros!.includes('di4=1') ||
      data.parametros!.includes('Custom_ign=1')
    ) {
      if (data?.speed != 0 && data?.speed! < data?.limit_speed!) {
       //console.log('velocidad < 90', data?.speed);
        //console.log('velocidad < 90 IMEI', data?.IMEI);
        return './assets/images/objects/nuevo/gif/onda_verde.gif';
      } else if (data?.speed != 0 && data?.speed! > data?.limit_speed!) {
        //console.log('velocidad > 90', data?.speed);
        return './assets/images/objects/nuevo/gif/onda_roja.gif';
      } else if (data?.speed == 0) {
        //console.log('velocidad == 0 ', data?.speed);
        return './assets/images/objects/nuevo/gif/onda_azul.gif';
      } else {
        return './assets/images/objects/nuevo/gif/blanco.png';
      }
    }
    return './assets/images/objects/nuevo/gif/blanco.png';
  }

  public iconSvg (data: any, map: any){
    let iconUrl = data.custom_svg;
    //console.log("iconosvg",icon)
  }


  private async drawIcon(data: any, map: any): Promise<void> {
    let iconUrl = data.custom_svg;

    if (this.userDataService.changeItemIcon == 'ondas') {
      let iconUrl2 = await this.getStateOndas(data);
      //console.log('1234', iconUrl2);
      const myIcono = L.icon({
        iconUrl: iconUrl2,
        iconSize: [60, 60],
        iconAnchor: [33, 43],
      });

      const tempMarker1 = L.marker([data.latitud, data.longitud], {
        icon: myIcono,
      }).setZIndexOffset(-1);
      this.marker[data.IMEI] = tempMarker1;
      this.markerClusterGroupOnda.addLayer(tempMarker1);
      this.markerClusterGroupOnda.addTo(this.map);
    }

    //}

    const iconMarker = L.icon({
      iconUrl: iconUrl,
      iconSize: [55, 55],
      iconAnchor: [30, 45],
      popupAnchor: [-3, -40],
    });

    let nameGroup = this.setNameGroup(
      data.nameoperation,
      data.namegrupo,
      data.nameconvoy
    );
    const googleMapsLink = `https://www.google.com/maps?q=${data.latitud},${data.longitud}`;
    if (nameGroup) {
      var popupText =
        '<div class="row"><div class="col-6" align="left"><strong>' +
        data.name +
        '</strong></div>' +
        '<div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded" ' +
        data.speed +
        ' km/h</strong></div></div>' +
        '<aside #popupText class="">' +
        '<small>' +
        nameGroup +
        '</small><br>' +
        // '<small>CONVOY: '+data.nameconvoy+'</small><br>'+
        '<small><i class="fas fa-user-circle"></i> ' +
        data.namedriver +
        '</small><br>' +
        // '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
        '<small><i class="fas fa-crosshairs"></i><a href=" ' +
        googleMapsLink +
        '" target="_blank">' +
        data.latitud +
        ', ' +
        data.longitud +
        '</a></small><br>' +
        `<small><i class="fas fa-map-marked-alt"></i> ` +
        '     NN' +
        '</small><br>' +
        '<small><i class="fas fa-calendar-alt"></i> ' +
        data.dt_tracker +
        '</small><br>' +
        '<small><i class="fas fa-hourglass-half"></i> ' +
        this.time_stop +
        '</small>' +
        '</aside>';
    } else {
      var popupText =
        '<div class="row"><div class="col-6" align="left"><strong>' +
        data.name +
        '</strong></div>' +
        '<div class="col-6" align="right"><strong class="bg-secondary bg-opacity-25 p-1 rounded ">' +
        data.speed +
        ' km/h</strong></div></div>' +
        '<aside #popupText class="">' +
        '<small><i class="fas fa-user-circle"></i> ' +
        data.namedriver +
        '</small><br>' +
        // '<small>UBICACION: '+data.latitud+', '+data.longitud+'</small><br>'+
        '<small><i class="fas fa-crosshairs"></i><a href=" ' +
        googleMapsLink +
        '" target="_blank">' +
        data.latitud +
        ', ' +
        data.longitud +
        '</a></small><br>' +
        `<small><i class="fas fa-map-marked-alt"></i> ` +
        '     NN' +
        '</small><br>' +
        '<small><i class="fas fa-calendar-alt"></i> ' +
        data.dt_tracker +
        '</small><br>' +
        '<small><i class="fas fa-hourglass-half"></i> ' +
        this.time_stop +
        '</small>' +
        '</aside>';
    }

    const tempMarker = L.marker([data.latitud, data.longitud], {
      icon: iconMarker,
    })
      .setZIndexOffset(1)
      .bindPopup(popupText);

    tempMarker.bindTooltip(`<span>${data.name}</span>`, {
      permanent: true,
      offset: [0, 12],
      className: 'vehicle-tooltip',
    });

    let options = {
      imei: data.IMEI,
      name: data.name,
      nameconvoy: data.nameconvoy,
      namegrupo: data.namegrupo,
      nameoperation: data.nameoperation,
      namedriver: data.namedriver,
      longitud: data.longitud,
      latitud: data.latitud,
      speed: data.speed,
      dt_tracker: data.dt_tracker,
      paradaDesde: '',
      vehicleService: this.vehicleService,
    };

    tempMarker.on('click', this.timeStop, options);

    this.marker[data.IMEI] = tempMarker;

    this.markerClusterGroup.addLayer(tempMarker);
    this.markerClusterGroup.addTo(this.map);
  }

  public changeClusteringVisibility(visibility: boolean) {
    this.clustering = visibility;
  }

  public get getClustering(): boolean {
    return this.clustering;
  }
  public timeChangeIconUrl(imei: string, custom_svg: string, key: any) {
    // this.timeWait = 15000; // 150 segundos en milisegundos

    if (this.timeNow[imei]) {
      clearTimeout(this.timeNow[imei]); // Limpia el temporizador existente si hay uno para este índice
      // console.log('SE LIMPIO EL TEMPORIZADOR del -->',imei);
    }
    const tiempoUltimaActualizacion = Date.now(); // Actualiza el tiempo de la última actualización para este índice
    // console.log('CREANDO TEMPORIZADOR NUEVO -->',imei);|
    this.timeNow[imei] = setTimeout(() => {
      // Verifica si ha pasado el tiempo especificado desde la última actualización
      const tiempoActual = Date.now();
      const tiempoTranscurrido = tiempoActual - tiempoUltimaActualizacion;
      if (tiempoTranscurrido >= this.timeWait) {
        // Realiza la acción si ha pasado el tiempo especificado sin actualización
        console.log(
          '*************** PASO 2 Horas Cambiando color a default ---->',
          imei, custom_svg
        );
        const iconUrl = custom_svg;
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'iconUrl'
        ] = iconUrl;
        this.markerClusterGroupOnda.getLayers()[key]['options']['icon']['options'][
          'iconUrl'
        ] = './assets/images/objects/nuevo/gif/blanco.png';
        this.markerClusterGroup.getLayers()[key]['options']['icon']['options'][
          'shadowUrl'
        ] = '';
      }
    }, this.timeWait);
  }
}
