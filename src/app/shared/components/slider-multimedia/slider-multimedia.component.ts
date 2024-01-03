import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import moment from 'moment';
import { MenuItem } from 'primeng-lts/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CipiaMultimediaParam, MultimediaItem, SourceCipiaMultimedia, TypeCipiaMultimedia, VideoOnDemandTime } from 'src/app/multiview/models/interfaces';
import { MultimediaService } from 'src/app/multiview/services/multimedia.service';

@Component({
  selector: 'app-slider-multimedia',
  templateUrl: './slider-multimedia.component.html',
  styleUrls: ['./slider-multimedia.component.scss']
})
export class SliderMultimediaComponent implements OnInit {

  @Input() event: any;
  @Input() driver: string = '';
  @Input() showFooter = false;
  @Input() showMultimediaFirst = true;
  @Input() showMultimedias = false;
  @Input() hasMultimedia = false;
  @Input() showTitle = true;

  loading = false;
  error = false;

  menuMultimedia:MenuItem[] = [
    {
      label: '30seg antes', 
      icon: 'pi pi-fw pi-step-backward',
      command: () => {
        this.getVideoOnDemand(30,'backward');
      }
    },
    {
      label: '30seg despues', 
      icon: 'pi pi-fw pi-step-forward',
      command: () => {
        this.getVideoOnDemand(30, 'forward');
      }
    },
    {
      label: 'grabar 30seg', 
      icon: 'pi pi-fw pi-video',
      command: () => {
        this.getVideoOnDemand(30, 'now');
      }
    }
  ];

  isMaximized = false;
  onDemandLoader = false;

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
  //multimedias: MultimediaItem[] = [];
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
      if (this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId] && 1 <= newValue && newValue <= (this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId].length)) {
          this._activeIndex = newValue;
      }
  }

  _activeIndex: number = 1;
  
  // -------- end  cipia multimedia
  private destroy$ = new Subject<void>();

  constructor(public multimediaService: MultimediaService,private sanitizer: DomSanitizer) { }

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
    console.log("MULTIMEDIAS RENDERED======= ",this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId]);
    if(this.showMultimediaFirst){
      this.loadMedia();
    }
  }

  checkCipiaMultimedia(params: any, imei:string){
    if (!this.multimediaService.multimediaCipiaItems.hasOwnProperty(params["eventId"])) {
      this.multimediaService.multimediaCipiaItems[params["eventId"]] = [];
    }else{
      console.log("params: ",params);
      console.log("this.multimediaService.multimediaCipiaItems: ",this.multimediaService.multimediaCipiaItems);
      console.log("event: ",this.event);
      return;
    }
    console.log("params: ",params);
    console.log("this.multimediaService.multimediaCipiaItems: ",this.multimediaService.multimediaCipiaItems);
    console.log("event: ",this.event);
    
    if(params["gps"] && params["gps"]=="cipia" && (params["has_video"]=="1" || params["has_image"] == "1")){
      this.hasMultimedia = true
      if(params["has_image"]=="1"){
        if(params["cabin_image"] == "1"){
          this.multimediaService.multimediaCipiaItems[params["eventId"]].push(
            {type:'image',params:{imei:imei,eventId:params["eventId"],type:"image",source:"CABIN"}, description: params["eventDateTime"], url:""}
          )
        }
        if(params["road_image"] == "1"){
          this.multimediaService.multimediaCipiaItems[params["eventId"]].push(
            {type:'image',params:{imei:imei,eventId:params["eventId"],type:"image",source:"ROAD"}, description: params["eventDateTime"], url:""}
          )
        }
      }
      if(params["has_video"]=="1"){
        if(params["cabin_video"] == "1"){
          this.multimediaService.multimediaCipiaItems[params["eventId"]].push(
            {type:'video',params: {imei:imei,eventId:params["eventId"],type:"video",source:"CABIN"}, description: params["eventDateTime"], url:""}
          )
        }
        if(params["road_video"] == "1"){
          this.multimediaService.multimediaCipiaItems[params["eventId"]].push(
            {type:'video',params: {imei:imei,eventId:params["eventId"],type:"video",source:"ROAD"}, description: params["eventDateTime"], url:""}
          )
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
    const media = item? item : this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId][this.activeIndex-1];
    this.error = false;
    if(media.url.length == 0){
      //const url = await this.multimediaService.getMediaFromEvent('E321361117',media.params.eventId,media.params.type,media.params.source).toPromise();
      this.loading = true;
      this.multimediaService.getMediaFromEvent(media.params.imei,media.params.eventId,media.params.type,media.params.source,undefined,undefined,3,10).pipe(takeUntil(this.destroy$)).toPromise().then(url => {
        if(url){
          this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId][this.activeIndex-1].url = this.sanitizer.bypassSecurityTrustUrl(url) as SafeUrl;
          console.log("nueva url: ",this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId][this.activeIndex-1].url);
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

  async getVideoOnDemand(seconds:number=30, option: VideoOnDemandTime='now', source: SourceCipiaMultimedia = "CABIN", type: TypeCipiaMultimedia = 'video'){
    this.onDemandLoader = true;
    let from = "";
    if(option == "backward"){
      from = moment(this.event.fecha_tracker, 'YYYY/MM/DD HH:mm:ss').subtract(seconds, 'seconds').add(5, 'hours').format('YYYY/MM/DD HH:mm:ss')
    }else if( option == "forward"){
      from = moment(this.event.fecha_tracker, 'YYYY/MM/DD HH:mm:ss').add(5, 'hours').format('YYYY/MM/DD HH:mm:ss')
    }

    let params:CipiaMultimediaParam = {
      imei: this.event.imei,
      type: type,
      seconds: seconds,
      from: from,
      source: source
    };
    if(option == "now"){
      console.log("record video with params: ", params);
      
      this.multimediaService.recordVideo(params).subscribe( frame => {
        console.log("frame obtained: ", frame);
        params.eventId = frame.Parametros.eventId;
        this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId].push(
          {type: type, params: params, url:"", description: frame.Parametros.eventDateTime}
        );
        console.log("Multimedia Item added: ",{type: type, params: params, url:"", description: frame.Parametros.eventDateTime});
        this.onDemandLoader = false;
        console.log("this.multimediaService.multimediaCipiaItems: ",this.multimediaService.multimediaCipiaItems);
      },
      error =>{
        console.error(error);
        this.onDemandLoader = false;
      });
    }else{
      console.log("retrieving video with params: ", params);
      
      this.multimediaService.retrieveVideoFrom(params).subscribe( frame => {
        console.log("frame obtained: ", frame);
        params.eventId = frame.Parametros.eventId;
        this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId].push(
          {type: type, params: params, url:"", description: frame.Parametros.eventDateTime}
        );
        console.log("Multimedia Item added: ",{type: type, params: params, url:"", description: frame.Parametros.eventDateTime});
        this.onDemandLoader = false;
        console.log("this.multimediaService.multimediaCipiaItems: ",this.multimediaService.multimediaCipiaItems);
      },
      error =>{
        console.error(error);
        this.onDemandLoader = false;
      });
    }
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    this.updateMaximizeState();
  }

  updateMaximizeState() {
    const sliderContent = document.querySelector('.slider-content');
    if (sliderContent) {
      if (this.isMaximized) {
        // Maximizar
        sliderContent.classList.add('maximized');
      } else {
        // Minimizar
        sliderContent.classList.remove('maximized');
      }
    }
  }

}
