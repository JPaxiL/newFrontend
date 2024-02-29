import { Component, ElementRef, OnInit, OnChanges, ViewChild, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';
import { PanelService } from '../../../panel/services/panel.service';
import Swal from 'sweetalert2';
import { TreeNode } from 'primeng-lts/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapServicesService } from '../../../map/services/map-services.service';
import * as L from 'leaflet';
import 'leaflet-draw';
import { Subscription, forkJoin } from 'rxjs';
import { Geofences } from '../../models/geofences';
import { DataGeofence, IGeofence, ITag } from '../../models/interfaces';
import moment from 'moment';
import { GeocercaAddComponent } from '../geocerca-add/geocerca-add.component';
//import { AnyNaptrRecord } from 'dns';
//import { GeofencesModalComponent } from '../geofences-modal/geofences-modal.component';
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-geofence-table',
  templateUrl: './geofence-table.component.html',
  styleUrls: ['./geofence-table.component.scss']
})
export class GeofenceTableComponent implements OnInit, OnDestroy {
  files!: TreeNode[];
  cols!: Column[];
  btnSelected: number = 1;
  viewOptions = 'viewGroup';
  datosCargados: boolean = false;
  NomBusqueda: string = "";
  searchValueGeo: string = "";
  noResults: boolean = false;
  geofences: TreeNode[] = [];
  geofencesFilter: any;
  objGeofences = new Geofences();
  objGeofencesFilter: any;
  loading: boolean = true;
  list1: any = [];
  list2: any = [];
  sortOrder: number = 1;
  private dataEdit: any = {
    id: -1,
    name: "",
    type: ""
  };
  visibleRow: any = {};
  displayEditTags: boolean = false;
  textHeaderEdit: string = "";
  selectedList1: any = [];
  selectedList2: any = [];
  geofencesTree: TreeNode[] = [];
  display: boolean = false;
  nameEdit: string = '';
  isFormName: boolean = false; //para validar NameObligatorio en Tag
  isExistTag: boolean = false; //para validar NameExistente en Tag
  listTagsEmpty: boolean = false; //para validar si el array de list2 esta vacio en la creacion
  nameTagInit: string = ''; //en el caso de que no se edite el nombre de tag 
  alreadyLoaded: boolean = false;

  //
  dataGeo: DataGeofence[] = [];

  map: L.Map | undefined;
  //
  @ViewChild('tt') tt!: any;
  @Output() eventDisplayTags = new EventEmitter<boolean>();
  @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();
  @Output() onHideEvent = new EventEmitter<boolean>();

