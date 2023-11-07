import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng-lts/api';
import { MultimediaService } from 'src/app/multiview/services/multimedia.service';

@Component({
  selector: 'app-footbar',
  templateUrl: './footbar.component.html',
  styleUrls: ['./footbar.component.scss']
})
export class FootbarComponent implements OnInit {

  itemsMenu: MenuItem[]=[];
  showScreenRecorder = false;
  showCipiaExample = false;

  @ViewChild('MapView') mapView!: ElementRef;

  constructor(private multimediaService: MultimediaService) { }

  ngOnInit(): void {
    this.itemsMenu = [
      {
        id: '1',
        label: 'Grabar Pantallas',
        icon: 'pi pi-fw pi-video',
        command: (event) => {
          console.log("grabar pantallas: ", event);
          this.showScreenRecorder = true;
        },
      },
      {
        id: '2',
        label: 'Tomar captura',
        icon: 'pi pi-fw pi-camera',
        command: (event) => {
          this.multimediaService.screenShot(this.mapView.nativeElement);
        },
      },
      {
        id: '3',
        label: 'Ejemplo cipia video',
        icon: 'pi pi-fw pi-video',
        command: (event) => {
          this.showCipiaExample = true;
        },
      }
    ];
  }

  closeScreenRecorder(){
    this.showScreenRecorder = false;
  }

}
