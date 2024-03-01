import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter, AfterViewInit } from '@angular/core';

import { VehicleConfigService } from '../../services/vehicle-config.service';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

@Component({
  selector: 'app-vehicle-config',
  templateUrl: './vehicle-config.component.html',
  styleUrls: ['./vehicle-config.component.scss']
})
export class VehicleConfigComponent implements OnInit {

  @Input('display') display: boolean = false;
  @Input('config') config: any = [];
  @Output() eventDisplay = new EventEmitter<boolean>();
  @Output() eventUpdate = new EventEmitter<any>();

  @ViewChild('name',{ static:true}) name!: ElementRef;
  @ViewChild('sim',{ static:true}) sim!: ElementRef;
  @ViewChild('placa',{ static:true}) placa!: ElementRef;
  @ViewChild('tolva',{ static:true}) tolva!: ElementRef;
  @ViewChild('empresa',{ static:true}) empresa!: ElementRef;
  @ViewChild('svgContainer') svgContainer: ElementRef | undefined;

  loading : boolean = false;
  formDisplay : string = "flex";
  /* formDisplay : string = "block"; */


  iconUrl: string = '';
  selectedIcon: any = {};
  selectedType: any = {};
  vehicle: any = {};

  types: any = [
    {id: '0', name: 'BUS'},
    {id: '1', name: 'MINIBUS'},
    {id: '2', name: 'VAN'},
    {id: '3', name: 'CAMIONETA'},
    {id: '4', name: 'CONCENTRADO'},
    {id: '5', name: 'OTROS'},
  ];

  selectedColor: any; // Variable para almacenar el color seleccionado

  colorsVehicles: any[] = [
    { name: 'Celeste', code: '#add8e6' }, // Celeste
    { name: 'Morado', code: '#9370db' }, // Morado
    { name: 'Naranja', code: '#ffa500' }, // Naranja
    { name: 'Amarillo', code: '#ffff00' }, // Amarillo
    { name: 'Verde Claro', code: '#90ee90' }, // Verde Claro
    { name: 'Guinda', code: '#800000' }, // Guinda
    { name: 'Dorado', code: '#ffd700' }, // Dorado
    { name: 'Plateado', code: '#c0c0c0' }, // Plateado
  ];

  groups: any = [
    { name: "CLIENTES TACNA", id:'0'},
    { name: "GPSTEL", id:'1'},
    { name: "Unidades Sin Grupo", id:'2'},
    { name: "WARI SERVICE", id:'3'}

  ];
  icons: any = [
    { name: "1.png", code: "1", type: "4" },
    { name: "2.png", code: "2", type: "4" },
    { name: "3.svg", code: "3", type: "3" },
    { name: "4.png", code: "4", type: "4" },
    { name: "5.png", code: "5", type: "4" },
    { name: "6.png", code: "6", type: "2" },
    { name: "7.png", code: "7", type: "5" },
    { name: "8.png", code: "8", type: "5" },
    { name: "9.png", code: "9", type: "5" },
    { name: "10.png", code: "10", type: "4" },
    { name: "11.png", code: "11", type: "5" },
    { name: "12.png", code: "12", type: "5" },
    { name: "13.png", code: "13", type: "5" },
    { name: "14.png", code: "14", type: "5" },
    { name: "15.png", code: "15", type: "5" },
    { name: "16.png", code: "16", type: "5" },
    { name: "17.png", code: "17", type: "5" },
    { name: "18.png", code: "18", type: "4" },
    { name: "19.png", code: "19", type: "5" },
    { name: "20.png", code: "20", type: "1" },
    { name: "26.png", code: "26", type: "5" },
    { name: "31.png", code: "31", type: "3" },
    { name: "33.png", code: "33", type: "5" },
    { name: "34.png", code: "34", type: "5" },
    { name: "41.png", code: "41", type: "4" },
    { name: "42.png", code: "42", type: "1" },
    { name: "43.png", code: "43", type: "1" },
    { name: "44.png", code: "44", type: "0" },
    { name: "45.png", code: "45", type: "0" },
    { name: "46.png", code: "46", type: "0" },
    { name: "47.png", code: "47", type: "0" },
    { name: "48.png", code: "48", type: "0" },
    { name: "49.png", code: "49", type: "3" },
    { name: "50.png", code: "50", type: "4" },
    { name: "51.png", code: "51", type: "1" },
    { name: "52.png", code: "52", type: "2" },
  ];
  dropdownIcons: any = [];
  svgContent: any;

