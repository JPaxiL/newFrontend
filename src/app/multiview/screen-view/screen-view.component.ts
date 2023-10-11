import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventSocketService } from 'src/app/events/services/event-socket.service';
import { EventService } from 'src/app/events/services/event.service';
import { GridComponent } from '../grid/grid.component';
import { GridItem, ScreenView, StructureGrid, UnitItem } from '../models/interfaces';
import { LayersService } from '../services/layers.service';
import { MultiviewService } from '../services/multiview.service';
import { Title } from '@angular/platform-browser';
import {MenuItem} from 'primeng-lts/api';
import { MultimediaService } from '../services/multimedia.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-screen-view',
  templateUrl: './screen-view.component.html',
  styleUrls: ['./screen-view.component.scss']
})
export class ScreenViewComponent implements OnInit, AfterViewInit {
  configName = "";
  screenView!: ScreenView;
  gridItems: GridItem[] = [];
  //items: UnitItem[] = [];
  structures: StructureGrid[] = [];
  show_not_found = false;
  itemsMenu: MenuItem[]=[];

  wasChanged = false;
  //--------- save AS ----------
  showSaveAs = false;
  newName = "";
  validName = false;
  loading = false;

  showScreenRecorder = false;

  @ViewChild('_gridChild') gridChild!: GridComponent;
  @ViewChild('gridDiv') gridDivs!: ElementRef;
  @ViewChild('nameInput') nameInput!: ElementRef;

  constructor(
    private route: ActivatedRoute, 
    public multiviewService: MultiviewService, 
    private layersService: LayersService,
    private eventService: EventService,
    private eventSocketService: EventSocketService,
    private multimediaService: MultimediaService,
    private titleService: Title
    ) { }
  ngOnInit() : void{
    this.layersService.initializeServices();
    this.eventService.getAll();
    this.eventSocketService.listen();
    this.itemsMenu = [
      {
        id: '1',
        label: 'Guardar Cambios',
        icon: 'pi pi-fw pi-save',
        disabled: true,
        command: (event) => {
          console.log("guardar cambios: ", event);
          this.saveGridChanges();
        },
      },
      {
        id: '2',
        label: 'Guardar como',
        icon: 'pi pi-fw pi-plus',
        command: (event) => {
          console.log("guardar cambios: ", event);
          this.showSaveAs = true;
          this.newName = "";
        },
      },
      {
        id: '3',
        label: 'Grabar Pantalla',
        icon: 'pi pi-fw pi-video',
        command: (event) => {
          console.log("grabar video: ", event);
          this.showScreenRecorder = true;
        },
      },
      {
        id: '4',
        label: 'Tomar captura',
        icon: 'pi pi-fw pi-camera',
        command: (event) => {
          console.log("tomar captura: ", this.gridDivs.nativeElement);
          this.multimediaService.screenShot(this.gridDivs.nativeElement);
        },
      }
    ];
  }
  ngAfterViewInit(): void {
    // Obtiene el parámetro configId de la URL
    this.route.params.subscribe(params => {
      this.configName = params['name'];      
      console.log("configName: ",this.configName);
      try {
        this.screenView = this.multiviewService.getMultiviewFromLocalStorage(this.configName)[0] as ScreenView;
        console.log("this.screenView: ",this.screenView);
        this.gridItems = this.screenView.grids! as GridItem[];
        console.log("this.gridItems: ", this.gridItems);
        this.titleService.setTitle(this.configName.toUpperCase()+' - GL Tracker');
        for (let item of this.gridItems) {
          //this.items.push(item.content!);
          this.structures.push(item.structure!);
        }
        this.updateGridItems();
      } catch (error) {
        this.show_not_found = true;
        console.log(error);
      }
    });
  }

  isValidGroupName(){
    if(this.newName.length < 3 || this.newName.includes(' ')){
      this.validName = false;
      this.nameInput.nativeElement.classList.remove('ng-valid');
      this.nameInput.nativeElement.classList.add('ng-invalid','ng-dirty');
    }
    else{
      this.validName = true;
      this.nameInput.nativeElement.classList.remove('ng-invalid','ng-dirty');
      this.nameInput.nativeElement.classList.add('ng-valid');
    }
  }

  recordingStatus(event: boolean){
    console.log("esta grabando?: ", event);
  }

