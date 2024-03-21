import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import moment from 'moment';
import { MenuItem } from 'primeng-lts/api';
import { Slider } from 'primeng-lts/slider';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CipiaMultimediaParam, IntervalTime, MultimediaItem, SourceCipiaMultimedia, TypeCipiaMultimedia, VideoOnDemandTime } from 'src/app/multiview/models/interfaces';
import { MultimediaService } from 'src/app/multiview/services/multimedia.service';

@Component({
  selector: 'app-slider-multimedia',
  templateUrl: './slider-multimedia.component.html',
  styleUrls: ['./slider-multimedia.component.scss'],
  providers: [Slider]
})
export class SliderMultimediaComponent implements OnInit {

  @Input() event: any;
  @Input() driver: string = '';
  @Input() showFooter = false;
  @Input() showMultimediaFirst = true;
  @Input() showMultimedias = false;
  @Input() hasMultimedia = false;
  @Input() showTitle = true;

  sliderContent!: HTMLElement;

  loading = false;
  error = false;

  menuMultimedia:MenuItem[] = [
    {
      label: 'Obtener video', 
      icon: 'pi pi-fw pi-sliders-h',
      command: async () => {
        await this.getVideoDialog();
      }
    },
    {
      label: 'Grabar video', 
      icon: 'pi pi-fw pi-video',
      command: () => {
        this.getRecordDialog()
      }
    }
  ];

  isMaximized = false;


