import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MultimediaService } from 'src/app/multiview/services/multimedia.service';

@Component({
  selector: 'app-slider-multimedia',
  templateUrl: './slider-multimedia.component.html',
  styleUrls: ['./slider-multimedia.component.scss']
})
export class SliderMultimediaComponent implements OnInit {

  @Input() event: any;
  @Input() driver: string = '';
  @Input() showFooter = true;
  @Input() showMultimediaFirst = true;
  @Input() showMultimedias = false;
  @Input() hasMultimedia = false;
  @Input() showTitle = true;

  loading = false;
  error = false;

  @ViewChild('multimedia_wrapper') multimediaWrapper!:ElementRef;

  icons_available = ["alcoholemia",
    "anticolision-frontal",
    "bloqueo-vision-mobileye",
    "colision-peatones",
    "desvio-de-carril-derecha",
    "desvio-de-carril-izquierda",
    "exceso-velocidad",
    "fatiga-extrema",
    "no-rostro"
  ]
  
  // -------- cipia multimedia
  
  displayMultimedia = false;
  multimedias: any[] = [];
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
      if (this.multimedias && 1 <= newValue && newValue <= (this.multimedias.length)) {
          this._activeIndex = newValue;
      }
  }

  _activeIndex: number = 1;
  
  // -------- end  cipia multimedia
  private destroy$ = new Subject<void>();

  constructor(private multimediaService: MultimediaService,private sanitizer: DomSanitizer) { }



  ngOnDestroy() {
    console.log("DESTRUYENDOOO");
    
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    console.log("EVENT RENDERED======= ",this.event);
    if(this.showMultimediaFirst){
      this.showMultimedias = true;
    }else{
      this.showMultimedias = false;
    }

    this.checkCipiaMultimedia(this.event.parametros,this.event.imei);
    console.log("MULTIMEDIAS RENDERED======= ",this.multimedias);
    if(this.showMultimediaFirst){
      this.loadMedia();
    }
  }

  checkCipiaMultimedia(params: any, imei:string){
    if(params["gps"] && params["gps"]=="cipia" && (params["has_video"]=="1" || params["has_image"] == "1")){
      this.hasMultimedia = true
      if(params["has_video"]=="1"){
        if(params["cabin_video"] == "1"){
          this.multimedias.push({type:'video',params: {imei:imei,eventId:params["eventId"],type:"video",source:"CABIN"}, url:""})
        }
        if(params["road_video"] == "1"){
          this.multimedias.push({type:'video',params: {imei:imei,eventId:params["eventId"],type:"video",source:"ROAD"}, url:""})
        }
      }
      if(params["has_image"]=="1"){
        if(params["cabin_image"] == "1"){
          this.multimedias.push({type:'image',params:{imei:imei,eventId:params["eventId"],type:"image",source:"CABIN"}, url:""})
        }
        if(params["road_image"] == "1"){
          this.multimedias.push({type:'image',params:{imei:imei,eventId:params["eventId"],type:"image",source:"ROAD"}, url:""})
        }
      }
    }
  }

  retryMultimedia(multimedia: any){

  }
  prev(){
    if(!this.loading){
      this.activeIndex++;
      console.log(this.multimediaWrapper.nativeElement);
      this.loadMedia();
    }
  }

  next(){
    if(!this.loading){
      this.activeIndex--;
      console.log(this.multimediaWrapper.nativeElement);
      this.loadMedia();
    }
  }

  async loadMedia(item?:any):Promise<void>{
    const media = item? item : this.multimedias[this.activeIndex-1];
    this.error = false;
    if(media.url.length == 0){
      //const url = await this.multimediaService.getMediaFromEvent('E321361117',media.params.eventId,media.params.type,media.params.source).toPromise();
      this.loading = true;
      this.multimediaService.getMediaFromEvent('E321361152',media.params.eventId,media.params.type,media.params.source,undefined,undefined,0).pipe(takeUntil(this.destroy$)).toPromise().then(url => {
        if(url){
          this.multimedias[this.activeIndex-1].url = this.sanitizer.bypassSecurityTrustUrl(url) as SafeUrl;
          console.log("nueva url: ",this.multimedias[this.activeIndex-1].url);
        }
        this.loading = false;
      }).catch( error => {
        console.log("eeeerror:",error);
        this.loading = false;
        this.error = true;
      });
    }
  }

  changeShowMultimedia(){
    this.showMultimedias = !this.showMultimedias;
    if(this.showMultimedias){
      this.loadMedia();
    }
  }

}
