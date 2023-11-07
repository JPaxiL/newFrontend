import { Component, OnInit } from '@angular/core';

import { HistorialService } from '../../services/historial.service';
import { MapServicesService } from '../../../map/services/map-services.service';

import { } from "primeng-lts/steps";
import { TooltipModule } from 'primeng-lts/tooltip';

import {SliderModule} from 'primeng-lts/slider';
import {InputTextModule} from 'primeng-lts/inputtext';

import * as L from 'leaflet';

declare var $: any;

@Component({
  selector: 'app-panel-historial-recorrido-modal',
  templateUrl: './panel-historial-recorrido-modal.component.html',
  styleUrls: ['./panel-historial-recorrido-modal.component.scss']
})
export class PanelHistorialRecorridoModalComponent implements OnInit {

  //value = 100;


  sliderValue:any=0;
  sliderValueMax:any; //1000
  sliderValueReferencia:any;

  sliderValueFecha:any;
  sliderValueVelocidad:any;
  sliderValueImgUrl:any="";
  sliderValueImgUrl2:any="";



  sliderDataImg:any= {
              lat1:0,
              lng1:0,
              lat2:0,
              lng2:0,
              distancia:0,
            }


  sliderValueDistanciaImg:any;

  sliderPlayActivo = false;


  urlGS = "https://www.google.com/";

  HM:any;  // historial que aparecera en el modal


  availableOpcionVelocidadGraficoModalSlider = [
    // {id : '0' , name: 'select'},
    {id : '1' , name: 'x1'},
    {id : '2' , name: 'x2'},
    {id : '3' , name: 'x3'},
    {id : '4' , name: 'x4'},
    {id : '5' , name: 'x5'},
    {id : '6' , name: 'x6'}
  ];

  opcionVelocidadGraficoModalSlider = '1';

  temporizadorModal : any;
  temporizadorModalReferencia : any;


  icoGclick = L.marker([0, 0],
    { icon: L.icon({
        iconUrl: 'assets/images/mm_20_red.png',
        iconAnchor: [6, 20]
    }),
    //clickable: true
  }).bindPopup( '', {offset: new L.Point(0, -16)} );