  @ViewChild('multimedia_wrapper') multimediaWrapper!:ElementRef;
  @ViewChild('_slider') sliderComponent!:Slider;

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
      if (
        this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId] && 
        1 <= newValue && 
        newValue <= (this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId].length)
      ) {
          this._activeIndex = newValue;
      }
  }

  _activeIndex: number = 1;
  
  // -------- end  cipia multimedia
  private destroy$ = new Subject<void>();

  // ---- getvideo dialog
  showGetVideoDialog = false;
  showRecordVideoDialog = false;
  rangeValues: number[] = [20,80];
  recordTime: number = 30;
  min_range = 0;
  max_range = 0;
  gradientColor = "#c2c2c250";
  gradientMargin = "1rem";


  constructor(
    public multimediaService: MultimediaService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnDestroy() {
    //console.log("DESTRUYENDOOO");
    
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    //console.log("EVENT RENDERED======= ",this.event);
    if(this.showMultimediaFirst){
      this.showMultimedias = true;
    }else{
      this.showMultimedias = false;
    }

    if(this.multimediaService.isLoadedMultimediaCipia){
      this.checkCipiaMultimedia(this.event.parametros,this.event.imei);
      //console.log("MULTIMEDIAS RENDERED======= ",this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId]);
      if(this.showMultimediaFirst){
        this.loadMedia();
      }
    }else{
      this.multimediaService.completedMultimediaCipia.subscribe(()=>{
        this.checkCipiaMultimedia(this.event.parametros,this.event.imei);
        //console.log("MULTIMEDIAS RENDERED======= ",this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId]);
        if(this.showMultimediaFirst){
          this.loadMedia();
        }
      });
    }

    
    this.min_range = new Date(this.event.parametros.eventDateTime).getTime()-120000-(5*60*60*1000);
    this.max_range = new Date(this.event.parametros.eventDateTime).getTime()+120000-(5*60*60*1000);
    this.rangeValues = [new Date(this.event.parametros.eventDateTime).getTime()-15000-(5*60*60*1000),new Date(this.event.parametros.eventDateTime).getTime()+15000-(5*60*60*1000)]
    this.sliderContent = document.querySelector('.slider-content')! as HTMLElement; 

  }

  checkCipiaMultimedia(params: any, imei:string){
    if (!this.multimediaService.multimediaCipiaItems.hasOwnProperty(params["eventId"])) {
      this.multimediaService.initializeNewMultimediaCipiaItem(params["eventId"]);
    }else{
      //console.log("params: ",params);
      console.log("this.multimediaService.multimediaCipiaItems: ",this.multimediaService.multimediaCipiaItems);
      //console.log("event: ",this.event);
      return;
    }
    //console.log("params: ",params);
    //console.log("this.multimediaService.multimediaCipiaItems: ",this.multimediaService.multimediaCipiaItems);
    //console.log("event: ",this.event);
    
    if(params["gps"] && params["gps"]=="cipia" && (params["has_video"]=="1" || params["has_image"] == "1")){
      this.hasMultimedia = true
      if(params["has_image"]=="1"){
        if(params["cabin_image"] == "1"){
          this.multimediaService.addMultimediaCipiaItem(params["eventId"],
            {
              type:'image',
              params:{
                imei:imei,
                eventId:params["eventId"],
                type:"image",
                source:"CABIN"
              }, 
              description: 'Hora: '+moment(params["eventDateTime"], 'YYYY/MM/DD HH:mm:ss').subtract(5,'hours').format('YYYY/MM/DD HH:mm:ss'), 
              url:"",
              blobId:"",
              interval: this.multimediaService.getInterval(params["eventDateTime"], 0, 0, 'event')
            }
          )
        }
        if(params["road_image"] == "1"){
          this.multimediaService.addMultimediaCipiaItem(params["eventId"],
            {
              type:'image',
              params:{
                imei:imei,
                eventId:params["eventId"],
                type:"image",
                source:"ROAD"
              }, 
              description: 'Hora: '+moment(params["eventDateTime"], 'YYYY/MM/DD HH:mm:ss').subtract(5,'hours').format('YYYY/MM/DD HH:mm:ss'), 
              url:"",
              blobId:"",
              interval: this.multimediaService.getInterval(params["eventDateTime"], -7, 3, 'event')
            }
          )
        }
      }
      if(params["has_video"]=="1"){
        if(params["cabin_video"] == "1"){
          this.multimediaService.addMultimediaCipiaItem(params["eventId"],
            {
              type:'video',
              params: {
                imei:imei,
                eventId:params["eventId"],
                type:"video",
                source:"CABIN"
              }, 
              description: 'Desde: '+ moment(params["eventDateTime"], 'YYYY/MM/DD HH:mm:ss').subtract(7, 'seconds').subtract(5,'hours').format('YYYY/MM/DD HH:mm:ss') 
                          +'  hasta: '+moment(params["eventDateTime"], 'YYYY/MM/DD HH:mm:ss').add(3,'seconds').subtract(5,'hours').format('YYYY/MM/DD HH:mm:ss'), 
              url:"",
              blobId:"",
              interval: this.multimediaService.getInterval(params["eventDateTime"], -7, 3, 'event')
            }
          )
        }
        if(params["road_video"] == "1"){
          this.multimediaService.addMultimediaCipiaItem(params["eventId"],
            {
              type:'video',
              params: {
                imei:imei,
                eventId:params["eventId"],
                type:"video",
                source:"ROAD"
              }, 
              description: 'Desde: '+ moment(params["eventDateTime"], 'YYYY/MM/DD HH:mm:ss').subtract(7, 'seconds').subtract(5,'hours').format('YYYY/MM/DD HH:mm:ss') 
                          +'  hasta: '+moment(params["eventDateTime"], 'YYYY/MM/DD HH:mm:ss').add(3,'seconds').subtract(5,'hours').format('YYYY/MM/DD HH:mm:ss'), 
              url:"",
              blobId:"",
              interval: this.multimediaService.getInterval(params["eventDateTime"], -7, 3, 'event')
            }
          )
        }
      }
    }
  }

  
  prev(){
    if(!this.loading){
      this.activeIndex++;
      //console.log(this.multimediaWrapper.nativeElement);
      this.loadMedia();
    }
  }

  next(){
    if(!this.loading){
      this.activeIndex--;
      //console.log(this.multimediaWrapper.nativeElement);
      this.loadMedia();
    }
  }

  async loadMedia():Promise<void>{
    this.error = false;
    this.loading = true;
    this.multimediaService.loadMediaFromMultimediaItem(this.activeIndex-1, this.event.parametros.eventId, this.destroy$).catch(()=>{
      this.error = true;
    }).finally(()=>{
      this.loading = false;
    });
  }

  changeShowMultimedia(){
    this.showMultimedias = !this.showMultimedias;
    if(this.showMultimedias){
      this.loadMedia();
    }
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    this.updateMaximizeState();
  }

  updateMaximizeState() {
    if (this.sliderContent) {
      if (this.isMaximized) {
        // Maximizar
        this.sliderContent.classList.add('maximized');
      } else {
        // Minimizar
        this.sliderContent.classList.remove('maximized');
      }
    }
  }

  async getVideoDialog() {
    this.showGetVideoDialog = !this.showGetVideoDialog;
    await this.updateSliderBackground();
    this.cdRef.detectChanges();
  }

  async getRecordDialog() {
    this.showRecordVideoDialog = !this.showRecordVideoDialog;
  }

  getMultimediaByRange(rangeValues: number[]){
    //console.log("rangeValues[0]: ", new Date(rangeValues[0]));
    //console.log("rangeValues[1]: ", new Date(rangeValues[1]));
    //console.log("nro seconds: ", (rangeValues[1]-rangeValues[0])/1000);
    const seconds = (rangeValues[1]-rangeValues[0])/1000;
    let params:CipiaMultimediaParam = {
      imei: this.event.imei,
      type: 'video',
      seconds: seconds,
      from: moment(new Date(rangeValues[0]), 'YYYY/MM/DD HH:mm:ss').add(5,'hours').format('YYYY/MM/DD HH:mm:ss'),
      source: 'CABIN',
      eventId: this.event.parametros.eventId,
    };
    this.multimediaService.getVideoOnDemand('demand', params);
    this.showGetVideoDialog = false;
  }

  getMultimediaRecording(recordTime: number){
    let params:CipiaMultimediaParam = {
      imei: this.event.imei,
      type: 'video',
      seconds: recordTime,
      from: moment(new Date(), 'YYYY/MM/DD HH:mm:ss').add(1, 'second').add(5,'hours').format('YYYY/MM/DD HH:mm:ss'),
      source: 'CABIN',
      eventId: this.event.parametros.eventId,
    };
    this.multimediaService.getVideoOnDemand('now', params);
    this.showRecordVideoDialog = false;
  }

  async updateSliderBackground(): Promise<void>{
    let auxGradientColor = '';
    let intervals = [];
    for (const multimedia of this.multimediaService.multimediaCipiaItems[this.event.parametros.eventId]){
      if(multimedia.type == "video"){
        intervals.push(multimedia.interval);
        //intervals.push(new Date(multimedia.interval!.start).getTime());
        //intervals.push(new Date(multimedia.interval!.end!).getTime());
      }
    }
    //console.log("this.min_range: ", this.min_range);
    //console.log("this.max_range: ", this.max_range);
    //console.log("intervals: ",intervals);
    const percents = [];
    for (const interval of intervals){
      percents.push(
        {
          start: ((new Date(interval!.start).getTime() - this.min_range)/(this.max_range - this.min_range)*100).toFixed(1),
          end: ((new Date(interval!.end!).getTime() - this.min_range)/(this.max_range - this.min_range)*100).toFixed(1),
          color: interval!.type! == "event" ? 'var(--gl-vivid-red-alpha)': (interval!.type! == "retrieve" ? 'var(--gl-enable-green-alfa)': 'var(--gl-blue-electric-alpha)'),
          type: interval!.type
        }
      )
    }

    //console.log("percents: ",percents);

    percents.sort((a, b) => {
          // Primero, ordenar por 'tipo' en el orden deseado
      const types = ['event', 'recording', 'retrieve'];
      const indexA = types.indexOf(a.type!);
      const indexB = types.indexOf(b.type!);
      
      if (indexA < indexB) return -1;
      if (indexA > indexB) return 1;

      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;

      return 0; 
    });
    for (let i = 0; i < percents.length; i++) {
      auxGradientColor += `linear-gradient(to right, transparent 0% ${percents[i].start}%, ${percents[i].color +' '+ percents[i].start}% ${percents[i].end}%, transparent ${percents[i].end}% 100% )` + (i+1 < percents.length? ', ':'');
      // const percent = percents[i];
      // if(isStartInterval){
      //   auxGradientColor += 'linear-gradient(to right, #f3f6f4 0%, #f3f6f4 '+ percent.start + '%, transparent 0%)';
      //   isStartInterval = false;
      // }
      // const transparent = (i+1 < percents.length) ? (parseFloat(percents[i+1].start) - parseFloat(percent.end)) : 0;
      // const isIncluded = (i+1 < percents.length) ? (parseFloat(percents[i+1].end) <= parseFloat(percent.end)) : false;
      // if(transparent < 0){
      //   // si el subsiguiente inicio es menor que el final de este intervalo, significa que hay un traslap
      //   if(isIncluded){
      //     // Ese traslape podria abarcar todo el intervalo subsiguiente, por tanto se debe tomar precaicion
      //     auxGradientColor += `,linear-gradient(to right, ${percent.color +' '+ percent.start}%, ${percent.color +' '+ percents[i+1].start}%, transparent 0% )`;
      //     auxGradientColor += `,linear-gradient(to right, ${percent.color +' '+ percents[i+1].end}%, ${percent.color +' '+ percent.end}%, transparent 0% )`;
      //   }else{
      //     auxGradientColor += `,linear-gradient(to right, ${percent.color +' '+ percent.start}%, ${percent.color +' '+ percents[i+1].start}%, transparent ${parseFloat(percents[i+1].start)+ Math.abs(transparent)}% )`;
      //   }
      // }else{
      //   //si no hay traslape, solo pongo el color y añado un gris adicionalmente
      //   auxGradientColor += `,linear-gradient(to right, ${percent.color +' '+ percent.start}%, ${percent.color +' '+ percent.end}%, transparent 0% )`;
      //   //añado un gris, si no hay un subiguiente elemento, coloreo hasta el 100% sino solo hasta el inicio del subsiguiente.
      //   auxGradientColor += `,linear-gradient(to right, #f3f6f4 ${percent.end}%, #f3f6f4 ${i+1 < percents.length? percents[i+1].start : '100'}%, transparent 0%)`;
      // }
    }
    this.gradientColor = auxGradientColor;
    this.cdRef.detectChanges();
    Promise.resolve();
  }

  addMinMaxTime(seconds: number){
    if(seconds<0){
      this.min_range += (seconds*1000);
    }else{
      this.max_range += (seconds*1000); // ME QUEDE ACA
    }
    this.updateSliderBackground();
    this.sliderComponent.writeValue(this.rangeValues);
  }
}
