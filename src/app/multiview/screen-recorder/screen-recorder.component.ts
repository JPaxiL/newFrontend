import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { MultimediaService } from '../services/multimedia.service';

@Component({
  selector: 'app-screen-recorder',
  templateUrl: './screen-recorder.component.html',
  styleUrls: ['./screen-recorder.component.scss']
})
export class ScreenRecorderComponent implements OnInit, AfterViewInit {
  
    @Input() display:boolean = false;
    @Output() changeDisplay: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRecording: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() recordingElement!:HTMLElement;
  
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

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.video = this.videoPreview.nativeElement;
    console.log("this.recordingElement",this.recordingElement);
  }

  async playButton(){
    if (this.play){
      if(!this.downloaded && this.videoReady){
        this.showPreview = false;
        this.play = false;
        this.showReplaceDialog = true;
        return;
      }
      await this.multimediaService.startRecording(this.recordingElement);
      if(this.multimediaService.isRecording){
        console.log("Yes, is reording");
        this.showReplaceDialog = false;
        this.showPreview = true;
        this.videoReady = false;
        this.showPreview = false;
        this.downloaded = false;
        console.log("this.recordingElement",this.recordingElement);
        
        this.startCronometer();
        //lamar a fuincion de grabar
        this.onRecording.emit(true);
      }
    }else{
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
