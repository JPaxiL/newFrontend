import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { TreeNode } from 'primeng-lts/api';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FollowService } from '../../services/follow.service';
import Swal from 'sweetalert2';
import { UserTracker } from 'src/app/multiview/models/interfaces';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss'],
})
export class TreeTableComponent implements OnInit {



  @Output() eventDisplayGroup = new EventEmitter<boolean>();

  showVehiclesFixes: boolean = true;
  vehicleIconState: boolean = true;
  vehicleTransmissionStatus: boolean = true;
  sortOrder: number = 1;
  display: boolean = false;
  displayDelete: boolean = false;
  displayEditGroup: boolean = false;
  textDelete: string = '';
  textHeaderEdit: string = '';
  idDelete!: number;
  typeDelete!: string;
  config: any = [];
  vehicles: TreeNode[] = [];
  cols: any[] = [];
  loading: boolean = true;
  list1: any = [];
  list2: any = [];
  selectedList1: any = [];
  selectedList2: any = [];

  private dataEdit: any = {
    id: -1,
    name: '',
    type: '',
  };
  alreadyLoaded: boolean = false;
  readonlyNameGroup: boolean = false;

  @ViewChild('nameEdit', { static: true }) nameEdit!: ElementRef;
  color: any = {
    10: '#45e845',
    20: '#2cadf2',
    30: '#b23ccf',
    40: '#000',
    50: '#ffb300',
    60: '#cc1013',
    100: '#ABABAB',
  };

  hint: any = {
    10: 'Unidad en Movimiento',
    20: 'Unidad Detenida con Ignición',
    30: 'Unidad Detenida sin Ignición',
    40: 'Unidad sin Transmisión',
    50: 'Unidad sin Cobertura',
    60: 'Unidad con Error GPS',
    100: 'No definido',
  };

  public column: number = 9;
  public setting: any = {
    eye: true,
    imei: false,
    vehicle: true,
    tag_driver: false, //HASTA QUE SE IMPLEMENTE DRIVERS
    tag: true,
    follow: true,
    limit: true,
    gps: false,
    gsm: false,
    trans: false,
    config: true,
    sort: 'asc',
  };

  @ViewChild('tt') tt!: any;

  constructor(
    private userDataService: UserDataService,
    public vehicleService: VehicleService,
    private configDropdown: NgbDropdownConfig,
    private vehicleConfigService: VehicleConfigService,
    private spinner: NgxSpinnerService,
    private followService: FollowService,
    private sanitizer: DomSanitizer,
    private domSanitizer:DomSanitizer
    ) {
    // this.vehicleService.listTable=1;
    if (this.loading) {
      this.spinner.show('loadingTreeTable');
    } else {
      this.alreadyLoaded = true;
      console.log(this.alreadyLoaded);
    }
    configDropdown.placement = 'right-top';
    configDropdown.autoClose = 'outside';
    this.vehicleService.dataTreeCompleted.subscribe((vehicles) => {
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading = false;
      this.spinner.hide('loadingTreeTable');
      this.treeTableResizing(true);
      this.headerScrollHandler();
    });

    this.vehicleService.reloadTableTree.subscribe((res) => {
      if (this.vehicleService.treeTableStatus) {
        // //console.log('desde tree table ...');
        // this.vehicleService.vehiclesTree = this.vehicleService.createNode(this.vehicleService.vehicles);
        this.vehicles = this.vehicleService.vehiclesTree;
      }
    });
  }



