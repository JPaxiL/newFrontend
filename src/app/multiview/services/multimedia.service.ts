import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  constructor() { }

  private mediaStream:any;
  private canvasStream:any;
  private audioStream:any;
  private recorder:any;
  private _mediaStream = new Subject<any>();
  private _blob = new Subject<any>();
  private _stateChange = new Subject<any>();
  public blob: any;

  private canvas: HTMLCanvasElement | null = null;
  private canvas2d: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private captureInterval: any;
  public isRecording = false;
  /* [****]
  private async updateCanvas(element:any) {
    if (!element || !this.ctx || !this.canvas) {
      console.log("nose");
      
      return;
    }

    const width = element.clientWidth;
    const height = element.clientHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    // Capturar el contenido del contenedor como una imagen usando html2canvas
    const containerImage = await html2canvas(element);

    // Dibujar la imagen en el canvas
    this.ctx.drawImage(containerImage, 0, 0, width, height);

    // Solicitar el siguiente cuadro de animación
    requestAnimationFrame(() => this.updateCanvas(element));
  }*/
  getMediaStream(){
    return this._mediaStream.asObservable();
  }
  getBlob(){
    return this._blob.asObservable();
  }

  getStateChanges(){
    return this._stateChange.asObservable();
  }

  async startRecording(element:HTMLElement){
    try {

      this.canvas2d = document.createElement('canvas')!; // OUR OWN invisible CANVAS
      this.ctx = this.canvas2d.getContext('2d')!;
      this.canvas2d.width = element.clientWidth;
      this.canvas2d.height = element.clientHeight;
      //this.canvas2d.className = "d-none";
      (document.body || document.documentElement).appendChild(this.canvas2d);

      this.captureInterval = setInterval( async () => {
        console.log("holaaaa");
        
        if (this.recorder && this.recorder.getBlob() && this.recorder.getBlob().size) {
          // this line checks whether recorder is stopped
          return;
        }

        // looper keeps calling this method until recording stops
        const canvasresult = await html2canvas(element,{
          useCORS: true
        });
        this.ctx!.clearRect(0, 0, this.canvas2d!.width, this.canvas2d!.height);

        // draw html2canvas resulting canvas on our own canvas
        this.ctx!.drawImage(canvasresult, 0, 0, this.canvas2d!.width, this.canvas2d!.height);
        // Dibuja la marca de tiempo en el canvas
        const currentTime = new Date().toLocaleString();
        this.ctx!.fillStyle = 'black';
        this.ctx!.shadowColor = 'white';
        this.ctx!.shadowBlur = 10;
        this.ctx!.font = '24px Arial';
        const x = 20 // Centrado horizontal
        const y = this.canvas2d!.height - 20; // Parte inferior
        this.ctx!.fillText(currentTime, x, y);
      }, 1000);
      //requestAnimationFrame(() => {});

      // Obtener el audioStream
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Obtener el audioStream",element);
      //const canvas = await html2canvas(element)
      console.log("html2canvas.default(element);");
  
      // Capturar el stream del canvas
      // @ts-ignore
      this.canvasStream = this.canvas2d.captureStream();
      console.log("Capturar el stream del canvas");
  
      // Crear una nueva MediaStream para combinar las pistas de audio y video
      this.mediaStream = new MediaStream();
      console.log("Crear una nueva MediaStream para combinar las pistas de audio y video");
  
      // Obtener y agregar las pistas de audio a finalStream
      const audioTracks = this.audioStream.getAudioTracks();
      audioTracks.forEach((track:any) => {
        this.mediaStream.addTrack(track);
        console.log("add audiotrack en el stream del canvas");
      });
  
      // Obtener y agregar las pistas de video a finalStream
      const videoTracks = this.canvasStream.getVideoTracks();
      videoTracks.forEach((track:any) => {
        this.mediaStream.addTrack(track);
        console.log("add videorack en el stream del canvas");
      });
  
      // Iniciar la grabación con RecordRTC
      this._mediaStream.next(this.mediaStream);
      console.log("enviar por observable");

      this.recorder = new RecordRTC(this.mediaStream, {
        type: 'video',
      });
      console.log("instanciar recorder");
  
      await this.recorder.startRecording();
      this.isRecording = true;
      console.log("iniciar grabacion recorder");
    } catch (error) {
      this.isRecording = false;
      console.error('Error al iniciar la grabación:', error);
    }
  }

  async handleRecording(){
    // @ts-ignore
    this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    });
    this._mediaStream.next(this.mediaStream);
    this.recorder = new RecordRTC(this.mediaStream, { type: 'video'});
    this.recorder.onStateChanged = function(state:any) {
      console.log("STATEEE: ",state);
      
      this._stateChange.next(state);
    };
    await this.recorder.startRecording();
  }

  async stopRecording(){
    if (this.captureInterval) {
      clearTimeout(this.captureInterval);
    }
    console.log("STARTING STOP RECORDING-------1");
    console.log(this.recorder);
    
    if(!this.recorder){
      console.log("STARTING STOP RECORDING-------2");
      return;

    }
    console.log("STARTING STOP RECORDING-------3");
    
    await this.recorder.stopRecording(() => {
      this.blob = this.recorder.getBlob();
      this._blob.next(URL.createObjectURL(this.blob));
      this.canvas2d!.remove();
      this.mediaStream.stop();
      console.log("mediastream.stop");
      this.audioStream.stop();
      console.log("audiotream.stop");
      this.canvasStream.stop();
      console.log("canvasstream.stop");
      this.recorder.destroy();
    });
  }

  downloadRecording(){
    RecordRTC.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`)
  }

  clearRecording(){
    this.blob = null;
    this.canvas!.remove();
    this.recorder = null;
    this.mediaStream = null;
    this.audioStream = null;
    this.canvasStream = null;
  }

  async screenShot(element:HTMLElement) {
    this.canvas2d = document.createElement('canvas')!; // OUR OWN invisible CANVAS
    this.ctx = this.canvas2d.getContext('2d')!;
    this.canvas2d.width = element.clientWidth;
    this.canvas2d.height = element.clientHeight;
    this.canvas2d.className = "d-none";
    (document.body || document.documentElement).appendChild(this.canvas2d);

    const img = await html2canvas(element,{
      allowTaint: true
    });
    // Toma la captura del canvas como una imagen PNG
    
    this.ctx!.clearRect(0, 0, this.canvas2d!.width, this.canvas2d!.height);
    
    // draw html2canvas resulting canvas on our own canvas
    this.ctx!.drawImage(img, 0, 0, this.canvas2d!.width, this.canvas2d!.height);
    
    // Dibuja la marca de tiempo en el canvas
    const currentTime = new Date().toLocaleString();
    this.ctx.fillStyle = 'black';
    this.ctx.shadowColor = 'white';
    this.ctx.shadowBlur = 10;
    this.ctx.font = '24px Arial';
    const x = 20 // Centrado horizontal
    const y = this.canvas2d.height - 20; // Parte inferior
    this.ctx.fillText(currentTime, x, y);
    // Crea un elemento de enlace
    const dataURL = this.canvas2d.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${Date.now()}.png`; // Nombre del archivo a descargar
    // Simula un clic en el enlace para iniciar la descarga
    a.click();
    this.canvas2d!.remove();
  }
}