  treeGeofences: any;
  public column: number = 6; //posible order
  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,
    public panelService: PanelService,
    private circularGeofencesService: CircularGeofencesService,
    private polylineGeofenceService: PolylineGeogencesService,
    private spinner: NgxSpinnerService,
    private configDropdown: NgbDropdownConfig,
  ) {
    this.geofencesService.tagAdded.subscribe(async () => {
      this.geofences = await this.geofencesService.createTreeNode();
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.geofencesService.initializingGeofences || !this.circularGeofencesService.initializingCircularGeofences) {
      this.geofencesService.spinner.show('loadingGeofencesSpinner');
    }
    // if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
    //   this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    // if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
    //   // this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    if (this.geofencesService.initializingGeofences) {
      await this.objGeofences.setGeofences(this.geofencesService.geofences as IGeofence[], 'polig');
    } else {
      this.geofencesService.dataCompleted.subscribe(async (data: IGeofence[]) => {
        await this.objGeofences.setGeofences(data, 'polig');
      })
    }
    if (this.circularGeofencesService.initializingCircularGeofences) {
      await this.objGeofences.setGeofences(this.circularGeofencesService.circular_geofences as IGeofence[], 'circ');
    } else {
      this.circularGeofencesService.dataCompleted.subscribe(async (data: IGeofence[]) => {
        await this.objGeofences.setGeofences(data, 'circ');
      })
    }
    // if(this.polylineGeofenceService.initializingPolylineGeofences){
    //   this.objGeofences.setGeofences(this.polylineGeofenceService.polyline_geofences as IGeofence[], 'lin');
    // }else{
    //   this.polylineGeofenceService.dataCompleted.subscribe((data:IGeofence[])=>{
    //     this.objGeofences.setGeofences(data, 'lin');
    //   })
    // }
    this.geofencesService.listGeofences = this.objGeofences.geofences;
    this.geofences = await this.geofencesService.createTreeNode();
    this.loading = false;
  }

  ngOnDestroy() {
  }

  onBusqueda(gaaa?: any) {
    if (this.NomBusqueda == '') {
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData();
      this.noResults = false;
    } else {
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData().filter((geocerca: any) => {
        return geocerca.trama.orden != null && geocerca.trama.orden.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.geofencesService.tblDataGeoFiltered.length == 0;
    }
  }

  matchesSearch(rowData?: any): boolean {
    const searchFields = ['zone_name'];

    return searchFields.some(field => {
      const cellValue = rowData[field].toString().toLowerCase();
      return cellValue.includes(this.searchValueGeo.toLowerCase());
    });
  }

  onQuickFilterChanged(data: any) {
    this.tt.filterGlobal(data.target.value, 'contains')
    this.tt.defaultSortOrder = -1;
  }

  onClickAddTags() {
    // this.geofencesService.compTags = 'MODAL TAG';
    // this.geofencesService.actionTags = 'add';
    this.eventDisplayTags.emit(true);
  }

  validateFormsInputs() {
    const inputElement = this.nameEdit;
    this.isFormName = inputElement.trim() !== '';
  }

  validateRepeatName(name: string) {
    this.isExistTag = false;
    if (this.nameTagInit !== this.nameEdit) {
      let aux = this.geofencesService.listTag.some((tg: any) => tg.var_name == name);
      console.log("Si se repite el nombre", aux);
      return aux;
    }
    return false;
  }
  verifyEmptyList() {
    if (!this.list2 || this.list2.length === 0) {
      this.listTagsEmpty = true;
      return true;
    }
    return false;
  }

  onConfirmationEdit() {
    this.loading = true;
    let currName = this.nameEdit;
    //let currName = this.nameEdit.nativeElement.value;
    // if (!this.isFormName) {
    //   Swal.fire({
    //     title: 'Error',
    //     text: `Al editar la Etiqueta debe tener un nombre.`,
    //     icon: 'error',
    //   }).then(() => {
    //     this.loading = false; // Restablece el estado de carga en caso de error.
    //   });
    //   return;
    // }

    this.isExistTag = this.validateRepeatName(currName);
    if (this.isExistTag) {
      Swal.fire({
        title: 'Error',
        text: `Ya existe una etiqueta con ese nombre, ingrese otro distinto.`,
        icon: 'error',
      }).then(() => {
        this.loading = false; // Restablece el estado de carga en caso de error.
      });
      return;
    }
    this.listTagsEmpty = this.verifyEmptyList();
    if (this.listTagsEmpty) {
      Swal.fire({
        title: 'Error',
        text: `La lista debe contener mínimo una geocerca.`,
        icon: 'error',
      }).then(() => {
        this.loading = false; // Restablece el estado de carga en caso de error.
      });
      return;
    }
    let currType = this.dataEdit.type;
    const req = {
      type: this.dataEdit.type,
      id: this.dataEdit.id,
      list1: this.list1.map((item: { id: any; type: any; }) => ({ id: item.id, type: item.type })),
      list2: this.list2.map((item: { id: any; type: any; }) => ({ id: item.id, type: item.type })),
      var_name: this.nameEdit
    };
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se aplicarán los cambios',
      //icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        actions: 'w-100',
        cancelButton: 'col-4',
        confirmButton: 'col-4',
      },
      preConfirm: async () => {
        this.geofencesService.updateTagAndAssingGeo(req).subscribe(
          async (response) => {
            // Manejar la respuesta del servidor si es necesario
            console.log('Actualización exitosa:', response);
            if (!response.success) {
              Swal.fire(
                'Error',
                response.message,
                'warning'
              );
            } else if (response.success) {
              await this.geofencesService.updateListTags(response.tag);
              await this.geofencesService.updateListGeofences(response.geos);
              this.geofences = await this.geofencesService.createTreeNode();
              this.loading = false;
              Swal.fire(
                '',
                response.message,
                'success'
              );
              this.displayEditTags = false;
            }
          },
          (error) => {
            // Manejar errores si la actualización falla
            console.error('Error al guardar la información:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error...',
              'warning'
            );
          }
        )
      },
    }).then((data) => {
      console.log(`respuesta`, data);
      this.loading = false;
    });
  }

  showEditTag(data: any) {
    console.log('Data', data);
    this.dataEdit = data;
    this.displayEditTags = true;
    this.textHeaderEdit = data.type + " " + data.name;
    this.nameEdit = data.name;
    this.nameTagInit = data.name;
    console.log('name initial:', this.nameTagInit);
    let aux1: any = [];
    let aux2: any = [];
    //list 1
    const geos = this.geofencesService.listGeofences.map((geo: { id: any; zone_name: any; type: any; idoperation: any; tags: any[]; zone_color: any }) => ({ id: geo.id, zone_name: geo.zone_name, type: geo.type, idoperation: geo.idoperation, tags: geo.tags, zone_color: geo.zone_color }));
    const geofences = geos.filter((geofence: any) => geofence.idoperation == data.idOpe);
    for (const key in geofences) {
      const geoExist = geofences[key]['tags'].includes(data.id);
      if (geoExist) {
        aux2.push(geofences[key]);
      } else {
        aux1.push(geofences[key]);
      }
      //id 0 significa que no tiene
    }
    this.list2 = aux2;
    this.list1 = aux1;
    console.log('LISTA --> 1', this.list1);
    console.log('LISTA --> 2', this.list2);
  }

  upList1() {
    let aux: any = [];
    //recupero valores upList2
    for (const key in this.list1) {
      aux.push(this.list1[key]);
    }
    // inserto valores nuevos
    for (const key in this.selectedList2) {
      aux.push(this.selectedList2[key]);
    }
    //inserto valores en list1
    this.list1 = aux;
    console.log('list1', this.list1);
    //vacio valores de list 2
    let aux2: any = [];
    let aux_status = false;
    for (const key in this.list2) {
      let aux_status = false;
      for (const key2 in this.selectedList2) {
        if (this.list2[key] == this.selectedList2[key2]) {
          aux_status = true;
        }
      }
      if (!aux_status) {
        aux2.push(this.list2[key]);
      }
    }
    this.list2 = aux2;
    this.selectedList2 = [];
  }

  upList2() {
    let aux: any = [];
    //recupero valores upList2
    for (const key in this.list2) {
      aux.push(this.list2[key]);
    }
    // inserto valores nuevos
    for (const key in this.selectedList1) {
      aux.push(this.selectedList1[key]);
    }
    //inserto valores en list2
    this.list2 = aux;
    console.log('list2', this.list2);
    //vacio valores de list 1
    let aux2: any = [];
    let aux_status = false;
    for (const key in this.list1) {
      let aux_status = false;
      for (const key2 in this.selectedList1) {
        if (this.list1[key] == this.selectedList1[key2]) {
          aux_status = true;
        }
      }
      if (!aux_status) {
        aux2.push(this.list1[key]);
      }
    }
    this.list1 = aux2;
    this.selectedList1 = [];
  }

  showDelete(data: any) {
    var idOpe = data.idOpe;
    let existOtherOp: boolean = false;
    var idTag = data.id;
    var geosDelets: any[] = [];
    let geosOpe = this.geofencesService.listGeofences.filter((geo: { idoperation: any; }) => geo.idoperation == idOpe);
    let geosDontOpe = this.geofencesService.listGeofences.filter((geo: { idoperation: any; }) => geo.idoperation != idOpe);
    geosDontOpe.forEach((geo: { id: number; tags: string[]; }) => {
      if (geo.tags.includes(idTag)) {
        existOtherOp = true;
      }
    });
    if (existOtherOp) {
      console.log('en otra operacion hay tag');
      Swal.fire({
        title: 'Error',
        text: `Etiqueta "${data.name}" exite en otra operación.`,
        icon: 'error',
      });
      return;
    }
    for (const geo of geosOpe) {
      const geoTag = geo.tags;
      const geoMap = {
        id: geo.id,
        type: geo.type
      };
      if (geoTag.includes(idTag)) {
        geosDelets.push(geoMap);
      }
    }
    if (data['id'] == null) {
      console.log('no hay id');
      Swal.fire({
        title: 'Error',
        text: 'No existe Agrupación, recarge la página ...',
        icon: 'error',
      });
    }
    const req = {
      id: data.id,
      type: data.type,
      geofences: geosDelets,
    };
    console.log('eliminar', req);
    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de eliminar, Etiqueta: ${data.name}?`,
      icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        actions: 'w-100',
        cancelButton: 'col-4',
        confirmButton: 'col-4',
      },
      preConfirm: async () => {
        this.geofencesService.deleteTagOfGeo(req).subscribe(
          async (response) => {
            // Manejar la respuesta del servidor si es necesario
            console.log('eliminación exitosa:', response);
            if (!response.success) {
              Swal.fire(
                'Error',
                response.message,
                'warning'
              );
            } else if (response.success) {
              await this.geofencesService.removeListTag(response.tag);
              await this.geofencesService.updateListGeofences(response.geos);
              this.geofences = await this.geofencesService.createTreeNode();
              this.loading = false;
              Swal.fire(
                '',
                'Se eliminó la etiqueta correctamente!!',
                'success'
              );
            }
          },
          (error) => {
            // Manejar errores si la actualización falla
            console.error('Error al guardar la información:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error...',
              'warning'
            );
          }
        );
      },
    }).then((data) => {
      // if(data.isConfirmed) {
      //   Swal.fire(
      //     'Eliminar',
      //     `Eliminación de ${this.typeDelete} exitosa`,
      //     'success'
      //   );
      // }
    });
  }

  //Tableee

  headerScrollHandler() {
    setTimeout(() => {
      const headerBox = document.querySelector('.p-treetable-scrollable-header-box') as HTMLElement;
      const contentBox = document.querySelector('.p-treetable-tbody') as HTMLElement;
      if (headerBox != null && contentBox != null) {
        if (headerBox!.offsetWidth > contentBox!.offsetWidth) {
          headerBox!.classList.remove('no-scroll');
        } else {
          headerBox!.classList.add('no-scroll');
        }
      }
    }, 1000);
  }
  get tblDataGeoFiltered() {
    return this.circularGeofencesService.tblDataGeoFiltered;
  }
  get showBtnAdd() {
    return this.circularGeofencesService.showBtnAdd;
  }
  get showBtnEdit() {
    return this.circularGeofencesService.showBtnEdit;
  }
  get eyeInputSwitch() {
    return this.circularGeofencesService.eyeInputSwitch;
  }
  set eyeInputSwitch(value: boolean) {
    this.circularGeofencesService.eyeInputSwitch = value;
  }
  get tagNamesEyeState() {
    return this.circularGeofencesService.tagNamesEyeState;
  }

  treeTableResizing(e: any) {
    const navbarHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('rem', ''));
    const rowBusquedaHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--row-busqueda-height').replace('rem', ''));
    const panelMonitoreogeofencesHeaderHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--pm-vehiculos-header-height').replace('rem', ''));
    const treetableHeaderHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--treetable-header-height').replace('rem', ''));
    const rem_to_px = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var treeTable_height_in_px = $('.map-area-app').height()! - rem_to_px * (rowBusquedaHeight + panelMonitoreogeofencesHeaderHeight + treetableHeaderHeight + ($('.map-area-app').width()! > 740 ? 0 : navbarHeight));
    $('p-treetable.geofence-treetable .cdk-virtual-scroll-viewport').attr('style', 'height: ' + treeTable_height_in_px + 'px !important');
  }

  showGeosByTagOp(rowData: any) {
    console.log('rowData', rowData);
    //let displayGeos = this.geofencesService.listRows.find((item: { id: any; type: any; })=>item.id == rowData.id && item.type == rowData.type);
    let idOpe = rowData.idOpe;
    this.visibleRow.tempId = true;
    console.log('idOpe: ', rowData.idOpe);
    console.log('idTag: ', rowData.id);
    if (rowData.type == 'etiqueta') {
      var idTg = rowData.id;
      if (idTg == '0' && idOpe == '0') {
        const filteredGeos = this.geofencesService.listGeofences.filter((geos: { idoperation: any; }) => geos.idoperation == idOpe);
        filteredGeos.forEach((geo: { id: number; type: string; zone_visible: string; tags: string[]; }) => {
          if (geo.tags.length === 0 && geo.type == 'polig') {
            this.clickShowGeoPol(geo.id, true);
          } else if (geo.tags.length === 0 && geo.type == 'circ') {
            this.clickShowGeoCir(geo.id, true);
          }
        });
      } else if (idTg == '0' && idOpe != '0') {
        const filteredGeos = this.geofencesService.listGeofences.filter((geos: { idoperation: any; }) => geos.idoperation == idOpe);
        filteredGeos.forEach((geo: { id: number; type: string; zone_visible: string; tags: string[]; }) => {
          if (geo.tags.length === 0 && geo.type == 'polig') {
            this.clickShowGeoPol(geo.id, true);
          } else if (geo.tags.length === 0 && geo.type == 'circ') {
            this.clickShowGeoCir(geo.id, true);
          }
        });
      } else if (idTg != '0' && idOpe == '0') {
        const filteredGeos = this.geofencesService.listGeofences.filter((geos: { idoperation: any; }) => geos.idoperation == idOpe);
        filteredGeos.forEach((geo: { id: number; type: string; zone_visible: string; tags: string[]; }) => {
          if (geo.tags.includes(idTg) && geo.tags.length == 1 && geo.type == 'polig') {
            this.clickShowGeoPol(geo.id, true);
          } else if (geo.tags.includes(idTg) && geo.tags.length == 1 && geo.type == 'circ') {
            this.clickShowGeoCir(geo.id, true);
          }
        });
      } else if (idTg != '0' && idOpe != '0') {
        const filteredGeos = this.geofencesService.listGeofences.filter((geos: { idoperation: any; }) => geos.idoperation == idOpe);
        filteredGeos.forEach((geo: { type: string; id: number; tags: string | string[]; zone_visible: string; }) => {
          if (geo.tags.includes(idTg) && geo.tags.length == 1 && geo.type == 'polig') {
            this.clickShowGeoPol(geo.id, true);
          } else if (geo.tags.includes(idTg) && geo.tags.length == 1 && geo.type == 'circ') {
            this.clickShowGeoCir(geo.id, true);
          }
        });
      }
    } else if (rowData.type == 'operacion') {
      var idOp = rowData.id;
      this.geofencesService.listGeofences.forEach((geo: { id: number; type: string; idoperation: string; zone_visible: string; }) => {
        if (geo.idoperation === idOp && geo.type == 'polig') {
          this.clickShowGeoPol(geo.id, true);
        } else if (geo.idoperation === idOp && geo.type == 'circ') {
          this.clickShowGeoCir(geo.id, true);
        }
      });

      for (let i = 0; i < this.geofencesService.geofences.length; i++) {
        this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
      }
      for (let i = 0; i < this.geofencesService.geofences.length; i++) {
        this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
      }
    }
  }

  onClickAllEyes() {
    this.onClickEyePol();
    this.onClickEyeCir();
    //this.clickShowGeoLin();
  }
  onClickEyePol() {
    var geofencesList = this.geofencesService.geofences.map((geofence: { id: number, zone_visible: string }) => { return { id: geofence.id, visible: geofence.zone_visible }; });
    geofencesList.forEach((geofence: { id: number, visible: string }) => {
      if ((geofence.visible == 'true') != this.geofencesService.eyeInputSwitch) {
        this.clickShowGeoPol(geofence.id, true);
      }
    });

    for (let i = 0; i < this.geofencesService.geofences.length; i++) {
      this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
    }
    for (let i = 0; i < this.geofencesService.geofences.length; i++) {
      this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
    }
  }
  onClickEyeCir() {
    let ciruclarGeofencesList = this.circularGeofencesService.circular_geofences.map((circular_geofence: { id: number, zone_visible: string }) => {
      return { id: circular_geofence.id, visible: circular_geofence.zone_visible };
    });

    ciruclarGeofencesList.forEach((circular_geofence: { id: number, visible: string }) => {
      if ((circular_geofence.visible == 'true') != this.geofencesService.eyeInputSwitch) {
        this.clickShowGeoCir(circular_geofence.id, true);
      }
    });

    for (let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++) {
      this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }
    for (let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++) {
      this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }
  }

  onClickShowAllNames() {
    this.onClickShowNamesPol();
    this.onClickShowNamesCir();
    this.onClickShowNamesLin();
  }
  onClickShowNamesPol() {
    this.geofencesService.tagNamesEyeState = !this.geofencesService.tagNamesEyeState;
    var geofencesList = this.geofencesService.geofences.map((geofence: { id: number, zone_name_visible: string }) => { return { id: geofence.id, tag_visible: geofence.zone_name_visible }; });
    geofencesList.forEach((geofence: { id: number, tag_visible: string }) => {
      if ((geofence.tag_visible == 'true') != this.geofencesService.tagNamesEyeState) {
        this.clickShowGeoPolName(geofence.id, true);
      }
    });
  }
  onClickShowNamesCir() {
    this.circularGeofencesService.tagNamesEyeState = !this.tagNamesEyeState;
    let circularGeofencesList = this.circularGeofencesService.circular_geofences.map((circular_geofence: { id: number, zone_name_visible: string }) => {
      return {
        id: circular_geofence.id,
        tag_visible: circular_geofence.zone_name_visible
      };
    });
    circularGeofencesList.forEach((circular_geofence: { id: number, tag_visible: string }) => {
      if ((circular_geofence.tag_visible == 'true') != this.tagNamesEyeState) {
        this.clickShowGeoCirName(circular_geofence.id, true);
      }
    });
  }
  onClickShowNamesLin() {
    this.polylineGeofenceService.tagNamesEyeState = !this.tagNamesEyeState;
    let polyGeofencesList = this.polylineGeofenceService.polyline_geofences.map((circular_geofence: { id: number, zone_name_visible: string }) => {
      return {
        id: circular_geofence.id,
        tag_visible: circular_geofence.zone_name_visible
      };
    });
    polyGeofencesList.forEach((circular_geofence: { id: number, tag_visible: string }) => {
      if ((circular_geofence.tag_visible == 'true') != this.tagNamesEyeState) {
        this.clickShowGeoLinName(circular_geofence.id, true);
      }
    });
  }

  clickShowGeo(id: number, type: string) {
    if (type == 'polig') {
      this.clickShowGeoPol(id);
    } else if (type == 'circ') {
      this.clickShowGeoCir(id);
    } else if (type == 'line') {
      this.clickShowGeoLin(id);
    }
  }

  clickShowGeoPol(id: number, comesFromInputSwitch?: boolean) {
    var geo = this.geofencesService.geofences.filter((item: any) => item.id == id)[0];
    let tempOld: string = '';
    if (geo.zone_visible == 'true') {
      geo.zone_visible = 'false';
      this.mapService.map.removeLayer(geo.geo_elemento);
      tempOld = geo.zone_name_visible_old;
      geo.zone_name_visible_old = geo.zone_name_visible;
      if (geo.zone_name_visible == 'true') {
        this.clickShowGeoPolName(id);
      }
    } else {
      geo.zone_visible = 'true';
      geo.geo_elemento.addTo(this.mapService.map);
      if (geo.zone_name_visible_old == 'true') {
        this.clickShowGeoPolName(id);
      }
    }
    this.geofencesService.updateGeoCounters();
    this.geofencesService.updateGeoTagCounters();

    if (typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch) {
      let auxIndex = -1;
      this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;

      if (geo.zone_visible == 'true') {
        console.log('Mostrar una geocerca' + id);
        //Redraw geofences in correct order
        for (let i = this.geofencesService.geofences.length - 1; i > -1; i--) {
          //Limpiar geocercas empezando desde la más pequeña, hasta la geocerca que se acaba de mandar show
          this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
          if (this.geofencesService.geofences[i].id == id) {
            auxIndex = i;
            i = -1;
          }
        }
        //Redibujamos las geocercas empezando desde la que se debe mostrar, hasta la mas pequeña
        for (let i = auxIndex; i < this.geofencesService.geofences.length; i++) {
          this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
        }
      }
    }
  }

  clickShowGeoCir(id: number, comesFromInputSwitch?: boolean) {
    let geo = this.circularGeofencesService.circular_geofences.filter((item: any) => item.id == id)[0];
    let tempOld: string = '';
    if (geo.zone_visible == 'true') {
      geo.zone_visible = 'false';
      this.mapService.map.removeLayer(geo.geo_elemento);
      tempOld = geo.zone_name_visible_old;
      geo.zone_name_visible_old = geo.zone_name_visible;
      if (geo.zone_name_visible == 'true') {
        this.clickShowGeoCirName(id);
      }
    } else {
      geo.zone_visible = 'true';
      geo.geo_elemento.addTo(this.mapService.map);
      if (geo.zone_name_visible_old == 'true') {
        this.clickShowGeoCirName(id);
      }
    }

    this.circularGeofencesService.updateGeoCounters();
    this.circularGeofencesService.updateGeoTagCounters();

    if (typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch) {
      let auxIndex = -1;
      this.circularGeofencesService.eyeInputSwitch = this.circularGeofencesService.circularGeofenceCounters.visible != 0;

      if (geo.zone_visible == 'true') {

        for (let i = this.circularGeofencesService.circular_geofences.length - 1; i > -1; i--) {
          this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
          if (this.circularGeofencesService.circular_geofences[i].id == id) {
            auxIndex = i;
            i = -1;
          }
        }
        for (let i = auxIndex; i < this.circularGeofencesService.circular_geofences.length; i++) {
          this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
        }
      }
    }
  }

  clickShowGeoLin(id: number, comesFromInputSwitch?: boolean) {

    let geo = this.polylineGeofenceService.polyline_geofences.filter((item: any) => item.id == id)[0];

    if (geo.zone_visible == 'true') {
      geo.zone_visible = 'false';
      this.mapService.map.removeLayer(geo.geo_elemento);
      if (geo.zone_name_visible == 'true') {
        this.clickShowGeoLinName(id);
      }
    } else {
      geo.zone_visible = 'true';
      geo.geo_elemento.addTo(this.mapService.map);
      this.clickShowGeoLinName(id);
    }

    this.polylineGeofenceService.updateGeoCounters();
    this.polylineGeofenceService.updateGeoTagCounters();

    if (typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch) {
      let auxIndex = -1;

      this.polylineGeofenceService.eyeInputSwitch = (this.polylineGeofenceService.polylineGeofenceCounters.visible != 0);

      if (geo.zone_visible == 'true') {
        for (let i = this.polylineGeofenceService.polyline_geofences.length - 1; i > -1; i--) {
          this.polylineGeofenceService.clearDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
          if (this.polylineGeofenceService.polyline_geofences[i].id == id) {
            auxIndex = i;
            i = -1;
          }
        }
        for (let i = auxIndex; i < this.polylineGeofenceService.polyline_geofences.length; i++) {
          this.polylineGeofenceService.showDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
        }
      }
    }
  }

  clickShowGeoName(id: number, type: string) {
    if (type == 'polig') {
      this.clickShowGeoPolName(id);
    } else if (type == 'circ') {
      this.clickShowGeoCirName(id);
    } else if (type == 'line') {
      this.clickShowGeoLinName(id);
    }
  }

  clickShowGeoPolName(id: number, comesFromInputSwitch?: boolean) {
    var geo = this.geofencesService.geofences.filter((item: any) => item.id == id)[0];
    if (geo.zone_name_visible == "true") {

      geo.zone_name_visible = "false";
      geo.zone_name_visible_bol = false;

      this.mapService.map.removeLayer(geo.marker_name);
    } else {
      geo.zone_name_visible = "true";
      geo.zone_name_visible_bol = true;

      geo.marker_name.addTo(this.mapService.map);
    }
    //geo.zone_name_visible_old = geo.zone_name_visible;
    this.geofencesService.updateGeoTagCounters();
    if (typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch) {
      this.geofencesService.tagNamesEyeState = this.geofencesService.geofenceTagCounters.visible != 0;
    }
    //console.log('geoZone', geo.zone_name_visible,geo.zone_name_visible_old);
  }

  clickShowGeoCirName(id: number, comesFromInputSwitch?: boolean) {
    var geo = this.circularGeofencesService.circular_geofences.filter((item: any) => item.id == id)[0];

    if (geo.zone_name_visible == 'true') {
      geo.zone_name_visible = 'false';
      geo.zone_name_visible_bol = false;
      this.mapService.map.removeLayer(geo.marker_name);
    } else {
      geo.zone_name_visible = 'true';
      geo.zone_name_visible_bol = true;
      geo.marker_name.addTo(this.mapService.map);
    }
    this.circularGeofencesService.updateGeoTagCounters();
    if (typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch) {
      this.circularGeofencesService.tagNamesEyeState = (this.circularGeofencesService.circularGeofenceTagCounters.visible != 0);
    }
  }

  clickShowGeoLinName(id: number, comesFromInputSwitch?: boolean) {
    var geo = this.polylineGeofenceService.polyline_geofences.filter((item: any) => item.id == id)[0];

    if (geo.zone_name_visible == 'true') {
      geo.zone_name_visible = 'false';
      geo.zone_name_visible_bol = false;
      this.mapService.map.removeLayer(geo.marker_name);
    } else {
      geo.zone_name_visible = 'true';
      geo.zone_name_visible_bol = true;
      geo.marker_name.addTo(this.mapService.map);
    }
    this.polylineGeofenceService.updateGeoTagCounters();
    if (typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch) {
      this.polylineGeofenceService.tagNamesEyeState = (this.polylineGeofenceService.polylineGeofenceTagCounters.visible != 0);
    }
  }

  clickLocate(id: number, type: string) {
    if (type == 'polig') {
      this.clickLocatePol(id);
    } else if (type == 'circ') {
      this.clickLocateCir(id)
    } else if (type == 'line') {
      this.clickLocateLin(id);
    }
  }
  clickLocatePol(id: any) {
    var geo = this.geofencesService.geofences.filter((item: any) => item.id == id)[0];
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }
  clickLocateCir(id: number) {
    var geo = this.circularGeofencesService.circular_geofences.filter((item: any) => item.id == id)[0];
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }
  clickLocateLin(id: any) {
    const geo = this.polylineGeofenceService.polyline_geofences.filter((item: any) => item.id == id)[0];
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }

  clickAddGeoPol() {
    this.geofencesService.nameComponentPol = "ADD GEO";
    this.geofencesService.action = 'add';
  }

  clickConfigGeocerca(id: number, type: string) {
    if (type == 'polig') {
      this.clickConfigGeocercaPol(id);
    } else if (type == 'circ') {
      this.clickConfigGeocercaCir(id);
    } else if (type == 'line') {
      //this.clickConfigurarGeocercaLin(id);
    }
  }

  clickConfigGeocercaPol(id: number) {
    this.geofencesService.nameComponentPol = "ADD GEO";
    this.geofencesService.action = 'edit pol';
    this.geofencesService.idGeocercaEdit = id;
    this.geofencesService.setDivEnabled(false);
  }

  clickConfigGeocercaCir(id: number) {
    this.geofencesService.nameComponentPol = "ADD GEO";
    this.geofencesService.action = 'edit cir';
    this.geofencesService.idGeocercaEdit = id;
    this.geofencesService.setDivEnabled(false);
  }

  clickDeleteGeo(id: number, type: string) {
    if (type == 'polig') {
      this.clickDeleteGeoPol(id);
    } else if (type == 'circ') {
      this.clickDeleteGeoCir(id);
    } else if (type == 'line') {
      //this.clickDeleteGeoLin(id);
    }
  }

  async clickDeleteGeoPol(id: number) {
    this.geofencesService.action = 'delete';
    var geo = this.geofencesService.geofences.filter((item: any) => item.id == id)[0];

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea eliminar "${geo.zone_name}"?`,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const res = await this.geofencesService.delete(id);
        // this.deleteAlert.emit();
        // this.clickShowPanel(this.nameComponent);
        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        for (var i = 0; i < this.geofencesService.geofences.length; i++) {
          if (this.geofencesService.geofences[i].id === id) {
            this.geofencesService.geofences.splice(i, 1);
            i--;
          }
        }
        this.geofencesService.updateGeoCounters();
        this.geofencesService.updateGeoTagCounters();
        this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;
        this.geofencesService.tagNamesEyeState = this.geofencesService.geofenceTagCounters.visible != 0;
        this.onBusqueda();
        this.objGeofences.geofences = [];
        this.ngOnInit();
      }
    }).then(async data => {
      if (data.isConfirmed) {
        Swal.fire(
          'Eliminado',
          'Los datos se eliminaron correctamente!!',
          'success'
        );
      }
    });
  }

  clickDeleteGeoCir(id: number) {
    this.circularGeofencesService.action = "delete";
    var geo = this.circularGeofencesService.circular_geofences.filter((item: any) => item.id == id)[0];

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea eliminar "${geo.zone_name}"?`,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const res = await this.circularGeofencesService.delete(id);
        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        for (var i = 0; i < this.circularGeofencesService.circular_geofences.length; i++) {
          if (this.circularGeofencesService.circular_geofences[i].id === id) {
            this.circularGeofencesService.circular_geofences.splice(i, 1);
            i--;
          }
        }
        this.circularGeofencesService.initializeTable();
        this.circularGeofencesService.updateGeoCounters();
        this.circularGeofencesService.updateGeoTagCounters();
        this.circularGeofencesService.eyeInputSwitch = this.circularGeofencesService.circularGeofenceCounters.visible != 0;
        this.circularGeofencesService.tagNamesEyeState = this.circularGeofencesService.circularGeofenceTagCounters.visible != 0;
        this.onBusqueda();
        this.objGeofences.geofences = [];
        this.ngOnInit();
      }
    }).then(data => {
      if (data.isConfirmed) {
        Swal.fire(
          'Eliminado',
          'Los datos se eliminaron correctamente!!',
          'success'
        );
      }
    });
  }

  tableView(btn: number): void {
    this.btnSelected = btn;
    if (btn == 1) {
      this.viewOptions = 'viewGroup';
    } else if (btn == 2) {
      this.viewOptions = 'viewGen';
    }
  }
  clickAgregarZona() {
    console.log("aver");
    this.geofencesService.modalActive = true;
    this.geofencesService.action = 'add';
  }



  import(event: any) {
    console.log("import from1 ", event);
    this.geofencesService.modalActive = true;
    this.geofencesService.action = 'add';
    const file: File = event.target.files[0];
    console.log("johan1", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        console.log("johan2", fileContent);

        const datas: { name?: string, description?: string, color?: string, coordinate?: string, width?: string }[] = [];

        const regex = /<Placemark>[\s\S]*?<\/Placemark>/g;
        const nameRegex = /<name>\s*([\s\S]*?)\s*<\/name>/;
        const descriptionRegex = /<description>\s*([\s\S]*?)\s*<\/description>/;
        const coordinatesRegex = /<Polygon>\s*<outerBoundaryIs>\s*<LinearRing>\s*<coordinates>\s*([\s\S]*?)\s*<\/coordinates>/;
        const widthRegex = /<width>\s*([a-fA-F0-9]+)\s<\/width>/;
        const colorPolyStyleRegex = /<PolyStyle>\s*<color>\s*([a-fA-F0-9]+)\s*<\/color>/;
        let match;

        while ((match = regex.exec(fileContent)) !== null) {
          const nameMatch = nameRegex.exec(match[0]);
          const descriptionMatch = descriptionRegex.exec(match[0]);
          const colorMatch = colorPolyStyleRegex.exec(match[0]);
          const coordinatesMatch = coordinatesRegex.exec(match[0]);
          const widthMatch = widthRegex.exec(match[0]);

          const data: DataGeofence = {};

          if (nameMatch && nameMatch[1]) data.name = nameMatch[1].trim();
          if (descriptionMatch && descriptionMatch[1]) data.description = descriptionMatch[1].trim();
          if (colorMatch && colorMatch[1]) data.color = colorMatch[1].trim();
          if (coordinatesMatch && coordinatesMatch[1]) data.coordinate = coordinatesMatch[1].trim();
          if (widthMatch && widthMatch[1]) data.width = widthMatch[1].trim();

          datas.push(data);
        }

        console.log("johan3: ", datas);

        const convertedData: DataGeofence[] = datas.map((data: DataGeofence) => {
          return {
            name: data.name || '',
            description: data.description || '',
            color: data.color || '',
            coordinate: data.coordinate || 'default_coordinate_value',
            width: data.width || ''
          };
        });
        this.dataGeo = convertedData;
        console.log("datageo fuera modal: ", this.dataGeo);
        this.geofencesService.sendDataModal(this.dataGeo);
        //this.geofencesService.sendDataModal(this.dataGeo);
        //
      };
      
      reader.readAsText(file);
    }
  }


  export(type: string) {
    console.log("export to ", type);
  }

}
