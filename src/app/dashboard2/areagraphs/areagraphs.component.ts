import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventService } from 'src/app/events/services/event.service';
import collect from 'collect.js';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DashboardService } from './../service/dashboard.service';

@Component({
  selector: 'app-areagraphs',
  templateUrl: './areagraphs.component.html',
  styleUrls: ['./areagraphs.component.scss'],
})
export class AreagraphsComponent implements OnInit {
  isUnderConstruction: boolean = false;

  public vehicles: any = [];
  group: any = [];
  convoy: any = [];
  rangeDates: Date[] = [];
  imeis: any = [];
  public totalVehicle: number = 0;
  green: number = 0;
  imeiGreen: any = [];
  blue: number = 0;
  imeiBlue: any = [];
  purple: number = 0;
  black: number = 0;
  imeiBlack: any = [];
  orange: number = 0;
  imeiOrange: any = [];
  red: number = 0;
  imeiRed: any = [];

  horizontalChart: any = [];
  viewHorizontalChart = [700, 100];
  in_service = 0;
  without_programming = 0;
  total = 0;
  in_service_percentage = 0;
  without_programming_percentage = 0;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['green', 'blue', 'orange', 'black', 'red'],
  };

  colorSchemeHorizontalChart = {
    domain: ['#0d6efd', '#e9ecef'],
  };

  colorSchemeVehiclesOnRoute = {
    domain: ['green', 'blue'],
  };

  data: any = [];
  vehiclesOnRoute: any = [];
  dataEvents: any = [];

  infraction: any = [];
  date_infraction: string = '';
  gpsEvents: any = [];
  date_gps: string = '';
  gpsEventsTotal: number = 0;
  countgpsEvents: any = {};
  vehicleSafetyEvents: any = [];
  date_safety: string = '';
  countVehicleSafetyEvents: any = [];
  safetyEventsTotal: number = 0;

  constructor(
    private vehicleService: VehicleService,
    private spinner: NgxSpinnerService,
    private eventService: EventService,
    private dashboardService: DashboardService
  ) {}

  /*
  sistema de color
  red = corte de transmision por problemas del gps, ... (soporte)
  yellow = vehiculo perdidó transmision,
  purple = vehiculo parado sin transmision,
  blue=  vehiculo parado y transmitiendo en tiempo real;
  green = vehiculo en movimiento y transmitiendo en tiempo real,

  point_color,
  100 = green,
  60 = red,
  50 = orange, -> zona de no covertura
  40 = black, -> sin transmision
  30 = purple,
  20 = blue,
  10 = green -> en movimiento
  */

  ngOnInit(): void {
    if (!this.isUnderConstruction) {
      this.spinner.show('loadingDashboardSpinner');
      this.load();
    }
    // setInterval(() => {

    //    this.load();
    //    console.log(" this.load()");
    // }, 180000);
    // this.load();
  }

  load() {
    this.imeis = JSON.parse(localStorage.getItem('vahivles-dashboard')!);

    this.getEvents(this.imeis);

    this.vehicleService.dataCompleted.subscribe((vehicles) => {
      this.vehicles = vehicles.filter((vehicle: any) => {
        return this.imeis.includes(vehicle.IMEI);
      });

      this.setGraphData(this.vehicles);
    });
  }

  setGraphData(vehicles: any) {
    this.totalVehicle = vehicles.length;

    vehicles.forEach((vehicle: any) => {
      if (vehicle.point_color == 10) {
        this.green += 1;
        this.imeiGreen.push(vehicle.name);
      } else if (vehicle.point_color == 20) {
        this.blue += 1;
        this.imeiBlue.push(vehicle.name);
      } else if (vehicle.point_color == 30) {
        this.purple += 1;
      } else if (vehicle.point_color == 40) {
        this.black += 1;
        this.imeiBlack.push(vehicle.name);
      } else if (vehicle.point_color == 50) {
        this.orange += 1;
        this.imeiOrange.push(vehicle.name);
      } else if (vehicle.point_color == 60) {
        this.red += 1;
        this.imeiRed.push(vehicle.name);
      } else if (vehicle.point_color == 100) {
        this.green += 1;
        this.imeiGreen.push(vehicle.name);
      } else {
        this.black += 1;
        this.imeiBlack.push(vehicle.name);
      }
    });

    this.data = [
      {
        name: 'En movimiento',
        value: this.green,
      },
      {
        name: 'Detenidos',
        value: this.blue,
      },
      {
        name: 'Sin cobertura',
        value: this.orange,
      },
      {
        name: 'Sin transmision',
        value: this.black,
      },
      {
        name: 'Corte de transmision',
        value: this.red,
      },
    ];

    this.setHorizontalChart();
  }

  setHorizontalChart() {
    this.in_service = this.green;
    this.data.forEach((item: any) => {
      if (item.name != 'En movimiento') {
        this.without_programming += item.value;
      }
      this.total += item.value;
    });

    this.in_service_percentage = Math.round(
      (this.in_service * 100) / this.total
    );
    this.without_programming_percentage = Math.round(
      (this.without_programming * 100) / this.total
    );

    this.horizontalChart = [
      {
        name: '',
        series: [
          {
            name: 'En servicio',
            value: this.in_service,
          },
          {
            name: 'Sin programación',
            value: this.without_programming,
          },
        ],
      },
    ];
  }

  async getEvents(imeis: any) {
    let to = moment().add(8, 'hours').format('YYYY-MM-DD H:mm:ss.000');
    let from = moment().subtract(24, 'hours').format('YYYY-MM-DD H:mm:ss.000');
    this.dataEvents = await this.eventService.getEventsByImeis(imeis, to, from);

    this.dataEvents.forEach((event: any) => {
      if (
        event.descripcion_evento === 'Infracción' ||
        event.descripcion_evento === 'Infraccion'
      ) {
        this.infraction.push(event);
      }

      if (event.tipo_alerta === 'gps') {
        this.gpsEvents.push(event);
      }

      if (event.tipo_alerta === 'accessories') {
        this.vehicleSafetyEvents.push(event);
      }
    });

    this.setInfraction(this.infraction);

    this.setGpsEvents(this.gpsEvents);

    this.setVehicleSafetyEvents(this.vehicleSafetyEvents);

    this.spinner.hide('loadingDashboardSpinner');
  }

  removeAccents(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  async getInfraction() {

    if (this.date_infraction != '') {
      this.spinner.show('loadingInfractionSpinner');
      let to = moment(this.date_infraction)
        .endOf('day')
        .add(5, 'hours')
        .format('YYYY-MM-DD H:mm:ss.000');
      let from = moment(this.date_infraction)
        .startOf('day')
        .add(5, 'hours')
        .format('YYYY-MM-DD H:mm:ss.000');
      let envent_type = ['Infracción', 'Infraccion'];
      let dataEvents = await this.eventService.getEventsByImeisAndEventType(
        this.imeis,
        to,
        from,
        envent_type
      );

      if (dataEvents.length > 0) {
        this.setInfraction(dataEvents);
      } else {
        this.infraction = [];
      }

      this.spinner.hide('loadingInfractionSpinner');
    } else {
      alert('debe elegir una fecha');
    }
  }

  setInfraction(infractions: any) {
    this.infraction = collect(infractions)
      .groupBy('nombre_objeto')
      .map((items: any, index: any) => {
        return {
          name: index,
          amount: items.items.length,
          higher_speed: collect(items.items).max('velocidad'),
        };
      })
      .toArray();
  }

  async getEventGps() {
    if (this.date_gps != '') {
      this.spinner.show('loadingGpsSpinner');
      let to = moment(this.date_gps)
        .endOf('day')
        .add(5, 'hours')
        .format('YYYY-MM-DD H:mm:ss.000');
      let from = moment(this.date_gps)
        .startOf('day')
        .add(5, 'hours')
        .format('YYYY-MM-DD H:mm:ss.000');
      let envent_type = [
        'Bateria desconectada',
        'Aceleracion brusca',
        'SOS',
        'Frenada brusca',
        'Motor apagado',
        'Motor encendido',
      ];
      let dataEvents = await this.eventService.getEventsByImeisAndEventType(
        this.imeis,
        to,
        from,
        envent_type
      );

      if (dataEvents.length > 0) {
        this.setGpsEvents(dataEvents);
      } else {
        this.setCountgpsEvents();
      }
      this.spinner.hide('loadingGpsSpinner');
    } else {
      alert('debe elegir una fecha');
    }
  }

  setGpsEvents(dataEvents: any) {
    this.gpsEventsTotal = dataEvents.length;
    this.countgpsEvents = collect(dataEvents)
      .countBy((event: any) =>
        this.removeAccents(event.tipo_evento.toLowerCase().replace(/ /g, '_'))
      )
      .all();

    this.gpsEvents = collect(dataEvents)
      .groupBy('nombre_objeto')
      .map((items: any, index: any) => {
        return items
          .groupBy('tipo_evento')
          .map((ite: any, evn_tipe: any) => {
            return { amount: ite.count(), vehicle: index, event: evn_tipe };
          })
          .toArray();
      })
      .flatten(1)
      .toArray();
  }

  setCountgpsEvents() {
    this.countgpsEvents = {
      bateria_desconectada: 0,
      aceleracion_brusca: 0,
      frenada_brusca: 0,
      sos: 0,
      motor_apagado: 0,
      motor_encendido: 0,
    };
    this.gpsEventsTotal = 100;
    this.gpsEvents = [];
  }

  async getVehicleSafety() {
    if (this.date_safety != '') {
      this.spinner.show('loadingSegSpinner');
      let to = moment(this.date_safety)
        .endOf('day')
        .add(5, 'hours')
        .format('YYYY-MM-DD H:mm:ss.000');
      let from = moment(this.date_safety)
        .startOf('day')
        .add(5, 'hours')
        .format('YYYY-MM-DD H:mm:ss.000');
      let envent_type = [
        'No Rostro',
        'Fatiga Extrema',
        'Posible Fatiga',
        'Distraccion',
        'Distracción',
        'Colisión delantera',
        'Colisión con peatones',
        'Desvío de carril hacia la izquierda',
        'Desvío de carril hacia la derecha',
        'Bloqueo de visión del mobileye',
      ];
      let dataEvents = await this.eventService.getEventsByImeisAndEventType(
        this.imeis,
        to,
        from,
        envent_type
      );

      if (dataEvents.length > 0) {
        this.setVehicleSafetyEvents(dataEvents);
      } else {
        this.setCountVehicleSafetyEvents();
      }
      this.spinner.hide('loadingSegSpinner');
    } else {
      alert('debe elegir una fecha');
    }
  }

  setVehicleSafetyEvents(dataEvents: any) {
    this.safetyEventsTotal = dataEvents.length;
    this.countVehicleSafetyEvents = collect(dataEvents)
      .countBy((event: any) =>
        this.removeAccents(event.tipo_evento.toLowerCase().replace(/ /g, '_'))
      )
      .all();

    this.vehicleSafetyEvents = collect(dataEvents)
      .groupBy('nombre_objeto')
      .map((items: any, index: any) => {
        return items
          .groupBy('tipo_evento')
          .map((ite: any, evn_tipe: any) => {
            return { amount: ite.count(), vehicle: index, event: evn_tipe };
          })
          .toArray();
      })
      .flatten(1)
      .toArray();
  }

  setCountVehicleSafetyEvents() {
    this.countVehicleSafetyEvents = {
      no_rostro: 0,
      fatiga_extrema: 0,
      posible_fatiga: 0,
      distraccion: 0,
      colision_delantera: 0,
      colision_con_peatones: 0,
      desvio_de_carril_hacia_la_izquierda: 0,
      desvio_de_carril_hacia_la_derecha: 0,
      bloqueo_de_vision_del_mobileye: 0,
    };
    this.safetyEventsTotal = 100;
    this.vehicleSafetyEvents = [];
  }
}
