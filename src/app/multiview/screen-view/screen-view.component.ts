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
  auxGridItems: GridItem[] = [];
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
        label: 'Grabar Pantalla (30seg max)',
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
      this.auxGridItems = [...this.gridItems];
      this.auxGridItems.unshift({
        structure: {row:0,col:0,span:0,gridItem_id:"Todo"},
        content_type: 'minimap',
        label: 'Todo',
        show_only_label:false
      });
    }
  }

  async updateGridItems(){
    //this.structures = this.multiviewService.calculateStructure(this.structures);
    for await (const item of this.gridItems) {
      item.structure = this.structures.find(st => st.gridItem_id == item.label)!;
      item.content_type = "minimap";
      item.show_only_label = false; 
    }
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
    this.auxGridItems = this.auxGridItems.filter(item => item.structure.gridItem_id != idContainer);
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
    console.log("presave: ", this.screenView.grids);
    this.screenView.grids = this.gridChild.items;
    console.log("post save: ", this.screenView.grids);
    console.log("guardando...");
    this.multiviewService.saveMultiview(this.screenView).subscribe(resp => {
      if(resp.success){
        this.wasChanged = false;
        this.loading = false;
        if(this.configName !== "default"){
          this.itemsMenu.find(item => item.id! == '1')!.disabled = true;
        }
        Swal.fire(
          {
            title: 'Guardado',
            text: 'Los datos se guardaron correctamente!!',
            icon: 'success',
            target:'body',
            heightAuto: false
          }
        ); 
      }else{
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar el grupo. Intente nuevamente.',
          icon: 'error',
          target:'body',
          heightAuto: false
        });
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
    //this.screenView.name = this.newName;
    if(this.multiviewService.userMultiview.find(item => item.name == this.newName)){
      // Si hay un multiview que se llame igual preguntar si sobreescribirá;
      console.log("duplicated?: ", this.multiviewService.userMultiview);
      Swal.fire({
        title: '¿Sobreescribir grupo?',
        text: `¿El grupo ${this.newName} ya existe, desea sobreecribirlo?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Sobreescribir',
        cancelButtonText: 'Cancelar',
        heightAuto: false,
        allowOutsideClick: () => !Swal.isLoading(), // Evita interacción externa mientras se carga
        preConfirm: async () => {
          try {
            const resp = await this.multiviewService.saveMultiview(this.screenView,this.newName).toPromise();
            if (resp.success) {
              this.wasChanged = false;
              this.showSaveAs = false
              if(this.configName === "default"){
                this.itemsMenu.find(item => item.id! == '1')!.disabled = true;
              }
              this.loading = false;
              Swal.fire(
                {
                  title: 'Guardado',
                  text: 'Los datos se guardaron correctamente!!',
                  icon: 'success',
                  target:'body',
                  heightAuto: false
                }
              ); 
            } else {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar los datos.',
                icon: 'error',
                target:'body',
                heightAuto: false
              });
            }
          } catch (error) {
            this.loading = false;
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error en la solicitud.',
              icon: 'error',
              target:'body',
              heightAuto: false
            });
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
      this.multiviewService.saveMultiview(this.screenView, this.newName).subscribe(resp => {
        if(resp.success){
          console.log("current userMultiviews: ",this.multiviewService.userMultiview);
          this.wasChanged = false;
          this.showSaveAs = false;
          if(this.configName === "default"){
            this.itemsMenu.find(item => item.id! == '1')!.disabled = true;
          }
          Swal.fire(
            {
              title: 'Guardado',
              text: 'Los datos se guardaron correctamente!!',
              icon: 'success',
              target:'body',
              heightAuto: false
            }
          ); 
        }else{
          Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar el grupo. Intente nuevamente.',
            icon: 'error',
            target:'body',
            heightAuto: false
          });
        }
        this.loading = false;
      });
    }
  }
}