  setGritItems(){
    if(this.gridItems && this.gridItems.length>0){
      this.gridChild.setItems(this.gridItems);
    }
  }

  updateGridItems(){
    //this.structures = this.multiviewService.calculateStructure(this.structures);
    this.gridItems.forEach(item => {
      item.structure = this.structures.find(st => st.gridItem_id == item.label)!;
      item.content_type = "minimap";
      item.show_only_label = false;
    })
    this.setGritItems();
  }

  updateGridStructureInChild(){
    this.gridChild.updateStructure(this.structures);
    this.wasChanged = true;
    if(this.configName !== "default"){
      this.itemsMenu.find(item => item.id! == '1')!.disabled = false;
    }
    console.log("wasChanged: ",this.wasChanged);
  }

  onExchange(event: any){
    const { current_item: current, exchanged_item: exchanged }  = event;
    this.structures = this.multiviewService.calculateStructure(this.multiviewService.exchangeItems(this.structures,current,exchanged));
    this.updateGridStructureInChild();
  }
  deleteView(idContainer: string){
    this.structures = this.structures.filter(st => st.gridItem_id !== idContainer);
    this.structures = this.multiviewService.calculateStructure(this.structures);
    this.updateGridStructureInChild();
  }

  closeScreenRecorder(){
    this.showScreenRecorder = false;
  }

  saveGridChanges(){
    if(this.screenView.name == "screen_default"){
      this.showSaveAs = true;
      this.newName = "";
      return;
    }
    this.loading = true
    this.screenView.grids = this.gridChild.items;
    console.log("guardando...");
    this.multiviewService.saveMultiview(this.screenView).subscribe(resp => {
      if(resp.success){
        this.wasChanged = false;
        this.loading = false;
        if(this.configName !== "default"){
          this.itemsMenu.find(item => item.id! == '1')!.disabled = true;
        }
        Swal.fire('Guardado','Los datos se guardaron correctamente!!','success');
      }else{
        Swal.fire('Error', 'No se pudo guardar el grupo. Intente nuevamente.', 'error');
      }
    })
  }
  saveAsGrid(){
    this.isValidGroupName();
    if(!this.validName){
      console.log("no tiene nombre valido");
      return;
    }
    console.log("presave: ", this.screenView.grids);
    
    this.screenView.grids = this.gridChild.items;
    console.log("post save: ", this.screenView.grids);

    this.loading = true;
    this.screenView.name = this.newName;
      if(this.multiviewService.userMultiview.find(item => item.name === this.screenView.name)){
        // Si hay un multiview que se llame igual preguntar si sobreescribirá;
        console.log("duplicated?: ", this.multiviewService.userMultiview);
        Swal.fire({
          title: '¿Sobreescribir grupo?',
          text: `¿El grupo ${this.screenView.name} ya existe, desea sobreecribirlo?`,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: 'Sobreescribir',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: () => !Swal.isLoading(), // Evita interacción externa mientras se carga
          preConfirm: async () => {
            try {
              const resp = await this.multiviewService.saveMultiview(this.screenView).toPromise();
              if (resp.success) {
                this.wasChanged = false;
                this.showSaveAs = false
                if(this.configName !== "default"){
                  this.itemsMenu.find(item => item.id! == '1')!.disabled = true;
                }
                this.loading = false;
                Swal.fire(
                  'Guardado',
                  'Los datos se guardaron correctamente!!',
                  'success'
                ); 
              } else {
                this.loading = false;
                Swal.fire('Error', 'No se pudo guardar los datos', 'error');
              }
            } catch (error) {
              this.loading = false;
              Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
            }
          },
        }).then((result) => {
          if (result.isDismissed) {
            this.screenView.was_edited = true;
            this.loading = false;
          }
        });;
      }else{
        this.loading = true;
        this.multiviewService.saveMultiview(this.screenView).subscribe(resp => {
          if(resp.success){
            console.log("current userMultiviews: ",this.multiviewService.userMultiview);
            this.wasChanged = false;
            this.showSaveAs = false;
            if(this.configName !== "default"){
              this.itemsMenu.find(item => item.id! == '1')!.disabled = true;
            }
            Swal.fire(
              'Guardado',
              'Los datos se guardaron correctamente!!',
              'success'
            ); 
          }else{
            Swal.fire('Error', 'No se pudo guardar el grupo. Intente nuevamente.', 'error');
          }
          this.loading = false;
        });
      }
  }
}