  icoGplay = L.marker([0, 0],
    { icon: L.icon({
        iconUrl: 'assets/images/objects/nuevo/4.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    }),
    //clickable: true
  }).bindPopup( '', {offset: new L.Point(0, -16)} );


  constructor(
    public historialService: HistorialService,
    public mapService: MapServicesService,
  ) { }


  ngOnInit(): void {

    console.log("======= ngOnInit ========");
    console.log(this.historialService.arrayRecorridos);
    console.log(this.historialService);
    console.log(this.historialService.keyGrafico);

    for (let i = 0; i < this.historialService.arrayRecorridos.length; i++) {

        if (this.historialService.arrayRecorridos[i].key == this.historialService.keyGrafico) {
            console.log("indice ==");
            console.log(i);
            this.HM = this.historialService.arrayRecorridos[i];
            console.log(this.HM);
            
            this.sliderValueMax = this.HM.recorrido.length - 1; 
        }
      
    }

    var item = this.HM.recorrido[0];
    this.sliderValueFecha = item.dt_tracker;
    this.sliderValueVelocidad = item.speed;
    this.getReference(item);
    this.getStreetViewImg(item);

    this.urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+item.lat+","+item.lng+"&cbp=0,"+item.angle+",0,0,0";
    //http://maps.google.com/maps?q=&layer=c&cbll=31.335198,-89.287204&cbp=11,0,0,0,0
    

  }



  onChangeSlider() {
    // console.log(this.sliderValueMax);
    // console.log(this.sliderValue);
    // console.log(this.HM.recorrido[this.sliderValue]);
    this.sliderValueFecha = this.HM.recorrido[this.sliderValue].dt_tracker;
    this.sliderValueVelocidad = this.HM.recorrido[this.sliderValue].speed;
  }

  //click en alguna parte de la linea
  onSlideEndSlider() {
    console.log("========================= onSlideEndSlider");
    // console.log(this.sliderValue);
    //this.ogChangeReferences();

    // var dH =  this.HM.recorrido; //this.historialService.tramasHistorial; // Data Historial
    // var ppos = this.sliderValue;
    var item = this.HM.recorrido[ this.sliderValue ];

    //this.urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+dH[ppos].lat+","+dH[ppos].lng;
    this.urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+item.lat+","+item.lng+"&cbp=0,"+item.angle+",0,0,0";


    console.log(this.urlGS  );

  }

  //Obtener referencia e imagen
  ogChangeReferences() {
    console.log("----- ogChangeReferences get referencia y fotos");
    this.getReference(this.HM.recorrido[this.sliderValue]);
    this.getStreetViewImg(this.HM.recorrido[this.sliderValue]);
  }

  async getReference(trama:any) {
    let reference = await this.historialService.getReference(trama.lat, trama.lng);
    var referencia = reference.referencia;
    //console.log(referencia);
    this.sliderValueReferencia = referencia;
    //return referencia;
    
  }

  async getStreetViewImg(trama:any) {
      let imgUrl: any = await this.historialService.getStreetViewImg(trama.lat, trama.lng);
      //var referencia = reference.referencia;
      //console.log(imgUrl);
      if (imgUrl == false) {
      } else {
        if (this.sliderValueImgUrl == imgUrl[0]) {
            console.log("TRAE LA MISMA IMAGEN : NEXT");
        } else {
            console.log("CARGA NUEVA IMAGEN");
            this.sliderValueImgUrl  = imgUrl[0];
            this.sliderValueImgUrl2 = imgUrl[1];
        }
        this.sliderDataImg = imgUrl[2];
        this.sliderValueDistanciaImg = "("+ this.sliderDataImg.distancia.toFixed(3) + "km.)";
        this.sliderValueReferencia = this.sliderValueReferencia;
        // "2020/8/31/th/2969018_636fff98d1e585bce8b9d76d85b0d9e2.jpg"
        //return referencia;
      }
  }

  onImgError(event:any){
    // onError="sliderValueImgUrl=sliderValueImgUrl2"
    event.target.src = this.sliderValueImgUrl2;
    event.onerror = null
  }

  changeOpcionVelocidadGraficoModalSlider() {
    console.log("===== changeOpcionVelocidadGraficoModalSlider : "+this.opcionVelocidadGraficoModalSlider);
    //console.log(this.opcionVelocidadGraficoModalSlider);
  }

  zoomImg() {
    this.sliderValueImgUrl = this.sliderValueImgUrl2;
  }

  modalhistorialPlay() {

    console.log("===============  modalhistorialPlay ");

    // if (this.sliderPlayActivo == false) {
    //     this.temporizadorModalReferencia = setInterval(() => {
    //         console.log("===============  cada 5 segundos ?????  ");
    //         this.ogChangeReferences();
    //     }, 5000);
    // }

    // $("#btnPlayModalSlider").click(() => {
    //   //this.consolahistorialPlay();
    // });
    var dH =  this.HM.recorrido; //this.historialService.tramasHistorial; // Data Historial

    clearTimeout(this.temporizadorModal);

    if ((dH.length > 0) && (this.sliderValue < dH.length - 1)) {

      this.sliderValue++;
      //var ppos = this.sliderValue;

      var item = dH[ this.sliderValue ];
      this.icoGplay.setLatLng([item.lat, item.lng]).addTo(this.mapService.map);
      this.icoGplay.setPopupContent( this.getContentSimulacionRecorrido( item) );
      this.icoGplay.openPopup();
      this.mapService.map.setView([item.lat, item.lng],13);

      //this.urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+dH[ppos].lat+","+dH[ppos].lng;
      this.urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+item.lat+","+item.lng+"&cbp=0,"+item.angle+",0,0,0";
      console.log(this.urlGS  );


      // var vG = $("#opcionVelocidadGraficoConsola").val();
      var vG = this.opcionVelocidadGraficoModalSlider;
      if (vG == '1') {
        this.temporizadorModal = setTimeout(() => {
          this.modalhistorialPlay();
          }, 3333);
      } else if (vG == '2') {
        this.temporizadorModal = setTimeout(() => {
          this.modalhistorialPlay();
          }, 2222);
      } else if (vG == '3') {
        this.temporizadorModal = setTimeout(() => {
          this.modalhistorialPlay();
          }, 1111);
      } else if (vG == '4') {
        this.temporizadorModal = setTimeout(() => {
          this.modalhistorialPlay();
          }, 555);
      } else if (vG == '5') {
        this.temporizadorModal = setTimeout(() => {
          this.modalhistorialPlay();
          }, 222);
      } else if (vG == '6') {
        this.temporizadorModal = setTimeout(() => {
          this.modalhistorialPlay();
          }, 111);
      }
      this.onChangeSlider();
      this.sliderPlayActivo = true;

    } else {
          this.sliderPlayActivo = false;
          //console.log("-----FINAL-----");
          // $timeout.cancel(vm.cl.temporizadorConsola);
          clearTimeout(this.temporizadorModal);
          clearInterval(this.temporizadorModalReferencia)
          this.sliderValue = 0;
    }



  }

  modalhistorialStop() {
      console.log("=============================modalhistorialStop");
      // console.log(this.temporizadorModal);
      clearTimeout(this.temporizadorModal);
      clearInterval(this.temporizadorModalReferencia)
      this.sliderValue = 0;
      this.sliderPlayActivo = false;

      this.mapService.map.removeLayer(this.icoGplay);
  }

  modalhistorialPause() {
      console.log("=============================modalhistorialPause");
      // console.log(this.temporizadorModal);
      // clearTimeout(this.temporizadorModal);
      // clearInterval(this.temporizadorModalReferencia);
      // this.sliderPlayActivo = false;
      clearTimeout(this.temporizadorModal);
      clearInterval(this.temporizadorModalReferencia);
      this.sliderPlayActivo = false;
  }

  modalhistorialBtnLento() {
      console.log("=============================modalhistorialBtnLento");
      console.log(this.opcionVelocidadGraficoModalSlider);
      
      var vG = parseInt(this.opcionVelocidadGraficoModalSlider);
      if (vG > 1 && vG <= 6) {
        vG = vG - 1;
        this.opcionVelocidadGraficoModalSlider = vG.toString();
      }
      console.log(this.opcionVelocidadGraficoModalSlider);

  }

  modalhistorialBtnRapido() {
      console.log("=============================modalhistorialBtnRapido");
      console.log(this.opcionVelocidadGraficoModalSlider);

      var vG = parseInt(this.opcionVelocidadGraficoModalSlider);
      if (vG >= 1 && vG < 6) {
        vG = vG + 1;
        this.opcionVelocidadGraficoModalSlider = vG.toString();
      }
      console.log(this.opcionVelocidadGraficoModalSlider);

  }

  //btn para ubicar la posicion de la unidad en el mapa
  modalUbicar() {
    var item = this.HM.recorrido[this.sliderValue];
    this.icoGclick.setLatLng([item.lat, item.lng]).addTo(this.mapService.map);
    this.icoGclick.setPopupContent( this.getContentUbicar(item, this.HM.nombre ) );
    this.icoGclick.openPopup();

    this.mapService.map.setView([item.lat, item.lng]);
    this.urlGS = "http://maps.google.com/maps?q=&layer=c&cbll="+item.lat+","+item.lng+"&cbp=0,"+item.angle+",0,0,0";

  }

  //btn para ubicar la posicion de la imagen de referencia
  modalUbicar2() {
    var item = this.sliderDataImg;
    //console.log(item);
    this.sliderValueDistanciaImg = "("+ item.distancia.toFixed(3) + " km.)";
    //console.log(this.sliderValueDistanciaImg);
    
    this.icoGclick.setLatLng([item.lat2, item.lng2]).addTo(this.mapService.map);
    this.icoGclick.setPopupContent( this.getContentUbicar2(item, this.HM.nombre ) );
    this.icoGclick.openPopup();

    //this.mapService.map.setView([item.lat2, item.lng2],13);
    this.mapService.map.setView([item.lat2, item.lng2]);
  }


  getContentUbicar(item:any, nombre:any) {
    var xlat = parseFloat(item.lat).toFixed(6);
    var xlng = parseFloat(item.lng).toFixed(6);
    var xdt_tracker= item.dt_tracker.replace(/\//g, "-");
    return (
      `<table class="dl-horizontal">
        <tr><td>Objeto</td><td>: ${nombre}</td></tr>
     
        <tr><td>P.Cercano</td><td>: </td></tr>
        <tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q=${item.lat},${item.lng}&amp;t=m" target="_blank">${xlat}°,${xlng}°</a></td></tr>
        <tr><td>Altitud</td><td>: ${item.altitude} m</td></tr>
        <tr><td>Angulo</td><td>: ${item.angle}&#160;&#176;</td></tr>
        <tr><td>Velocidad</td><td>: ${item.speed} km/h</td></tr>
        <tr><td>Tiempo</td><td>: ${xdt_tracker} </td></tr>
      </table>`
    );
  }
  

  getContentUbicar2(item:any, nombre:any) {
    var xlat = parseFloat(item.lat2).toFixed(6);
    var xlng = parseFloat(item.lng2).toFixed(6);
    return (
      `<table class="dl-horizontal">
        <tr><td colspan="2">Imagen de Referencia:</td></tr>
        <tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q=${item.lat2},${item.lng2}&amp;t=m" target="_blank">${xlat}°,${xlng}°</a></td></tr>
      </table>`
    );
  }
  


  getContentSimulacionRecorrido(item:any) {
    var xdt_tracker= item.dt_tracker.replace(/\//g, "-");
    return (
      `<table class="dl-horizontal">
        <tr><td><b> ${ xdt_tracker } </b></td><td> &#160;(${item.speed} km/h)</td></tr>
      </table>`
    );
  }



  //$address = $this->getAddress($request->latitud, $request->longitud);
}