  ngOnInit(): void {
    this.vehicleService.treeTableStatus = true;
    // //console.log("tree on init");
    if (this.vehicleService.statusDataVehicleTree) {
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading = false;
      this.alreadyLoaded = true;
      this.headerScrollHandler();
      console.log(this.vehicleService.vehiclesFixes);
      this.showVehiclesFixes = this.vehicleService.unitsFixesStatus;
    }
    this.cols = [
      { field: 'eye', header: 'eye' },
      { field: 'name', header: 'Vehículo' },
      { field: 'activo', header: 'TAG' },
      { field: 'follow', header: 'speed' },
      /* { field: 'gps', header: 'speed' },
          { field: 'gsm', header: 'speed' }, */
      { field: 'point_color', header: 'speed' },
      { field: 'activo', header: 'speed' },
    ];
    this.treeTableResizing(true);
    window.addEventListener('resize', this.treeTableResizing, true);
    screen.orientation.addEventListener('change', this.treeTableResizing);
    // console.log(this.vehicleService.vehicles);

    // console.log('loading SVGS -->',this.userDataService.svgContents['minibus_van.svg']);
  }





  headerScrollHandler() {
    setTimeout(() => {
      const headerBox = document.querySelector(
        '.p-treetable-scrollable-header-box'
      ) as HTMLElement;
      const contentBox = document.querySelector(
        '.p-treetable-tbody'
      ) as HTMLElement;
      if (headerBox != null && contentBox != null) {
        if (headerBox!.offsetWidth > contentBox!.offsetWidth) {
          headerBox!.classList.remove('no-scroll');
        } else {
          headerBox!.classList.add('no-scroll');
        }
      }
    }, 1000);
  }

