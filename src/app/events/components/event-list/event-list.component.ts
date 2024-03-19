import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { EventSocketService } from './../../services/event-socket.service';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { EventService } from '../../services/event.service';
import { getContentPopup } from '../../helpers/event-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SliderMultimediaComponent } from 'src/app/shared/components/slider-multimedia/slider-multimedia.component';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { Alert, Evaluation } from 'src/app/alerts/models/alert.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  tipoEvento: any = [];

  selectedEvent: any[] = [];
  activeEvent: any = false;

  noResults: boolean = false;
  expanded = false;
  public events: any[] = [];
  public placa: string = '';

  public imei_debug: string = '864200050708453';
  public data_debug: any = ['-', '-', '-', '-'];

  evaluation_criteria = [
    {
      label: 'Señales de posible fatiga',
      items: [
        {
          label: 'Inclinación de la cabeza hacia adelante y hacia atrás',
          value: 'Inclinación de la cabeza hacia adelante y hacia atrás',
        },
        { label: 'Parpadeo involuntario', value: 'Parpadeo involuntario' },
        {
          label: 'Gestos o movimientos a manera de autogestión',
          value: 'Gestos o movimientos a manera de autogestión',
        },
        {
          label: 'Bostezo continuo (>3 en 30 seg.)',
          value: 'Bostezo continuo (>3 en 30 seg.)',
        },
        {
          label: 'Mano con acción de frotación en el ojo',
          value: 'Mano con acción de frotación en el ojo',
        },
      ],
    },
    {
      label: 'Sin señal de posible fatiga',
      items: [
        {
          label: 'Característica física de ojos "Rasgos asiáticos"',
          value: 'Característica física de ojos "Rasgos asiáticos"',
        },
        {
          label: 'Cobertura de rostro con bufanda y/o chalina',
          value: 'Cobertura de rostro con bufanda y/o chalina',
        },
        {
          label: 'Existe mirada del Conductor al tablero',
          value: 'Existe mirada del Conductor al tablero',
        },
        {
          label: 'Lentes correctores mal puestos',
          value: 'Lentes correctores mal puestos',
        },
        {
          label: 'Lentes correctores con marco reducido',
          value: 'Lentes correctores con marco reducido',
        },
        {
          label: 'Lentes de seguridad mal puestos',
          value: 'Lentes de seguridad mal puestos',
        },
        { label: 'Otro tipo de lentes', value: 'Otro tipo de lentes' },
        {
          label: 'Presencia de deslumbramientos',
          value: 'Presencia de deslumbramientos',
        },
        {
          label: 'Uso de chullo, gorra con vísera o casco',
          value: 'Uso de chullo, gorra con vísera o casco',
        },
        { label: 'Uso de sobrelentes', value: 'Uso de sobrelentes' },
        {
          label: 'Uso de maquillaje en el rostro',
          value: 'Uso de maquillaje en el rostro',
        },
      ],
    },
  ];

  operators = [
    {
      label: 'Operadores',
      items: [
        // {
        //   label: 'HANCCO DIAZ, Gary Maurizio',
        //   value: 'HANCCO DIAZ, Gary Maurizio',
        // },
        {
          label: 'HUACHO OCHOA, Gonzalo Joe',
          value: 'HUACHO OCHOA, Gonzalo Joe',
        },
        { label: 'MAMANI SIERRA, Raquel', value: 'MAMANI SIERRA, Raquel' },
        {
          label: 'ROJAS RONDON, Carla Alejandra',
          value: 'ROJAS RONDON, Carla Alejandra',
        },
        {
          label: '⁠FERNANDEZ CRUZ, Rosellia Yanina',
          value: '⁠FERNANDEZ CRUZ, Rosellia Yanina',
        },
        {
          label: '⁠HUAMANI MILLIO, Maria Belen',
          value: '⁠HUAMANI MILLIO, Maria Belen',
        },
        {
          label: '⁠SUAREZ PACURI, Ayelen Melani',
          value: '⁠⁠SUAREZ PACURI, Ayelen Melani',
        },

      ],
    },
  ];

  loading_evaluation = false;
  expandedRows: { [s: string]: boolean } = {};
  submitting = false;

  constructor(
    public eventService: EventService,
    public mapService: MapServicesService,
    public ess: EventSocketService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private vehicleService: VehicleService
  ) {
    // this.tipoEvento = [
    //   { id: 0, option: 'Todos los Eventos', tipo: '' },
    //   { id: 1, option: 'Alcoholemia', tipo: '' },
    //   { id: 2, option: 'Somnolencia', tipo: 'Somnolencia', clase: 'somnolencia' },
    //   { id: 3, option: 'Distracción', tipo: 'Distraccion', clase: 'distraccion' },
    //   { id: 4, option: 'Batería Desconectada', tipo: 'Bateria desconectada', clase: 'bateria-desconectada' },
    //   { id: 5, option: 'Aceleración Brusca', tipo: 'Aceleracion brusca', clase: 'aceleracion-brusca' },
    //   { id: 6, option: 'Frenada Brusca', tipo: 'Frenada brusca', clase: 'frenada-brusca' },
    //   { id: 7, option: 'S.O.S.', tipo: 'SOS', clase: 'sos-event' },
    //   { id: 8, option: 'Zona de Entrada', tipo: 'Zona de entrada', clase: 'zona-entrada' },
    //   { id: 9, option: 'Zona de Salida', tipo: 'Zona de salida', clase: 'zona-salida' },
    //   { id: 10, option: 'Tiempo de estadía en zona', tipo: 'Tiempo de estadia en zona', clase: 'tiempo-estadia-zona' },
    //   { id: 11, option: 'Parada en zona no autorizada', tipo: 'Parada en zona no autorizada', clase: 'parada-zona-no-autorizada' },
    //   { id: 12, option: 'Exceso de velocidad', tipo: 'Exceso de Velocidad', clase: 'exceso-velocidad' },
    //   { id: 13, option: 'Transgresión', tipo: '' },
    //   { id: 14, option: 'Infracción', tipo: 'Infraccion', clase: 'infraccion' },
    //   { id: 15, option: 'Vehículo sin programación', tipo: 'Vehiculo sin programacion', clase: 'vehiculo-sin-programacion' },
    //   { id: 16, option: 'Mantenimiento preventivo', tipo: 'Mantenimiento preventivo', clase: 'mantenimiento-preventivo' },
    //   { id: 16, option: 'Mantenimiento preventivo realizado', tipo: 'Mantenimiento preventivo realizado', clase: 'mantenimiento-preventivo-realizado' },
    //   { id: 17, option: 'Mantenimiento correctivo', tipo: 'Mantenimiento correctivo', clase: 'mantenimiento-correctivo' },
    //   { id: 18, option: 'Mantenimiento correctivo realizado', tipo: 'Mantenimiento correctivo realizado', clase: 'mantenimiento-correctivo-realizado' },
    //   { id: 19, option: 'Motor apagado', tipo: 'Motor apagado', clase: 'motor-apagado' },
    //   { id: 20, option: 'Motor encendido', tipo: 'Motor encendido', clase: 'motor-encendido' },
    //   { id: 21, option: 'Fatiga', tipo: 'Fatiga', clase: 'fatiga' },
    //   { id: 22, option: 'Posible Fatiga', tipo: 'Posible Fatiga', clase: 'posible-fatiga' },
    //   { id: 23, option: 'Fatiga Extrema', tipo: 'Fatiga Extrema', clase: 'fatiga-extrema' },
    //   { id: 24, option: 'Desvío de carril hacia la izquierda', tipo: 'Desvío de carril hacia la izquierda', clase: 'desvio-carril-izq' },
    //   { id: 25, option: 'Desvío de carril hacia la derecha', tipo: 'Desvío de carril hacia la derecha', clase: 'desvio-carril-der' },
    //   { id: 26, option: 'Bloqueo de visión del Mobileye', tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
    //   { id: 27, option: 'Colisión con peatones', tipo: 'Colisión con peatones', clase: 'colision-peatones' },
    //   { id: 28, option: 'Colisión con delantera', tipo: 'Colisión delantera', clase: 'colision-delantera' },
    //   { id: 29, option: 'Bloqueo de visión del mobileye', tipo: 'Bloqueo de visión del mobileye', clase: 'bloqueo-vision-mobileye' },
    // ];
  }

  async ngOnInit() {
    //console.log("event list on init ========================================================================");
    this.selectedEvent = [];

    if (!this.eventService.eventsLoaded || !this.eventService.filterLoaded) {
      this.spinner.show('loadingEventList');
    }
    this.loadFilterData();

    /* const storedFilter = localStorage.getItem('filter') || '';
    this.selectedEvent = storedFilter ? [{ value: storedFilter }] : []; */

    this.eventService.debugEventStream.subscribe((res) => {
      // console.log("desde event list ",res);
      this.data_debug = res.data;
    });
    this.eventService.newEventStream.subscribe(() => {
      // console.log("desde event list ",res);
      this.searchByPlate();
      this.changeTypeEvent();
    });

    if (this.eventService.eventsUserLoaded == false) {
      //this.spinner.show('loadingEventsPanel');
      this.eventService.getEventsForUser().subscribe(
        async (data) => {
          // Aquí puedes trabajar con los datos obtenidos
          console.log('EVENTOS DEL USUARIO OBTENIDOS:', data);
          // Realiza cualquier acción con los datos recibidos
          if (data.success) {
            this.eventService.createEventList(data.data);
          } else {
            console.log('EL USUARIO NO TIENE EVENTOS');
          }
          this.spinner.hide('loadingEventsPanel');
        },
        (error) => {
          // Maneja los errores si ocurre alguno durante la solicitud
          console.error('Error al obtener los eventos:', error);
        }
      );
    } else {
      this.spinner.show('loadingHistorialForm');
      // console.log(
      //   'TEST IN EVENTS PANEL->',
      //   this.eventService.eventsGroupedList
      // );
      this.spinner.hide('loadingHistorialForm');
    }
  }

  public changeTypeEvent() {
    console.log("cambiando filtro de eventos ...... *****************+ ");
    console.log("selectedEvent",this.selectedEvent);
    if (this.selectedEvent.length === 0 && this.placa === '') {
      this.eventService.eventsFiltered = this.eventService.getData();

      this.noResults = false;
    } else {
      this.eventService.getEventFilter(this.selectedEvent);
      this.eventService.eventsFiltered = this.eventService
        .getData()
        .filter((event: any) => {
          // console.log(" --- event: ",event);
          let result_filter = this.eventFilter(event);
          // console.log("result_filter",result_filter);
          return result_filter;
        });
      this.noResults = this.eventService.eventsFiltered.length === 0;
    }
  }

  ngOnDestroy() {
    if (this.eventService.activeEvent) {
      this.hideEvent(this.eventService.activeEvent);
    }
  }
  clickDatosDebug(): void {
    this.ess.debug(this.imei_debug);
  }
  clickEndDeveloper(): void {
    this.eventService.eventDeveloperStatus = false;
    this.eventService.eventDeveloperCount = 0;
    this.data_debug = ['-', '-', '-', '-'];
  }
  clickEventPanel(): void {
    if (this.eventService.eventDeveloperCount > 5) {
      this.eventService.eventDeveloperStatus = true;
    } else {
      this.eventService.eventDeveloperCount++;
    }
  }

  async loadFilterData() {
    if (!this.eventService.hasEventPanelBeenOpened) {
      this.eventService.hasEventPanelBeenOpened = true;
      await this.eventService.getAllEventsForTheFilter();
      this.eventService.filterLoaded = true;
    }
    this.tipoEvento = this.eventService.getFilters();
    console.log('filtrosobtenidos', this.tipoEvento);

    this.eventService.showEventPanel();

    /* this.tipoEvento.unshift({ id: 0, option: 'Todos los Eventos', tipo: '' }); */
  }

  public showEvent(event: any) {
    const objParams: any = {};
    /*
    antes de procesar parametros  string
    event-list.component.ts:130 despues de procesar parametros  object
    */
    if (event.parametros && typeof event.parametros == 'string') {
      event.parametros.split('|').forEach((item: any) => {
        const [key, value] = item.split('=');
        objParams[key] = value;
      });
      //reemplazo el atributo parametros (string) con el objeto
      event.parametros = objParams;
    }

    if (this.eventService.activeEvent) {
      if (
        this.eventService.activeEvent.id == event.id &&
        event.layer.isPopupOpen()
      ) {
        return;
      }
      this.eventService.activeEvent.layer.closePopup();
      this.eventService.activeEvent.layer.unbindPopup();
      this.eventService.activeEvent.layer.off();
      this.hideEvent(this.eventService.activeEvent);
    }

    if (!event.viewed) {
      event.viewed = true;
      // this.markAsRead(event.evento_id);
    }
    this.eventService.activeEvent = event;

    var eventClass: any = this.eventService.eventsClassList.filter(
      (eventClass: any) => eventClass.tipo == event.tipo
    );
    eventClass = eventClass.length > 0 ? eventClass[0].clase : 'default-event';

    this.mapService.map.fitBounds(
      [[event.layer.getLatLng().lat, event.layer.getLatLng().lng]],
      { padding: [50, 50] }
    );

      console.log("eventlayer",event.layer)

    event.layer.bindPopup(getContentPopup(event), {
      className: eventClass,
      minWidth: 250,
      maxWidth: 350,
    });
    event.layer.on('click', () => {
      this.addMultimediaComponent(event);
    });
    event.layer.addTo(this.mapService.map).openPopup();
    this.addMultimediaComponent(event);
  }

  addMultimediaComponent(event: any) {
    if (
      event.parametros &&
      event.parametros.gps == 'cipia' &&
      (event.parametros.has_video != '0' || event.parametros.has_image != '0')
    ) {
      //console.log("adding multimedia: ", event);

      const factory = this.resolver.resolveComponentFactory(
        SliderMultimediaComponent
      );
      const componentRef: ComponentRef<any> =
        this.container.createComponent(factory);
      const params: any = {
        event: event,
        driver:
          this.vehicleService.vehicles.find((vh) => vh.IMEI == event.imei)
            ?.namedriver ?? '',
        showMultimediaFirst: true,
        hasMultimedia: true,
        showTitle: false,
      };
      // Asignar datos al componente si existen

      Object.keys(params).forEach((key) => {
        componentRef.instance[key] = params[key];
      });
      // Agregar el componente directamente al contenedor del popup
      //console.log("componentRef.location.nativeElement",componentRef.location.nativeElement);

      const divContainer = document.getElementById(
        'multimedia-' + event.parametros.eventId
      )!;
      //console.log("divContainer",divContainer);
      divContainer.appendChild(componentRef.location.nativeElement);
    }
  }

  public hideEvent(event: any) {
    this.mapService.map.removeLayer(event.layer);
    this.eventService.activeEvent = false;
  }

  private markAsRead(event_id: any) {
    //console.log('desde event list Marking ' + event_id + ' as read...');
    //this.eventService.decreaseUnreadCounter();
    this.eventService.updateUnreadCounter();
    this.http
      .get<any>(
        environment.apiUrl + '/api/event-user/mark-as-viewed/' + event_id
      )
      .subscribe({
        next: (data) => {
          //console.log('desde event list Mark ' + event_id + ' as read Success? : ', data.success);
        },
        error: () => {
          //console.log(event_id + ': Hubo un error al marcar como leído');
        },
      });
  }

  public async switchEventOnMap(event: any, currentRow: HTMLElement) {
    // console.log("this.eventService.activeEvent.id",this.eventService.activeEvent.id);
    // if(event.event_id == this.eventService.activeEvent.id){
    if (false) {
      // this.hideEvent(this.eventService.activeEvent);
    } else {
      currentRow.classList.add('watched-event');
      //console.log('Mostrando evento con ID: ', event.evento_id);
      let reference = await this.eventService.getReference(
        event.latitud,
        event.longitud
      );
      event.referencia = reference.referencia;
      this.showEvent(event);
    }
  }

  public checkPopupExist() {
    return document.querySelectorAll('.leaflet-popup').length > 0;
  }

  public searchByPlate() {
    //if(this.selectedEvent === null && this.placa == ''){
    if (this.selectedEvent.length == 0 && this.placa == '') {
      this.eventService.eventsFiltered = this.eventService.getData();
      this.noResults = false;
    } else {
      this.eventService.eventsFiltered = this.eventService
        .getData()
        .filter((event: any) => {
          // console.log('this.eventFilter(event)', this.eventFilter(event));
          return this.eventFilter(event);
        });
      this.noResults = this.eventService.eventsFiltered.length == 0;
    }
    //console.log(this.eventService.eventsFiltered);
    //console.log(this.noResults);
  }

  private eventFilter(event: any) {

    // console.log("eventFilter filter ===> ");
    // console.log("event",event);
    // console.log("tipo select",event.tipo +"=="+ this.selectedEvent);
    const eventsTypesSelected: string[] = this.selectedEvent.map(
      (event: any) => {
        return event.value;
      }
    );
    const vehicle = this.vehicleService.vehicles.find(
      (vh) => vh.IMEI == event.imei
    );
    if(vehicle!=undefined){
      let aux_imei = vehicle.IMEI ?? "";
      let aux_cod = vehicle.cod_interno ?? "";
      let aux = event.nombre_objeto + aux_imei + aux_cod;
      return (
        ( aux.toString().trim()
          .toLowerCase()
          .match(this.placa.trim().toLowerCase()) ||
          this.placa == '') &&
        (eventsTypesSelected.includes(event.tipo) ||
          this.selectedEvent.length == 0)
      );
    }else{
      return false;
    }

  }

  rowExpandend(event: any) {
    if (event.data) {
      this.expandedRows[event.data.uuid_event] =
        !this.expandedRows[event.data.uuid_event];
    }
    this.loading_evaluation = true;
    //console.log("event.data", event.data);

    if (event.data.id) {
      this.eventService
        .getEvaluations(event.data.id)
        .then((evaluations) => {
          if (evaluations.length > 0) {
            //console.log(" EVALUATIONS GETS ", evaluations);
            let auxEvent = this.eventService.eventsFiltered.find(
              (ev: any) => ev.id == event.data.id
            );
            auxEvent.evaluations = evaluations as Evaluation[];
            auxEvent.evaluated = 1;
            //console.log("EVENTS EVALUATIONS GETS ", auxEvent);
          }
        })
        .finally(() => {
          this.loading_evaluation = false;
        });
    } else {
      this.loading_evaluation = false;
    }
  }

  submitEvaluation(evaluation: Evaluation, event: Alert) {
    if (
      evaluation.criterio_evaluacion == '' &&
      evaluation.observacion_evaluacion == ''
    ) {
      Swal.fire(
        'Espera!',
        'Seleccione un criterio de evaluación o ingrese su observación.',
        'info'
      );
      return;
    }
    if (evaluation.operador_monitoreo == '') {
      Swal.fire(
        'Espera!',
        'Ingrese o seleccione el nombre del operador.',
        'info'
      );
      return;
    }

    if (
      evaluation.senales_posible_fatiga == true &&
      evaluation.valoracion_evento == '0'
    ) {
      Swal.fire(
        'Espera!',
        'Debe valorar la precisión del evento (1-5 estrellas)',
        'info'
      );
      return;
    }

    //console.log("Submitting evaluation: ",evaluation, event);
    if (!evaluation.senales_posible_fatiga) {
      evaluation.valoracion_evento = '0';
      evaluation.identificacion_video = '';
    }
    this.submitting = true;
    this.eventService
      .saveEvaluations(evaluation)
      .then((response) => {
        console.log('response after saveEvaluations', response);
        let realEvent = this.eventService.eventsFiltered.find(
          (event) => event.uuid_event == evaluation.uuid_event
        );
        realEvent.evaluations = response as Evaluation[];
        realEvent.evaluated += 1;
        //console.log("realEvent after response-->>",realEvent);
        Swal.fire('Éxito', 'Los cambios se guardaron exitosamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'No se pudo guardar la evaluación', 'error');
      })
      .finally(() => {
        this.submitting = false;
      });
  }

  clearEvaluation(evaluation: Evaluation) {
    //console.log("evaluation to clean", evaluation);

    if (!evaluation.id) {
      evaluation.criterio_evaluacion = '';
      evaluation.identificacion_video = '';
      evaluation.observacion_evaluacion = '';
      evaluation.operador_monitoreo = '';
      evaluation.valoracion_evento = '0';
      evaluation.senales_posible_fatiga = false;
    }
  }

  criteriaSelected(event: any, evaluation: Evaluation) {
    evaluation.senales_posible_fatiga = false;
    this.evaluation_criteria[0].items.forEach((criteria) => {
      if (criteria.value == event.value) {
        evaluation.senales_posible_fatiga = true;
      }
    });
  }

  closeEvaluationExpanded(evaluation: Evaluation) {
    this.clearEvaluation(evaluation);
    this.expandedRows = {};
  }

  /* // Añadido: Guarda el filtro seleccionado en el localStorage
  private saveFilterToLocalStorage(filter: string): void {
    localStorage.setItem('filter', filter);
  }

  // Añadido: Recupera el filtro almacenado en el localStorage
  private getFilterFromLocalStorage(): string {
    return localStorage.getItem('filter') || '';
  } */
}
