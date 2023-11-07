import { AfterViewInit, AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { GridItem } from '../models/interfaces';
import { MultimediaService } from '../services/multimedia.service';

@Component({
  selector: 'app-screen-recorder',
  templateUrl: './screen-recorder.component.html',
  styleUrls: ['./screen-recorder.component.scss']
})
export class ScreenRecorderComponent implements OnInit, AfterViewInit, AfterContentInit {
  
    @Input() display:boolean = false;
    @Input() type:string = "general";
    @Output() changeDisplay: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRecording: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() recordingElement!:HTMLElement;
    @Input() recordingElements : GridItem[] = [];

    selectedElement! : GridItem;
  
    @ViewChild('videoPreview') videoPreview!: ElementRef;
    video: any;
  
    seconds: number = 0;
    minutes: number = 0;
    hours: number = 0;
  
    interval:any;
  
    play = false;
    videoReady = false;
    videoBlobUrl: any = null;
    titleModal = "Previsualización";
    showPreview = false;
    downloaded = false;
    showReplaceDialog = false;

    timeoutRecorder:any = null;

  constructor(
    private multimediaService: MultimediaService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { 
    this.multimediaService.getMediaStream().subscribe(data => {
      this.video.srcObject = null;
      this.ref.detectChanges();
      console.log('data: ',data);
    });
    this.multimediaService.getBlob().subscribe(data => {
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
      this.video.srcObject = null;
      this.ref.detectChanges();
    });
    this.multimediaService.getStateChanges().subscribe(data => {
      console.log("ESTADOOOOO: ", data);
    });
  }
  onSelectElement(event:any){
    if(this.selectedElement){
      this.recordingElement = document.getElementById(this.selectedElement.label!)!;
    }else{
      this.recordingElement = document.getElementById('Todo')!;
    }
  }
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.video = this.videoPreview.nativeElement;
    console.log("this.recordingElement",this.recordingElement);
  }
  ngAfterContentInit(): void {
  }

  async playButton(){
    if(this.type == 'minimap' && !this.selectedElement){
      return;
    }
    if (this.play){
      if(!this.downloaded && this.videoReady){
        this.showPreview = false;
        this.play = false;
        this.showReplaceDialog = true;
        return;
      }
      if(this.type == "general"){
        await this.multimediaService.startRecordingWindow();
      }else{
        await this.multimediaService.startRecording(this.recordingElement);
      }
      if(this.multimediaService.isRecording){
        console.log("Yes, is reording");
        this.showReplaceDialog = false;
        this.showPreview = true;
        this.videoReady = false;
        this.showPreview = false;
        this.downloaded = false;
        console.log("this.recordingElement",this.recordingElement);
        
        this.startCronometer();
        this.onRecording.emit(true);
        if(this.type != "general"){
          this.timeoutRecorder = setTimeout(async () => {
            if(this.play && this.multimediaService.isRecording){
              this.stopCronometer()
              await this.multimediaService.stopRecording();
              console.log("stopped");
              
              this.showPreview = true;
              this.videoReady = true;
              this.onRecording.emit(false);
              this.play = false;
            }
          }, 30 * 1000);
        }
      }
    }else{
      if(this.timeoutRecorder){
        clearTimeout(this.timeoutRecorder);
      }
      this.stopCronometer()
      await this.multimediaService.stopRecording();
      console.log("stopped");
      
      this.showPreview = true;
      this.videoReady = true;
      this.onRecording.emit(false);
    }
  }

  close() {
    this.onClose.emit(true);
  }

  downloadLastVideo(){
    if(this.videoReady && !this.play){
      this.downloaded = true;
      this.multimediaService.downloadRecording();
      this.showReplaceDialog = false;
    }
  }
  clearRecorder(){
    this.clearCronometer();
    this.play = false;
    this.videoReady = false;
    this.stopCronometer();
    this.multimediaService.stopRecording();
    this.video.srcObject = null;
    this.videoBlobUrl = null;
    this.showPreview = false;
  }

  startCronometer(){
    this.clearCronometer();
    this.interval = setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
      }
      if(this.minutes === 60){
        this.minutes = 0;
        this.hours++;
      }
    }, 1000);
  }

  stopCronometer(){
    clearInterval(this.interval);
  }
  clearCronometer(){
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

}
