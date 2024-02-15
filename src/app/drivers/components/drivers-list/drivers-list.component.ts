import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../../panel/services/panel.service';

import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { DriversService } from '../../services/drivers.service';
import Swal from 'sweetalert2';
import { Driver } from '../../models/interfaces';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {


  
  isUnderConstruction: boolean = false;
  userData: any; //Informacion del usuario
  searchValueDriver: any;

  NomBusquedaDriver = "";
  noResults: boolean = false;
  constructor(
    public panelService: PanelService,
    public driversService: DriversService,
    public vehicleService: VehicleService,

  ) { }

  ngOnInit(): void {
    console.log("=================DRIVERS");
    console.log(this.panelService.userData);

    if(!this.driversService.initializingDriver){
      this.driversService.initialize();//AHORA ES UN SERVICIO QUE SIEMPRE SE INICIA
    }
    // console.log(this.driversService.drivers);
    // console.log('DRIVER ID 300->',this.driversService.getDriverById(300));
  }

  clickConfigurarDriver(id:any) {
    // console.log('ID ENCONTRADA',id);
    this.driversService.modalActive=true;
    this.driversService.action='edit';
    this.driversService.idDriverEdit = id;

  }

  clickEliminarDriver(id:any) {
    console.log('------clickEliminarDriver');
    
    console.log(id);
    
    this.driversService.action='delete';

    var sub = this.driversService.drivers.filter((item:any)=> item.id == id)[0];

    console.log('----clickEliminarDriver');
    console.log(sub);
    Swal.fire({
      //title: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?',
      title: '¿Está seguro?',
      text: '¿Está seguro que desea eliminar '+sub.nombre_conductor+'?', //'Espere un momento...',
      icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        var res:any;
        res = await this.driversService.delete(sub);
        // console.log(res);
          if (res.text == 'eliminado') {
              Swal.fire(
                '',
                'Conductor se elimino correctamente',
                'success'
              );
              if(res.driver.tipo_identificacion.vehicle==true){
                this.vehicleService.updateDriverAndId(res.driver,true);
              }

          } else if (res.text == 'no eliminado') {
              Swal.fire(
                '',
                'Conductor no se elimino correctamente',
                'error'
              );
            //icon: 'error',
          }else{

          }


      },
    }).then((data) => {
      // console.log("data-------");
      // console.log(data);
      if(data.isConfirmed){
        this.driversService.spinner.show('loadingDrivers');
        this.driversService.getAll();
      }
    });




  }

  clickAgregarDriver() {
    console.log(this.driversService.drivers.length);
    this.driversService.modalActive=true;
    this.driversService.action='add';
  }

  onSearchDriver(){
    console.log('searching ...',this.searchValueDriver);
    this.driversService.spinner.show('loadingDrivers');

    if(this.searchValueDriver == ''){
      this.driversService.tblDataDriver = this.driversService.getTableAllData();
      // this.noResults = false;
      console.log('VACIO GET ALL DATA...');
    } else {
      // this.driversService.tblDataDriver = this.driversService.getTableDataDriver();
      const searchTerm = this.searchValueDriver.toLowerCase();

      // Filtrar los datos según el término de búsqueda
      this.driversService.tblDataDriver = this.driversService.getTableDataDriver().filter((driver:Driver) => 
        driver.nombre_conductor.toLowerCase().includes(searchTerm) ||
        (driver.tracker_nombre && driver.tracker_nombre.toLowerCase().includes(searchTerm)) ||
        (driver.nro_llave && driver.nro_llave.toLowerCase().includes(searchTerm)) ||
        (driver.dni_conductor && driver.dni_conductor.toLowerCase().includes(searchTerm)) 
      );
      console.log(this.driversService.tblDataDriver);
    }
  }
}
