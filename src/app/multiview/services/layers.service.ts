import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CircularGeofencesMinimapService } from './circular-geofences-minimap.service';
import { GeofencesMinimapService } from './geofences-minimap.service';
import { GeopointsMinimapService } from './geopoints-minimap.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  public isReady: boolean = false;
  private servicesReadySubject = new BehaviorSubject<boolean>(false);
  public servicesReady$ = this.servicesReadySubject.asObservable();

  constructor(
    private circularGeofencesService: CircularGeofencesMinimapService,
    public geofencesService: GeofencesMinimapService,
    public geopointsService: GeopointsMinimapService,
  ) {

    this.circularGeofencesService.ready.subscribe(resp => {
      if(resp){
        this.checkReadyServices();
      }
    })
    this.geofencesService.ready.subscribe(resp => {
      if(resp){
        this.checkReadyServices();
      }
    })
    this.geopointsService.ready.subscribe(resp => {
      if(resp){
        this.checkReadyServices();
      }
    })

   }

  async initializeServices() {
    console.log("Layers Inicializando");
    
    await this.circularGeofencesService.initialize();
    await this.geofencesService.initialize();
    await this.geopointsService.initialize();
  }
  
  private checkReadyServices(){    
    if(this.circularGeofencesService.initializingCircularGeofences
      && this.geofencesService.initializingGeofences
      && this.geopointsService.initializingGeopoints){
        this.servicesReadySubject.next(true);
        this.isReady = true;
    }
  }
  
}
