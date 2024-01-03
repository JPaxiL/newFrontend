import { EventEmitter, Injectable, Output } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import html2canvas from 'html2canvas';
import { from, Observable, Subject, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, filter, map, mergeMap, take, timeout } from 'rxjs/operators';
import { CipiaMultimediaParam } from '../models/interfaces';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { SocketWebService } from 'src/app/vehicles/services/socket-web.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  constructor(private http: HttpClient, private wsService:SocketWebService) { }

  private mediaStream:any;
  private canvasStream:any;
  private audioStream:any;
  private recorder:any;
  private _mediaStream = new Subject<any>();
  private _blob = new Subject<any>();
  private _stateChange = new Subject<any>();
  //@Output() onStop: EventEmitter<boolean> = new EventEmitter<boolean>();
  public blob: any;

  private canvas: HTMLCanvasElement | null = null;
  private canvas2d: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private captureInterval: any;
  public isRecording = false;
  getMediaStream(){
    return this._mediaStream.asObservable();
  }
  getBlob(){
    return this._blob.asObservable();
  }

  getStateChanges(){
    return this._stateChange.asObservable();
  }

  async startRecordingWindow(){
    await this.handleRecording();
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
        if (this.recorder && this.recorder.getBlob() && this.recorder.getBlob().size) {
          // this line checks whether recorder is stopped
          return;
        }
        // looper keeps calling this method until recording stops
        const canvasresult = await html2canvas(element,{
          useCORS: true,
          allowTaint: true
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
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
      // @ts-ignore
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true
      });
      this.mediaStream = new MediaStream([...this.mediaStream.getTracks(), ...this.audioStream.getTracks()])
      this._mediaStream.next(this.mediaStream);
      this.recorder = new RecordRTC(this.mediaStream, { type: 'video'});
      this.recorder.onStateChanged = function(state:any) {
        console.log("STATEEE: ",state);
        this._stateChange.next(state);
      };
      await this.recorder.startRecording();
      this.isRecording = true;
    } catch (error) {
      this.isRecording = false;
    }
  }

  async stopRecording(){
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
    }
    console.log("STARTING STOP RECORDING-------1");
    console.log(this.recorder);
    
    if(!this.recorder){
      console.log("STARTING STOP RECORDING-------2");
      return;

    }
    console.log("STARTING STOP RECORDING-------3");
    
    await this.recorder.stopRecording(() => {
      this.isRecording = false;
      this.blob = this.recorder.getBlob();
      this._blob.next(URL.createObjectURL(this.blob));
      if(this.canvas2d){
        this.canvas2d!.remove();
      }
      this.mediaStream.getTracks().forEach((track:any) => track.stop());
      console.log("mediastream.stop");
      this.audioStream.getTracks().forEach((track:any) => track.stop());
      console.log("audiotream.stop");
      if(this.canvasStream){
        this.canvasStream.getTracks().forEach((track:any) => track.stop());
        console.log("canvasstream.stop");
      }
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
    this.isRecording = false;
  }

  async screenShot(element:HTMLElement) {
    this.canvas2d = document.createElement('canvas')!; // OUR OWN invisible CANVAS
    this.ctx = this.canvas2d.getContext('2d')!;
    this.canvas2d.width = element.clientWidth;
    this.canvas2d.height = element.clientHeight;
    this.canvas2d.className = "d-none";
    (document.body || document.documentElement).appendChild(this.canvas2d);

    const img = await html2canvas(element,{
      removeContainer: false,
      useCORS: true,
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

  getMediaFromEvent(imei: string, eventId: string, type: string = "video", source: string = "CABIN", index: number = 0, time_before_call = 0, maxRetries = 2, retryInterval = 5000): Observable<any> {
    return timer(time_before_call * 500).pipe(
      mergeMap(() => {
        return this.tryGetMedia(imei, eventId, type, source, index, maxRetries, retryInterval);
      }),
      catchError((e) => {
        console.log("ERRORRRSS: ",e);
        
        if(e.status == 403){
          Swal.fire("Error","El dispositivo no existe",'warning');
        }
        else if(e.status == 500){
          Swal.fire("Error","No se pudo conectar al servidor",'warning');
        }
        else if(e.status == 401){
          Swal.fire("Error","No tienes permisos suficientes",'warning');
        }
        else if(e.status == 422){
          Swal.fire("Error","Parámetros incorrectos",'warning');
        }
        else if(e.status == 408){
          Swal.fire("Error","El dispositivo no se encuentra disponible",'warning');
        }else{
          Swal.fire("Error","El archivo aun no se encuentra disponible",'warning');
        }
        return throwError(e);
      })
    );
  }

  private tryGetMedia(imei: string, eventId: string, type: string, source: string, index: number, maxRetries: number, retryInterval: number): Observable<any> {
    const endpoint = environment.apiUrl + '/api/media/' + type + '/' + imei + '/' + eventId + '/' + source + '/' + parseInt(index.toString());
  
    return this.http.get(endpoint, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)),
      catchError((e) => {
        if(e.status != 404){
          return throwError(e);
        }
        if (maxRetries > 0) {
          maxRetries -= 1;
          // Reintentar después de un intervalo de tiempo
          return timer(retryInterval).pipe(
            mergeMap(() => this.tryGetMedia(imei, eventId, type, source, index, maxRetries, retryInterval))
          );
        } else {
          return throwError(e);
        }
      })
    );
  }


  retrieveVideoFrom(mediaRequest: CipiaMultimediaParam): Observable<any> {
    return new Observable((observer) => {
      if(mediaRequest.seconds!>60 || mediaRequest.seconds!<10){
        Swal.fire('Error', 'La duración del video debe estar entre 10 y 60 segundos.', 'error');
        observer.complete();
      }
      const endpoint = environment.apiUrl + '/api/media/retrieve';

      const frameSubscriptionSocket = this.wsService.callback.pipe(
        filter(frame => {
          console.log("frame",frame);
          return mediaRequest.imei === frame.IMEI.toString() && frame.Parametros.includes("ExternalEvent")
        }),
        mergeMap(frame => {
          console.log("frame",frame);
          const objParams: any = {};
          frame.Parametros.split('|').forEach((item:string) => {
            const [key, value] = item.split('=');
            objParams[key] = value;
          });
          frame.Parametros = objParams;
          return from([frame]);
          //return this.getMediaFromEvent(mediaRequest.imei, frame.Parametros.eventId, "video", mediaRequest.source, 0, mediaRequest.seconds!<31?15:30);
        }),
        take(1), // Solo toma la primera URL válida y completa la suscripción
        timeout(mediaRequest.seconds! * 1000)
      );
      // Aplicar timeout al Observable
      const frameSubscription = frameSubscriptionSocket.subscribe(
        frame => {
          observer.next(frame);
          observer.complete();
        },
        error => {
          if (error.name === 'TimeoutError') {
            console.error('Tiempo de espera agotado.');
            Swal.fire('Error', 'Tiempo de espera agotado.', 'error');
          } else {
            console.error('Error en obtener la trama:', error);
          }
          observer.next("");
          observer.complete();
        }
      );

      this.http.post<ResponseInterface>(endpoint, mediaRequest).subscribe(resp => {
          console.log("respuesta de retrieve: ", resp);
          if (!resp.success) {
            Swal.fire('Error', resp.message, 'error');
            frameSubscription.unsubscribe();
            observer.complete();
          }
        },
        error => {
          Swal.fire('Error', error.error.messages, 'error');
          console.error('Error al llamar al endpoint /api/media/retrieve:', error);
          frameSubscription.unsubscribe();
          observer.complete();
        }
      );
    });
  }

  recordVideo(mediaRequest: CipiaMultimediaParam): Observable<any> {
    return new Observable((observer) => {
      if(mediaRequest.seconds!>60 || mediaRequest.seconds!<10){
        Swal.fire('Error', 'La duración del video debe estar entre 10 y 60 segundos.', 'error');
        observer.complete();
      }
      // Only for video
      const endpoint = environment.apiUrl + '/api/media/record';
      // Si la solicitud fue exitosa, escucharemos las tramas que llegan esperando la que tenga el video/imagen solicitado
      const frameSubscriptionSocket = this.wsService.callback.pipe(
        filter(frame => {
          //console.log("frame",frame);
          return mediaRequest.imei === frame.IMEI.toString() && frame.Parametros.includes("ExternalEvent")
        }),
        mergeMap(frame => {
          console.log("frame",frame);
          const objParams: any = {};
          frame.Parametros.split('|').forEach((item:string) => {
            const [key, value] = item.split('=');
            objParams[key] = value;
          });
          frame.Parametros = objParams;
          return from([frame]);
          //return this.getMediaFromEvent(mediaRequest.imei, frame.Parametros.eventId, "video", mediaRequest.source, 0, mediaRequest.seconds!+10);
        }),
        take(1), // Solo toma la primera URL válida y completa la suscripción
        timeout(mediaRequest.seconds! * 2000)
      );
      // Aplicar timeout al Observable
      const frameSubscription = frameSubscriptionSocket.subscribe(
        frame => {
          observer.next(frame);
          observer.complete();
        },
        error => {
          if (error.name === 'TimeoutError') {
            console.error('Tiempo de espera agotado.');
            Swal.fire('Error', 'No se pudo grabar, tiempo de espera agotado.', 'error');
          } else {
            console.error('Error en obtener la trama:', error);
          }
          observer.next("");
          observer.complete();
        }
      );
      this.http.post<ResponseInterface>(endpoint, mediaRequest).subscribe(resp => {
          console.log("respuesta de record: ", resp);
          if (!resp.success) {
            Swal.fire('Error', resp.message, 'error');
            frameSubscription.unsubscribe();
            observer.complete();
          }
        },
        error => {
          Swal.fire('Error', error.error.messages, 'error');
          console.error('Error al llamar al endpoint /api/media/retrieve:', error);
          frameSubscription.unsubscribe();
          observer.complete();
        }
      );
    });
  }
}