  constructor(
    private configService: VehicleConfigService,
    private userDataService: UserDataService,
    private http: HttpClient, 
  ) {}


  ngOnInit(): void {

  }
  async onShow(){

    console.log(this.config);
    // console.log("vehicle config = ",this.config);
    this.iconUrl = `assets/images/objects/nuevo/backup/${this.config.icon}` ?? 'assets/images/objects/nuevo/imagen_no_encontrada.png';
    
  }
  

  onClickCancel(){
    this.eventDisplay.emit(false);
  }
  confirm(){
    this.loading=true;

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
        await this.onSubmit();
      },
    }).then((data) => {
      if(data.isConfirmed) {
        Swal.fire(
          'Éxito',
          'Los cambios se guardaron exitosamente',
          'success'
        );
      } else {
        console.log('(Vehicle Config) Hubo un error al guardar los cambios');
      }
      this.loading=false;
    });
  }
  async onSubmit(){

    this.vehicle = {
      IMEI: this.config.IMEI,
      id_conductor: this.config.id_conductor,
      idgrupo: this.config.idgrupo,
      name : this.valueNull(this.name.nativeElement.value),
      model: this.config.model,
      sim_number : this.valueNull(this.sim.nativeElement.value),
      plate_number : this.valueNull(this.placa.nativeElement.value),
      // tolva : this.valueNull(this.tolva.nativeElement.value),
      empresa : this.valueNull(this.empresa.nativeElement.value),
      tipo : this.selectedType.id,
      icon : this.selectedIcon.name,
      int_correctivo_h: this.config.int_correctivo_h,
      int_preventivo_h : this.config.int_preventivo_h,
      bol_correctivo_ini : this.config.bol_correctivo_ini,
      bol_correctivo_fin : this.config.bol_correctivo_fin,
      dat_correctivo_ini : this.config.dat_correctivo_ini,
      dat_correctivo_fin : this.config.dat_correctivo_fin

    };


    // //console.log("vehicle config = ",this.config);
    // //console.log("vehicle edit = ",this.vehicle);
    //procesando info

    //end procesando info
    //console.log('(Vehicle Config) Iniciando guardado de cambios: ');
    await this.configService.putConfig(this.vehicle).toPromise()
      .then( newConfig => {
        if(newConfig.res){
          // console.log(newConfig);
          this.configService.onVehicleUpdate(newConfig.data);
          //console.log('(Vehicle Config) Recibido data de guardado de cambios: ');
          this.eventUpdate.emit(this.vehicle);
          this.eventDisplay.emit(false);
        }
      }).catch(errorMsg => {
        console.log('(Vehicle Config) Error al guardar datos del vehiculo: ', errorMsg)
      });
  }
  valueNull(a: string){
    if(a.length==0){
      return null;
    }else{
      return a;
    }
  }

  updateIconsDropdown(){
    let found = false;
    this.dropdownIcons = this.icons.filter((icon: any) => {
      return icon.type == this.selectedType.id;
    });
    for(let i = 0; i < this.dropdownIcons.length; i++){
      if(this.dropdownIcons[i].code == this.selectedIcon.code){
        this.selectedIcon = this.dropdownIcons[i];
        found = true;
      }
    }
    if(!found){
      this.selectedIcon = this.selectedIcon = this.dropdownIcons[0];
    }
  }

}