  treeTableResizing(e: any) {
    /* console.log('--navbar-height: ', Number(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('rem', ''))); */

    const navbarHeight = Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-height')
        .replace('rem', '')
    );
    const footbarHeight = Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--footbar-height')
        .replace('rem', '')
    );
    const rowBusquedaHeight = Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--row-busqueda-height')
        .replace('rem', '')
    );
    const panelMonitoreoVehiclesHeaderHeight = Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--pm-vehiculos-header-height')
        .replace('rem', '')
    );
    const treetableHeaderHeight = Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--treetable-header-height')
        .replace('rem', '')
    );
    /* this.toastr.success('treeTable altura previa:' + $('.map-area-app').height()!); */
    //console.log('treeTable altura previa en px:' + $('.map-area-app').height()!);
    const rem_to_px = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    // var treeTable_height_in_px = $('.map-area-app').height()! - rem_to_px * 4.375;

    //0.125rem es tolerancia para evitar overflow
    //Le quité la tolerancia porque el cálculo ahora es exacto.
    //12.125 era 9.375 + 2.75 (previa altura del navbar)
    var treeTable_height_in_px =
      $('.map-area-app').height()! -
      rem_to_px *
        (rowBusquedaHeight +
          panelMonitoreoVehiclesHeaderHeight +
          footbarHeight +
          treetableHeaderHeight +
          ($('.map-area-app').width()! > 740 ? 0 : navbarHeight));
    //$('p-treetable.vehicle-treetable .cdk-virtual-scroll-viewport').attr("style", '');
    $('p-treetable.vehicle-treetable .cdk-virtual-scroll-viewport').attr(
      'style',
      'height: ' + treeTable_height_in_px + 'px !important'
    );
    //console.log('treeTable altura en px:' + treeTable_height_in_px);
  }

  onChangeDisplay(res: boolean) {
    this.display = res;
  }
  onConfirmationEdit() {
    this.loading = true;
    //let currName = this.nameEdit.nativeElement.value;
    let currType = this.dataEdit.type;
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
        if (currType == 'pinUp') {
          await this.onSubmitEditFixes();
        } else {
          await this.onSubmitEdit();
        }
      },
    }).then((data) => {
      if (currType == 'pinUp') {
        if (data.isConfirmed) {
          Swal.fire(
            'Éxito',
            `Las unidades Fijadas se editaron exitosamente`,
            'success'
          );
        } else {
          console.log(
            `(Vehicle fixes) Hubo un error al editar las unidades Fijadas`
          );
        }
      } else {
        if (data.isConfirmed) {
          Swal.fire('Éxito', `El ${currType} se editó exitosamente`, 'success');
        } else {
          console.log(`(Vehicle Group) Hubo un error al editar el ${currType}`);
        }
      }

      this.loading = false;
    });
  }
  async onSubmitEdit() {
    // //console.log('eviando data para edicion');
    if (this.vehicleService.demo) {
      //console.log('modo demo, no se enviara info a la DB');
      this.updateGroup();

      this.vehicleService.reloadTableTree.emit();
      this.displayEditGroup = false;
    } else {
      const list1Filtered = this.list1.map((item: UserTracker) => ({
        id: item.id,
        IMEI: item.IMEI,
        idoperation: item.idoperation,
        idgrupo: item.idgrupo,
        idconvoy: item.idconvoy,
        nameoperation: item.nameoperation,
        namegrupo: item.namegrupo,
        nameconvoy: item.nameconvoy,
      }));
      const list2Filtered = this.list2.map((item: UserTracker) => ({
        id: item.id,
        IMEI: item.IMEI,
        idoperation: item.idoperation,
        idgrupo: item.idgrupo,
        idconvoy: item.idconvoy,
        nameoperation: item.nameoperation,
        namegrupo: item.namegrupo,
        nameconvoy: item.nameconvoy,
      }));
      const req = {
        type: this.dataEdit.type,
        id: this.dataEdit.id,
        // list1: this.list1,
        list1: list1Filtered,
        // list2: this.list2,
        list2: list2Filtered,
        name: this.nameEdit.nativeElement.value,
      };
      await this.vehicleConfigService
        .putGroupUpdate(req)
        .toPromise()
        .then((info) => {
          if (info.res) {
            this.updateGroup();
            this.vehicleService.reloadTableTree.emit();
            this.displayEditGroup = false;
          } else {
          }
        })
        .catch((errorMsg) => {
          console.log(errorMsg);
        });
    }
  }
  async onSubmitEditFixes() {
    const req = {
      vehicles: this.list2.map((item: { id: any }) => item.id),
    };
    console.log('Enviando...', req);
    let response = await this.vehicleConfigService.updateUnitFixes(req);
    // console.log(response);
    if (response.success) {
      await this.vehicleService.updateUnitFixes(req['vehicles']);
      this.updateGroup();
      this.vehicleService.reloadTableTree.emit();
      this.displayEditGroup = false;
    } else {
      Swal.fire(
        'Ups',
        `Ocurrió un problema al actualizar Las unidades Fijadas`,
        'error'
      );
    }
  }
  updateGroup() {
    const vehicles = this.vehicleService.vehicles;
    if (this.dataEdit.type == 'operacion') {
      for (const key in this.list1) {
        let index = vehicles.indexOf(this.list1[key]);
        vehicles[index].idoperation = 0;
        vehicles[index].nameoperation = 'Unidades Sin Operacion';
      }

      for (const key in this.list2) {
        let index = vehicles.indexOf(this.list2[key]);
        vehicles[index].idoperation = this.dataEdit.id;
        vehicles[index].nameoperation = this.nameEdit.nativeElement.value;
      }
      for (const key in vehicles) {
        if (vehicles[key].idoperation == this.dataEdit.id) {
          vehicles[key].nameoperation = this.nameEdit.nativeElement.value;
        }
      }
    } else if (this.dataEdit.type == 'grupo') {
      for (const key in this.list1) {
        let index = vehicles.indexOf(this.list1[key]);
        vehicles[index].idgrupo = 0;
        vehicles[index].namegrupo = 'Unidades Sin Grupo';
      }

      for (const key in this.list2) {
        let index = vehicles.indexOf(this.list2[key]);
        vehicles[index].idgrupo = this.dataEdit.id;
        vehicles[index].namegrupo = this.nameEdit.nativeElement.value;
      }
      for (const key in vehicles) {
        if (vehicles[key].idgrupo == this.dataEdit.id) {
          vehicles[key].namegrupo = this.nameEdit.nativeElement.value;
        }
      }
    } else if (this.dataEdit.type == 'convoy') {
      for (const key in this.list1) {
        let index = vehicles.indexOf(this.list1[key]);
        vehicles[index].idconvoy = 0;
        vehicles[index].nameconvoy = 'Unidades Sin Convoy';
      }

      for (const key in this.list2) {
        let index = vehicles.indexOf(this.list2[key]);
        vehicles[index].idconvoy = this.dataEdit.id;
        vehicles[index].nameconvoy = this.nameEdit.nativeElement.value;
      }
      for (const key in vehicles) {
        if (vehicles[key].idconvoy == this.dataEdit.id) {
          vehicles[key].nameconvoy = this.nameEdit.nativeElement.value;
        }
      }
    } else {
      console.log('Update Units Fixes...');
    }

    this.vehicleService.vehicles = vehicles;
    this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
  }
  showEditGroup(data: any) {
    this.dataEdit = data;
    // console.log('show edit data',data);
    this.displayEditGroup = true;
    this.textHeaderEdit = data.type + ' ' + data.name;
    this.nameEdit.nativeElement.value = data.name;
    this.readonlyNameGroup = false;

    //list 1
    const vehicles = this.vehicleService.vehicles;
    let aux1: any = [];
    let aux2 = [];
    let aux_idgrupo = -1;
    for (const key in vehicles) {
      // //console.log('id==idconvoy------->'+data.id+'=='+vehicles[key]['idconvoy'])
      if (data.type == 'operacion') {
        // if(data.id==vehicles[key]['idoperation']&&data.name==vehicles[key]['operation']){
        if (
          data.id == vehicles[key]['idoperation'] &&
          vehicles[key]['idgrupo'] == 0 &&
          vehicles[key]['idconvoy'] == 0
        ) {
          aux2.push(vehicles[key]);
        }
        //id 0 significa que no tiene
        aux1 = this.vehicleService.vehicles.filter(
          (vehicle: any) =>
            vehicle.idoperation == 0 &&
            vehicle.idgrupo == 0 &&
            vehicle.idconvoy == 0
        );
      }
      if (data.type == 'grupo') {
        if (
          data.id == vehicles[key]['idgrupo'] &&
          vehicles[key]['idconvoy'] == 0
        ) {
          aux2.push(vehicles[key]);
          //filtrar por idoperacion del grupo
          aux1 = this.vehicleService.vehicles.filter(
            (vehicle: any) =>
              vehicle.idoperation == vehicles[key]['idoperation'] &&
              vehicle.idgrupo == 0 &&
              vehicle.idconvoy == 0
          );
        }
      }
      if (data.type == 'convoy') {
        if (data.id == vehicles[key]['idconvoy']) {
          aux2.push(vehicles[key]);
          //filtrar por idoperacion del grupo
          aux1 = this.vehicleService.vehicles.filter(
            (vehicle: any) =>
              vehicle.idoperation == vehicles[key]['idoperation'] &&
              vehicle.idgrupo == vehicles[key]['idgrupo'] &&
              vehicle.idconvoy == 0
          );
        }
      }
    }

    this.list2 = aux2;
    this.list1 = aux1;
    console.log('LISTA --> 1', this.list1);
    console.log('LISTA --> 2', this.list2);
  }

  showEditFixes(data: any) {
    this.readonlyNameGroup = true;
    this.dataEdit = data;
    // console.log('show edit data',data);
    this.displayEditGroup = true;
    this.textHeaderEdit = ' ' + data.name;
    this.nameEdit.nativeElement.value = data.name;

    const vehicles = this.vehicleService.vehicles;
    const vehiclesFixes = this.vehicleService.vehiclesFixes;
    let aux1: any = [];
    let aux2 = [];
    aux1 = vehicles;
    for (const key in vehiclesFixes) {
      aux1 = aux1.filter((vehicle: any) => vehicle.id != vehiclesFixes[key]);
      const foundVehicle: any = this.vehicleService.vehicles.find(
        (vehicle: any) => vehicle.id == vehiclesFixes[key]
      );
      if (foundVehicle) {
        aux2.push(foundVehicle);
      }
    }
    this.list2 = aux2;
    this.list1 = aux1;
    // console.log('LISTA --> 1',this.list1);
    // console.log('LISTA --> 2',this.list2);
  }
  cleanFixes(data: any) {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de Limpiar la lista de Unidades Fijadas?`,
      icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Limpiar',
      cancelButtonText: 'Cancelar',
      customClass: {
        actions: 'w-100',
        cancelButton: 'col-4',
        confirmButton: 'col-4',
      },
      preConfirm: async () => {
        await this.onDeleteFixes(data);
      },
    }).then((data) => {
      if (data.isConfirmed) {
        Swal.fire('Limpiar', `Limpieza de Unidades Fijadas exitosa`, 'success');
      }
    });
  }
  async onDeleteFixes(data: any) {
    const req = {
      type: data.name,
    };
    let array: any = [];
    console.log('Enviando a Limpiar...', req);
    let response = await this.vehicleConfigService.cleanUnitFixes(req);
    if (response.success) {
      await this.vehicleService.updateUnitFixes(array);
      this.updateGroup();
      this.vehicleService.reloadTableTree.emit();
      this.displayEditGroup = false;
    } else {
      Swal.fire(
        'Ups',
        `Ocurrió un problema al limpiar Las unidades Fijadas`,
        'error'
      );
    }
  }
  showDelete(data: any) {
    this.textDelete = data['type'];
    if (data['id'] == null) {
      console.log('no hay id');
      Swal.fire({
        title: 'Error',
        text: 'No existe Agrupación, recarge la página ...',
        icon: 'error',
      });
    } else {
      this.idDelete = data['id'];
      this.typeDelete = data['type'];
      console.log('en proceso de borrado', this.idDelete, this.typeDelete);
    }

    // SI EXISTE UN CONVOY DEBE ENVIAR UN MENSAJE DE ANTES DESCOMPONER EL GRUPO
    if (this.textDelete == 'grupo') {
      const existsElement = this.vehicleService.vehicles.some(
        (vehicle: any) => {
          return vehicle.idgrupo === data['id'] && vehicle.idconvoy !== 0;
        }
      );
      if (existsElement) {
        Swal.fire({
          title: 'Error',
          text: 'Primero Debe Eliminar los convoy que tiene el grupo ...',
          icon: 'error',
        });
        return;
      }
      // SI EXISTE UN CONVOY/GRUPO DEBE ENVIAR UN MENSAJE DE ANTES DESCOMPONER LA OPERACION
    } else if (this.textDelete == 'operacion') {
      const existsElement = this.vehicleService.vehicles.some(
        (vehicle: any) => {
          return (
            vehicle.idoperation == data['id'] &&
            (vehicle.idgrupo != 0 || vehicle.idconvoy != 0)
          );
        }
      );
      if (existsElement) {
        Swal.fire({
          title: 'Error',
          text: 'Primero Debe Eliminar los grupos y/o convoys que tiene la operación ...',
          icon: 'error',
        });
        return;
      }
    }

    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de descomponer, ${data.type}: ${data.name}?`,
      icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Descomponer',
      cancelButtonText: 'Cancelar',
      customClass: {
        actions: 'w-100',
        cancelButton: 'col-4',
        confirmButton: 'col-4',
      },
      preConfirm: async () => {
        await this.onDelete();
      },
    }).then((data) => {
      if (data.isConfirmed) {
        Swal.fire(
          'Descomponer',
          `Descomposición de ${this.typeDelete} exitosa`,
          'success'
        );
      }
    });
  }

  upList1() {
    // this.list1=this.selectedList2;
    // this.selectedList2=[];
    let aux: any = [];

    //recupero valores upList2
    for (const key in this.list1) {
      aux.push(this.list1[key]);
    }
    // inserto valores nuevos
    // //console.log('subir a lista 2');
    for (const key in this.selectedList2) {
      // let index = aux.indexOf(this.selectedList2[key]);
      // //console.log("index====",index);
      aux.push(this.selectedList2[key]);
      //console.log(this.selectedList2[key]);
    }
    //inserto valores en list1
    this.list1 = aux;
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
    // this.list2=this.selectedList1;
    // this.selectedList1=[];
    let aux: any = [];

    //recupero valores upList2
    for (const key in this.list2) {
      aux.push(this.list2[key]);
    }
    // inserto valores nuevos
    // //console.log('subir a lista 2');
    for (const key in this.selectedList1) {
      // let index = aux.indexOf(this.selectedList1[key]);
      // //console.log("index====",index);
      aux.push(this.selectedList1[key]);
      // //console.log(this.selectedList1[key]);
    }
    //inserto valores en list2
    this.list2 = aux;
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
  async onDelete() {
    const req = {
      id: this.idDelete,
      type: this.typeDelete,
      vehicles: null,
    };
    // //console.log('borrando ...');

    await this.vehicleConfigService
      .putGroupDelete(req)
      .toPromise()
      .then((info) => {
        if (info.res) {
          let aux_vehicles = info.vehicles;
          let aux_vehicles_tree = this.vehicleService.vehicles;
          for (const key in aux_vehicles) {
            for (const j in aux_vehicles_tree) {
              if (aux_vehicles[key]['id'] == aux_vehicles_tree[j]['id']) {
                if (this.typeDelete == 'grupo') {
                  aux_vehicles_tree[j]['idgrupo'] = 0;
                  aux_vehicles_tree[j]['namegrupo'] = 'Unidades Sin Grupo';
                } else if (this.typeDelete == 'operacion') {
                  aux_vehicles_tree[j]['idoperation'] = 0;
                  aux_vehicles_tree[j]['nameoperation'] =
                    'Unidades Sin Operacion';
                } else if (this.typeDelete == 'convoy') {
                  aux_vehicles_tree[j]['idconvoy'] = 0;
                  aux_vehicles_tree[j]['nameconvoy'] = 'Unidades Sin Convoy';
                }
              }
            }
          }
          this.vehicleService.vehicles = aux_vehicles_tree;
          this.vehicleService.vehiclesTree =
            this.vehicleService.createNode(aux_vehicles_tree);
          this.vehicleService.reloadTableTree.emit();
          this.textDelete = info.message;
          this.displayDelete = false;
          this.idDelete = -1;
          this.typeDelete = '';
        }
      })
      .catch((errorMsg) => {
        console.log('Error al descomponer grupo/convoy: ', errorMsg);
      });

    //console.log('descomponer res = ',info);
  }
  onUpdate(res: any) {
    const vehicles = this.vehicleService.vehicles;
    // //console.log("vehicles socket",vehicles);

    const resultado = vehicles.find(
      (vehi: any) => vehi.IMEI == res.IMEI.toString()
    );
    if (resultado) {
      const index = vehicles.indexOf(resultado);

      vehicles[index].name = res.name;
      // vehicles[index].id_conductor = res.id_conductor;
      // vehicles[index].idgrupo = res.idgrupo;
      // vehicles[index].model = res.model;
      // vehicles[index].sim_number  = res.sim_number;
      // vehicles[index].plate_number  = res.plate_number;
      // vehicles[index].tolva  = res.tolva;
      // vehicles[index].empresa  = res.empresa;
      // vehicles[index].tipo  = res.tipo;
      // vehicles[index].icon  = res.icon;

      this.vehicleService.vehicles = vehicles;

      //reload talbe
      if (this.vehicleService.listTable == 0) {
        this.vehicleService.reloadTable.emit();
      } else {
        this.vehicleService.reloadTableTree.emit(
          this.vehicleService.vehiclesTree
        );
      }
    }
    // this.vehicleService.
  }
  onClickConfig(data: any): void {
    // //console.log("config...vehicle ",data);
    this.config = data;
    this.display = !this.display;

    // //console.log("display-->",this.display);
  }

  onChangeSelection(show_name: string) {
    // console.log('Vehicles de Tree:',this.vehicles);
    const vehicles = this.vehicleService.vehicles;
    let tempShowName = '';
    for (const index of vehicles) {
      // console.log('vehicle ->',index);
      if (show_name == 'num_plate') {
        tempShowName = index.plate_number!;
      } else if (show_name == 'cod_interno') {
        tempShowName = index.cod_interno!;
      } else if (show_name == 'name') {
        tempShowName = index.name_old!;
      }
      if (!tempShowName) {
        // Busca el valor correspondiente en nameShows basado en selectedNameShowVehicle
        const selectedOption =
          this.vehicleService.optionsFilterNameVehicle.find(
            (option) =>
              option.value === this.vehicleService.selectedFilterNameVehicle
          );
        // Verifica si se encontró una opción correspondiente
        if (selectedOption) {
          tempShowName = 'Unidad Sin ' + selectedOption.label;
        } else {
          tempShowName = 'Unidad Sin Nombre';
        }
      }
      index.name = tempShowName;
    }
    if (this.vehicleService.listTable == 0) {
      this.vehicleService.reloadTable.emit();
    } else {
      this.vehicleService.vehiclesTree =
        this.vehicleService.createNode(vehicles);
      this.vehicleService.reloadTableTree.emit();
    }
    this.vehicleService.onClickSelection(show_name);
  }
  ngOnDestroy(): void {
    this.vehicleService.treeTableStatus = false;
    window.removeEventListener('resize', this.treeTableResizing, true);
    screen.orientation.removeEventListener('change', this.treeTableResizing);
  }
  onClickGroup() {
    // this.displayGroup=true;
    this.eventDisplayGroup.emit(true);
    //console.log('displaygroup true');
  }
  onClickSetting(e: string): void {
    console.log('clikc setting', e);
    console.log('clikc setting', this.setting[e]);
    this.setting[e] = !this.setting[e];
    if (this.setting[e]) {
      this.column++;
    } else {
      this.column--;
    }
    // //console.log("colmun = ",this.column);
  }

  onClickEye(IMEI: string) {
    this.vehicleService.onClickEye(IMEI);
  }
  onClickIcon(IMEI: string) {
    this.vehicleService.onClickIcon(IMEI);
  }
  onSort(data: any) {
    console.log('sort desde tree', data);
    this.sortOrder = data;
  }
  onClickDriver(IMEI: string) {
    this.vehicleService.onClickDriver(IMEI);
  }
  onClickTag(IMEI: string) {
    this.vehicleService.onClickTag(IMEI);
  }

  onTableGroup() {
    this.vehicleService.listTable = 1;
    this.vehicleService.clickListTable.emit(1);
  }

  onTableGeneral() {
    this.vehicleService.listTable = 0;
    this.vehicleService.clickListTable.emit(0);
  }

  onTableTransmision() {}

  onClickFollow(rowData: any) {
    rowData.follow = !rowData.follow;
    this.followService.add(rowData);
    console.log('SEGUIR VEHICULO -->', rowData);
  }

  public onQuickFilterChanged(data: any) {
    // //console.log("tt",this.tt);
    this.tt.filterGlobal(data.target.value, 'contains');
    this.tt.defaultSortOrder = -1;
  }

  getContrastYIQ(hex: string) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }

  public onChangeUnitsFixes() {
    this.vehicleService.unitsFixesStatus = this.showVehiclesFixes;
    this.vehicleService.vehiclesTree = this.vehicleService.createNode(
      this.vehicleService.vehicles
    );
    this.vehicleService.reloadTableTree.emit();
  }
}
