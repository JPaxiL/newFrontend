import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CircularGeofencesMinimapService } from './circular-geofences-minimap.service';
import { GeofencesMinimapService } from './geofences-minimap.service';
import { GeopointsMinimapService } from './geopoints-minimap.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
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
    console.log("initializingCircularGeofences: ",this.circularGeofencesService.initializingCircularGeofences);
    console.log("initializingGeofences: ",this.geofencesService.initializingGeofences);
    console.log("initializingGeopoints: ",this.geopointsService.initializingGeopoints);
    
    if(this.circularGeofencesService.initializingCircularGeofences
      && this.geofencesService.initializingGeofences
      && this.geopointsService.initializingGeopoints){
        this.servicesReadySubject.next(true);
    }
  }
  
}
