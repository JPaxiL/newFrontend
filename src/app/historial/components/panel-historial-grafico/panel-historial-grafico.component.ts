import { Component, OnInit } from '@angular/core';

import { MapServicesService } from '../../../map/services/map-services.service';
import { HistorialService } from '../../services/historial.service';

import * as moment from 'moment';
import * as L from 'leaflet';

declare var $: any;
declare var $j: any;


@Component({
  selector: 'app-panel-historial-grafico',
  templateUrl: './panel-historial-grafico.component.html',
  styleUrls: ['./panel-historial-grafico.component.scss']
})
export class PanelHistorialGraficoComponent implements OnInit {


  options_grafico = {
    xaxis: {
        mode: "time",
        timezone: "browser",
        zoomRange: [30000, 30 * 86400000]
    },
    yaxis: {
        min: 0,
        zoomRange: false,
        tickFormatter: function (v:any, a:any) {
            var k = Math.round(v * 100) / 100;
            return k + " km/h"
        },
        panRange: false
    },
    selection: {
        mode: "x"
    },
    crosshair: {
        mode: "x"
    },
    lines: {
        show: true,
        lineWidth: 1,
        fill: true,
        fillColor: "rgba(74, 255, 73, 0.6)",
        steps: false
    },
    series: {
        lines: {
            show: true,
            fill: true
        },
        points: {
            show: false,
            radius: 1
        }
    },
    colors: ["#0B3E16"],
    grid: {
        hoverable: true,
        autoHighlight: true,
        clickable: true
    },
    zoom: {
        animate: true,
        trigger: "dblclick",
        amount: 3
    },
    pan: {
        interactive: false,
        animate: true
    }
  };

  plot_historial:any;




  message:string='';
  llamadas = 0;


  availableOpcionGraficoConsola = [
    // {id : '0' , name: 'select'},
    {id : '1' , name: 'Velocidad'},
    {id : '2' , name: 'Altitud'},
    {id : '3' , name: 'Motor'},
    {id : '4' , name: 'Combustible'}
  ];

  availableOpcionVelocidadGraficoConsola = [
    // {id : '0' , name: 'select'},
    {id : '1' , name: 'x1'},
    {id : '2' , name: 'x2'},
    {id : '3' , name: 'x3'},
    {id : '4' , name: 'x4'},
    {id : '5' , name: 'x5'},
    {id : '6' , name: 'x6'}
  ];

  availableOpcionTamanoConsola = [
    // {id : '0' , name: 'select'},
    {id : '1' , name: 'x1'},
    {id : '2' , name: 'x2'},
    {id : '3' , name: 'x3'},
  ];



  cl:any;

  opcionGraficoConsola = '1';
  opcionVelocidadGraficoConsola = '1';
  opcionTamanoConsola = '1';
  datosLegend = '.';

  tConsola = new Array();

  verTabla = false;

  idUnico = new Array(); // arrays de id que no se repiten

  icoGplay = L.marker([0, 0],
    { icon: L.icon({
        iconUrl: 'assets/images/objects/nuevo/4.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    }),
    //clickable: true
  }).bindPopup( '', {offset: new L.Point(0, -16)} );

  //icoGplay_popup = L.popup({offset: new L.Point(0, -16)});


  icoGclick = L.marker([0, 0],
    { icon: L.icon({
        iconUrl: 'assets/images/mm_20_red.png',
        iconAnchor: [6, 20]
    }),
    //clickable: true
  }).bindPopup( '', {offset: new L.Point(0, -16)} );

  // icoGclick_popup = L.popup({offset: new L.Point(0, -16)});




  constructor(public mapService: MapServicesService, public historialService: HistorialService) {

    // this.historialService.currentMessage.subscribe(message => this.message = message);
    // this.historialService.currentMessage.subscribe( () => {this.newMessage1();
    // });

    this.historialService.currentMessage.subscribe( () => {
      console.log('llamada = '+ this.llamadas);

      if (this.llamadas != 0) {
        this.cargarGrafico();
      } else {
        this.llamadas = 1;
      }

    });

  }


  ngOnInit(): void {
    // //console.log("pane grafico historial");
    // //console.log(this.historialService.conHistorial);

    // this.historialService.currentMessage.subscribe(message => this.message = message)


    // $.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
    // this.plot_historial = $.plot("#placeholder", [ [[0, 0], [1, 1]] ], this.options_grafico);


  }



  newMessage() {
    this.historialService.changeMessage("Hello from Second Component")
  }

  newMessage1(): void {
    //console.log(" com 2 newMessage1");
  }



  cargarGrafico(): void {

    console.log("GRAFICOOOOOOOO");

    console.log( this.historialService.keyGrafico);
    

    // jQuery.fn.jquery
    // jQuery().jquery
    // console.log(jQuery.fn.jquery);
    // console.log(jQuery().jquery);
    // console.log($().jquery);



    // console.log($().jquery); // This prints v1.4.2
    // console.log($j().jquery); // This prints v1.9.1

    var rdH = this.historialService.arrayRecorridos;

    for (let i = 0; i < rdH.length; i++) {
        console.log(rdH[i].key+"  -  -  "+this.historialService.keyGrafico);
        if ( rdH[i].key == this.historialService.keyGrafico ) {
          var dH = rdH[i].recorrido;
        }

    }
    console.log("================== HISTORIAL ENCONTRADO");

    console.log(dH);
    

    // var dH =  this.historialService.tramasHistorial; // Data Historial

    this.cl = {
      sin:Array(),
      altitudConsola:Array(),
      motor:[],
      h:[],
      l:[],
      m:[],
      n:[],
      o:[],
      p:[],
      position:0,
      datasdatos:[],
      datasets:{},
      temporizadorConsola:""
    };

    // //========= 0Fusionar parametros ====================
    // var fUnico = dH[0].dt_js.getTime();
    // dH[0].paramsGetAll = dH[0].paramsGet.slice();
    // var un = 0;
    // var id_uno = 0;
    // this.idUnico.push(0);
    // //========= 0Fusionar parametros ====================


    for (let i = 0; i < dH.length; i++) {

      dH[i].params2 = dH[i].params.replaceAll("|union|", "</br><strong><small><i>|union|</i></small></strong></br>");
      dH[i].params2 = dH[i].params2.replaceAll("|", "| ");
      if (dH[i].repeticiones > 1) {
        dH[i].params2 = dH[i].params2 +'</br><strong><small><i>Repeticiones:'+ dH[i].repeticiones+'</i></small></strong></br>';
      }



      // //========= 1Fusionar parametros ====================
      // if(fUnico == dH[i].dt_js.getTime()){
      //   if (i != 0) {
      //     Array.prototype.push.apply(dH[id_uno].paramsGetAll,dH[i].paramsGet);
      //   }
      // } else {
      //   fUnico = dH[i].dt_js.getTime();
      //   dH[i].paramsGetAll = dH[i].paramsGet.slice();
      //   un = 0;
      //   id_uno = i;
      //   this.idUnico.push(i);
      // }
      // //========= 1Fusionar parametros ====================

      let a = dH[i].dt_js.getTime();
      if (dH[i].speed <= 6) {
          this.cl.sin.push([a, 0])
      } else {
          this.cl.sin.push([a, dH[i].speed])
      }
      this.cl.altitudConsola.push([a, dH[i].altitude])
    }
    //console.log(dH[0].params2 );


    // //console.log("=======================>");

    // //console.log(this.idUnico);

    // //console.log("--------");
    // //console.log(this.cl);


  //   this.plot_historial = $.plot("#placeholder", [{
  //     data: this.cl.sin
  // }], this.options_grafico);


    console.log(jQuery.fn.jquery);
    console.log(jQuery().jquery);
    console.log($().jquery); // This prints v1.4.2
    console.log($j().jquery); // This prints v1.9.1



    this.plot_historial = $j.plot($("#placeholder"), [{
        data: this.cl.sin
    }], this.options_grafico);


    $("#btnIzqConsola").click(() => {
      this.plot_historial.pan({  left: -100  });
    });
    $("#btnDerConsola").click(() => {
      this.plot_historial.pan({  left: +100  });
    });

    $("#btnZoomInConsola").click(() => {
      this.plot_historial.zoom();
    });

    $("#btnZoomOutConsola").click(() => {
      this.plot_historial.zoomOut()
    });

    $("#btnPlayConsola").click(() => {
      this.consolahistorialPlay();
    });

    $("#btnPauseConsola").click(() => {
      clearTimeout(this.cl.temporizadorConsola);
    });

    $("#btnStopConsola").click(() => {
      clearTimeout(this.cl.temporizadorConsola);
      this.cl.position = 0;
      this.mapService.map.removeLayer(this.icoGplay);
      //this.mapService.map.removeLayer(this.icoGplay_popup);
    });

    //==================  MUESTRA INF EN LA LEGENDA DE LA CONSOLA PASANDO EL CURSOR POR ENCIMA DEL GRAFICO ==================

    $j("#placeholder").unbind("plothover");

    $j("#placeholder").bind("plothover", (o:any, p:any, n:any) => {

      if (n) {
          var m = n.dataIndex;
          var a = n.series.yaxis.ticks[0].label;

          // //console.log(o);
          // //console.log(p);
          // //console.log(n);
          // //console.log(a);
          var b = Math.floor(m / 2);
          var c = Math.ceil(m / 2);
          var d = n.datapoint[1];


          switch (this.opcionGraficoConsola) {

            case '1':
                var k = '<span>' + dH[m].dt_tracker.replace(/\//g, "-") + '</span>';
                if (dH[m].speed <= 6) {
                    var s = '<span>0</span>'
                } else {
                    var s = '<span>' + dH[m].speed + '</span>'
                }
                // document.getElementById("datoslegend")
                //     .innerHTML = "<strong>" + s + " km/h </strong> - " + k
                this.datosLegend = "<strong>" + s + " km/h </strong> - " + k;
                break;

            case '2':
                if (this.cl.altitudConsola.length == 2) {
                    if (m == 0) {
                        var k = '<span>' + dH[0].dt_tracker.replace(/\//g, "-") + '</span>';
                        var s = '<span>' + dH[0].altitude + '</span>'
                    } else {
                        var k = '<span>' + dH[dH.length - 1].dt_tracker.replace(/\//g, "-") + '</span>';
                        var s = '<span>' + dH[dH.length - 1].altitude + '</span>'
                    }
                } else {
                    var k = '<span>' + dH[m].dt_tracker.replace(/\//g, "-") + '</span>';
                    var s = '<span>' + dH[m].altitude + '</span>'
                }
                // document.getElementById("datoslegend")
                //     .innerHTML = "<strong>" + s + " m </strong> - " + k
                this.datosLegend = "<strong>" + s + " m </strong> - " + k;
                break;

            case '3':
                //console.log( dH[m]);
                //console.log(d);
                //var k = '<span>' + motorcos[c].dt_tracker.replace(/\//g, "-") + '</span>';
                var k = '<span>' + dH[m].dt_tracker.replace(/\//g, "-") + '</span>';
                if (d == 5 || d == '5' || d == 1 || d == '1') {
                    var s = '<span>Encendido</span>'
                } else {
                    var s = '<span>Apagado</span>'
                }
                // document.getElementById("datoslegend")
                //     .innerHTML = "<strong>" + s + "</strong> - " + k
                this.datosLegend = "<strong>" + s + "</strong> - " + k;
                break;

            case '4':

                k = '<span>' + moment( new Date(this.cl.datasets.velocidad.data[m][0]) ).format("YYYY-MM-DD HH:mm:ss") + '</span>';
                ////console.log(vm.cl.datasets.velocidad.data);
                //var k = '<span>' + vm.cl.datasets.velocidad.data[m][0] + '</span>';
                ////console.log(k);
                var s = '<span>Velocidad&#160;&#160;&#160;&#160;:&#160;' + this.cl.datasets.velocidad.data[m][1] + '&#160;km/h&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Fecha&#160;&#160;&#160;&#160;:&#160;' + k + '</span>';
                var e = '<span>Combustible Consumido&#160;:&#160;' + (this.cl.datasets.CConsumido.data[m][1] * 0.264172051 ).toFixed(2) + ' gal. || ' + (this.cl.datasets.CConsumido.data[m][1] )
                    .toFixed(2) + ' l.</span>';
                var f = '<span>Combustible Restante&#160;:&#160;' + (this.cl.datasets.CRestante.data[m][1]).toFixed(2) + ' gal. || ' + (this.cl.datasets.CRestante.data[m][1] * 3.7854118)
                    .toFixed(2) + ' l.</span>';
                var g = '<span>Od&#243;metro&#160;&#160;&#160;:&#160;' + this.cl.datasets.CInput.data[m][1].toFixed(2) + '</span>';
                var h = parseInt(this.cl.datasets.OnOff.data[m][1]);
                var i = '<span>Rev.x Min.&#160;&#160;:&#160;' + this.cl.datasets.RxM.data[m][1].toFixed(2) + '</span>';

                $("#mostrarvelocidad").html(s);
                $("#mostrarCConsumido").html(e);
                $("#mostrarCRestante").html(f);
                $("#mostrarCInput").html(g);
                // document.getElementById("mostrarvelocidad").innerHTML = s;
                // document.getElementById("mostrarCConsumido").innerHTML = e;
                // document.getElementById("mostrarCRestante").innerHTML = f;
                // document.getElementById("mostrarCInput").innerHTML = g;
                if (h == 1) {
                    var j = '<span>Motor (On/Off)&#160;&#160;&#160;&#160;:&#160;Encendido</span>'
                } else {
                    var j = '<span>Motor (On/Off)&#160;&#160;&#160;&#160;:&#160;Apagado</span>'
                }
                $("#mostrarOnOff").html(j);
                $("#mostrarRxM").html(i);
                // document.getElementById("mostrarOnOff").innerHTML = j;
                // document.getElementById("mostrarRxM").innerHTML = i
                break;
          }

      }
    });

    //==================  FIN MUESTRA INF EN LA LEGENDA DE LA CONSOLA PASANDO EL CURSOR POR ENCIMA DEL GRAFICO ==================


    //==================  UBICAR PUNTO EN EL HISTORIAL ==================

    $j("#placeholder").unbind("plotclick");

    $j("#placeholder").bind("plotclick",  (o:any, p:any, n:any ) => {
        console.log("===========");

        console.log(n);
        console.log(p);
        console.log(o);
        
        
        
        if (n) {
            var m = n.dataIndex;
            switch (this.opcionGraficoConsola) {
              case '1':
              case '2':
              case '3':
                this.cl.position = m; //Actualiza el punto de inicio de la simulación de movimiento
              break;
            }
            this.moveIconG(dH[m]);
        }
    });
    //================== FIN UBICAR PUNTO EN EL HISTORIAL ==================

    //==================  ZOOM A LA PARTE DELECCIONADA ==================
    $j("#placeholder").unbind("plotselected");

    $j("#placeholder").bind  ("plotselected", (c:any, d:any) => {
      //var f = document.getElementById("opcionGraficoConsola").value;

      switch (this.opcionGraficoConsola) {
        case '1':
            this.plot_historial = $j.plot($("#placeholder"), [{
                data: this.cl.sin
            }], $.extend(true, {}, this.options_grafico, {
                xaxis: {
                    min: d.xaxis.from,
                    max: d.xaxis.to
                }
            }));
            break;
        case '2':
            var g = 0;
            for (var i = 0; i < this.cl.altitudConsola.length; i++) {
                if (this.cl.altitudConsola[i][1] > 0) {
                    g = 1;
                    i = this.cl.altitudConsola.length
                }
            };
            if (g == 0) {
                this.plot_historial = $j.plot($("#placeholder"), [{
                    data: this.cl.altitudConsola
                }], $.extend(true, {}, this.options_grafico, {
                    xaxis: {
                        min: d.xaxis.from,
                        max: d.xaxis.to
                    },
                    yaxis: {
                        max: 1,
                        min: -1,
                        zoomRange: false,
                        tickFormatter: function (v:any, a:any) {
                            var k = Math.round(v * 100) / 100;
                            return k + " m"
                        },
                        panRange: false
                    }
                }))
            } else {
                this.plot_historial = $j.plot($("#placeholder"), [{
                    data: this.cl.altitudConsola
                }], $.extend(true, {}, this.options_grafico, {
                    xaxis: {
                        min: d.xaxis.from,
                        max: d.xaxis.to
                    },
                    yaxis: {
                        min: -1,
                        zoomRange: false,
                        tickFormatter: function (v:any, a:any) {
                            var k = Math.round(v * 100) / 100;
                            return k + " m"
                        },
                        panRange: false
                    }
                }))
            }
            break;
        case '3':
            this.plot_historial = $j.plot($("#placeholder"), [{
                data: this.cl.motor
            }], $.extend(true, {}, this.options_grafico, {
                xaxis: {
                    min: d.xaxis.from,
                    max: d.xaxis.to
                },
                yaxis: {
                    min: -0.25, //0min: 0,
                    tickFormatter: function (v:any, a:any) {
                        var k = Math.round(v * 100) / 100;
                        return k + " v."
                    },
                },
                // lines: {
                //     show: true,
                //     steps: true
                // }
                panRange: false
            }));
            break;
        case '4':

            //=============== FUNCION
            $("#datoslegend").find("input").click(() => {
              this.plotAccordingToChoices_selected(c, d);
            });

            this.plotAccordingToChoices_selected(c, d);
            break

        }
    });


    //================== FIN ZOOM A LA PARTE DELECCIONADA ==================

    this.icoGclick.on('popupclose', (e) => {
        setTimeout(() => {
                this.mapService.map.removeLayer(this.icoGclick);
        },300);
    });

    this.icoGplay.on('popupclose', () => {
      setTimeout(() => {
        this.mapService.map.removeLayer(this.icoGplay);
      },300);
    });

  }

  moveIconG(item:any) {
      //console.log("=======Move beybey");
      //console.log(this.icoGclick);

      this.icoGclick.setLatLng([item.lat, item.lng]).addTo(this.mapService.map);
      // this.icoGclick.bindPopup( this.getContentHis(item, 'Nombre de Unidad'), { offset: new L.Point(0, -16) } );
      this.icoGclick.setPopupContent( this.getContentHis(item, this.historialService.nombreUnidad ) );
      this.icoGclick.openPopup();

      this.mapService.map.setView([item.lat, item.lng],13);

  }



  changeOpcionGraficoConsola() {
    // var c = $("#opcionGraficoConsola").val();



    $("#choices").empty();
    $("#datoslegend").empty();

    this.plot_historial = $j.plot("#placeholder", [{
        data: []
    }], this.options_grafico);

    let dH =  this.historialService.tramasHistorial; // Data Historial

    switch (this.opcionGraficoConsola) {
      case '1':
          this.plot_historial = $j.plot("#placeholder", [{
              data: this.cl.sin
          }], this.options_grafico);
          break;
      case '2':
          var d = 0;
          for (var i = 0; i < this.cl.altitudConsola.length; i++) {
              if (this.cl.altitudConsola[i][1] > 0) {
                  d = 1;
                  i = this.cl.altitudConsola.length
              }
          };
          if (d == 0) {
              this.plot_historial = $j.plot($("#placeholder"), [{
                  data: this.cl.altitudConsola
              }], $.extend(true, {}, this.options_grafico, {
                  yaxis: {
                      max: 1,
                      min: -1,
                      zoomRange: false,
                      tickFormatter: function (v:any, a:any) {
                          let k = Math.round(v * 100) / 100;
                          return k + " m"
                      },
                      panRange: false
                  }
              }))
          } else {
              this.plot_historial = $j.plot($("#placeholder"), [{
                  data: this.cl.altitudConsola
              }], $.extend(true, {}, this.options_grafico, {
                  yaxis: {
                      min: -1,
                      zoomRange: false,
                      tickFormatter: function (v:any, a:any) {
                          var k = Math.round(v * 100) / 100;
                          return k + " m"
                      },
                      panRange: false
                  }
              }))
          }
          break;
      case '3':

          //console.log("-----CASO 3 DEL GRAFICO");

          this.cl.motor.length = 0;



          for (let i = 0; i < dH.length; i++) {

              let di4 = (dH[i].paramsGet.filter((item:any)=> item.id == "di4"))[0];

              // if (!(typeof dH[i].paramObj["di4"] === "undefined")) {
              if (!(di4 == null)) {
                  let g = dH[i].dt_js.getTime();
                  let a = di4.value ;//dH[i].paramObj["di4"];
                  this.cl.motor.push([g, a]);
              }
          }

          //console.log("******* MOTOR *******");
          //console.log(this.cl.motor);
          //console.log("*********************");

          this.plot_historial = $j.plot($("#placeholder"), [{
              data: this.cl.motor
          }], $.extend(true, {}, this.options_grafico, {
              yaxis: {
                  min: -0.25, //0
                  tickFormatter: function (v:any, a:any) {
                      var k = Math.round(v * 100) / 100;
                      return k + " v."
                  },
              },
              // lines: {
              //     show: true,
              //     steps: true
              // }
              panRange: false
          }));

          break;
      case '4':

          //console.log("dijugar la opcion 4");

          this.cl.m.length = 0;//-CRestante
          this.cl.h.length = 0;//-Velocidad
          this.cl.datasdatos.length = 0;//i
          this.cl.l.length = 0;//-C.Consumido
          this.cl.n.length = 0;//-Odómetro
          this.cl.o.length = 0;//-Rev.x Min.
          this.cl.p.length = 0;//-On/Off




          var x = 200;
          for (var i = 0; i < dH.length; i++) {
              //var g = new Date(datarow[i].dt_tracker.replace(/-/g, "/")).getTime();
              var g = dH[i].dt_js.getTime();

              this.cl.h.push([g, dH[i].speed]);
              this.cl.datasdatos.push(i);

              // if (!(typeof dH[i].paramObj["fuel_level"] === "undefined")) {
              //     var z = dH[i].paramObj["fuel_level"];
              //     z = (z * x) / 100;
              //     this.cl.m.push([g, z]);
              // }


              let z = (dH[i].paramsGet.filter((item:any)=> item.id == "fuel_level"))[0];
              if (!(z == null)) {
                  z = (z.value * x) / 100;
                  this.cl.m.push([g, z]);
              }

              // if ( !(typeof dH[i].paramObj["CAN_fuel_used"] === "undefined") ) {
              //     var A = dH[i].paramObj["CAN_fuel_used"];
              //     this.cl.l.push([g, A]);
              // } else if ( !(typeof dH[i].paramObj["can_fuel_used"] === "undefined") ) {
              //     var A = dH[i].paramObj["can_fuel_used"];
              //     this.cl.l.push([g, A]);
              // }

              let A1 = (dH[i].paramsGet.filter((item:any)=> item.id == "CAN_fuel_used"))[0];
              let A2 = (dH[i].paramsGet.filter((item:any)=> item.id == "can_fuel_used"))[0];

              if (!(A1 == null)) {
                  this.cl.l.push([g, A1.value]);
              } else if(!(A2 == null)) {
                  this.cl.l.push([g, A2.value]);
              }

              // if (!(typeof dH[i].paramObj["can_dist"] === "undefined")) {
              //     var B = dH[i].paramObj["can_dist"];
              //     this.cl.n.push([g, B]);
              // }

              let B = (dH[i].paramsGet.filter((item:any)=> item.id == "can_dist"))[0];
              if (!(B == null)) {
                  this.cl.n.push([g, B.value]);
              }

              // if (!(typeof dH[i].paramObj["can_rpm"] === "undefined")) {
              //     var C = dH[i].paramObj["can_rpm"];
              //     this.cl.o.push([g, C]);
              // }

              let C = (dH[i].paramsGet.filter((item:any)=> item.id == "can_rpm"))[0];
              if (!(C == null)) {
                this.cl.o.push([g, C.value]);
              }

              // if (!(typeof dH[i].paramObj["di4"] === "undefined")) {
              //     var D = dH[i].paramObj["di4"];
              //     this.cl.p.push([g, D]);
              // }

              let D = (dH[i].paramsGet.filter((item:any)=> item.id == "di4"))[0];
              if (!(D == null)) {
                this.cl.p.push([g, D.value]);
              }

              //*****************************************************
          };

          //console.log("*****************************************************vm.cl.m");
          //console.log(this.cl.m);//-CRestante
          //console.log(this.cl.h);//-Velocidad
          //console.log(this.cl.datasdatos);//i
          //console.log(this.cl.l);//-C.Consumido
          //console.log(this.cl.n);//-Odómetro
          //console.log(this.cl.o);//-Rev.x Min.
          //console.log(this.cl.p);//-On/Off
          //console.log("*****************************************************vm.cl.m");

          this.cl.datasets = {
              "velocidad": {
                  label: "Velocidad",
                  data: this.cl.h,
                  colorx: "#08088A",
                  yaxis: 1
              },
              "CConsumido": {
                  label: "C.Consumido",
                  data: this.cl.l,
                  colorx: "#FF0000",
                  yaxis: 2
              },
              "CRestante": {
                  label: "C.Restante",
                  data: this.cl.m,
                  colorx: "#00FF00",
                  yaxis: 3
              },
              "CInput": {
                  label: "Odómetro",
                  data: this.cl.n,
                  colorx: "#F3A405",
                  yaxis: 4
              },
              "OnOff": {
                  label: "On/Off",
                  data: this.cl.p,
                  colorx: "#9440ed",
                  yaxis: 5
              },
              "RxM": {
                  label: "Rev.x Min.",
                  data: this.cl.o,
                  colorx: "#0B8EE0",
                  yaxis: 6
              }
          };
          var i = 0;
          $.each(this.cl.datasets, function (a:any, b:any) {
              b.color = i;
              ++i
          });
          var E = $("#datoslegend");
          E.empty();
          if (this.cl.h.length > 2 && this.cl.l.length > 2 && this.cl.n.length > 2) {
              $.each(this.cl.datasets, function (a:any, b:any) {
                  // //console.log('xxxxxxxxxxx');
                  // //console.log(a);
                  // //console.log(b);
                  E.append("<span><label style='height:11px; width:11px; margin-bottom:-5px; background: " + b.colorx + "; color: " + b.colorx + ";border-style: dotted;'>-</label>" + "<input type='checkbox' name='" + a + "' checked='checked' id='id" + a + "'></input>" + "<label style='margin-bottom:-5px;' for='id" + a + "' id='mostrar" + a + "'>" + b.label + "</label></span><br>")
              })
          } else {
            $.each(this.cl.datasets, function (a:any, b:any) {
                E.append("-")
            })
          }
          $('#idCInput').attr('checked', false);
          $('#idOnOff').attr('checked', false);
          $('#idRxM').attr('checked', false);

        //=================>> FUNCION


          // $("#btnZoomOutConsola").click(() => {
          //   this.plot_historial.zoomOut()
          // });

          E.find("input").click(() => {
            this.plotAccordingToChoices();
          });


          this.plotAccordingToChoices();

          break;
    }
    this.changeOpcionTamanoConsola();
  }


  plotAccordingToChoices() {
    var b = new Array();
    var x = 200;
    $("#datoslegend").find("input:checked").each((id:any,chbox:any) => {
            // var a = $(this).attr("name");
            // //console.log("-------------");
            // //console.log(id);
            // //console.log(chbox);
            // //console.log(chbox.getAttribute("name"));

            var a = chbox.getAttribute("name");

            if (a && this.cl.datasets[a]) {
                b.push(this.cl.datasets[a])
            }
        });

    // //console.log("==============================");
    // //console.log(b);

    if (this.cl.h.length > 2 && this.cl.l.length > 2 && this.cl.n.length > 2) {
        //console.log("solo mas de 2 elementos en velocidad __");
        this.plot_historial = $j.plot("#placeholder", b, $.extend(true, {}, this.options_grafico, {
            xaxis: {
                mode: "time",
                timezone: "browser",
            },
            yaxis: {
                zoomRange: false,
                tickFormatter: function (v:any, a:any) {
                    var k = Math.round(v * 100) / 100;
                    return ".."
                },
                panRange: false
            },
            lines: {
                show: true,
                lineWidth: 1.3,
                fill: false
            },
            colors: ["#08088A", "#FF0000", "#00FF00", "#F3A405", "#9440ed", "#0B8EE0"],
            legend: {
                show: false
            },
            yaxes: [{
                position: 'left',
                min: 0,
                tickFormatter: function (v:any, a:any) {
                    var k = Math.round(v * 100) / 100;
                    return k + ".."
                },
            }, {
                position: 'left',
                min: this.cl.datasets.CConsumido.data[this.cl.datasets.CConsumido.data.length - 1][1] - 3,
                max: this.cl.datasets.CConsumido.data[0][1] + 3
            }, {
                position: 'left',
                min: 0,
                max: x
            }, {
                position: 'left',
                min: this.cl.datasets.CInput.data[0][1] - 3,
                max: this.cl.datasets.CInput.data[this.cl.datasets.CInput.data.length - 1][1] + 3
            }, {
                position: 'left',
                min: -1,
                max: 2
            }, {
                position: 'left',
            }]
        }));
        $("#placeholder").css('height', '100%').css('height', '-=150px');

    } else {
        // notificationService.success('NO CUENTA CON PARAMETROS DE COMBUSTIBLE PARA SU EVALUACIÓN.');
        this.plot_historial = $j.plot("#placeholder", [{  data: [] }], this.options_grafico);
        $("#placeholder").css("height", "100%").css("height", "-=35px");

    }
  }

  plotAccordingToChoices_selected(c:any , d:any) {
    var b = new Array();
    var j = 100;

    $("#datoslegend").find("input:checked").each((id:any,chbox:any) => {
            //var a = $(this).attr("name");
            var a = chbox.getAttribute("name");
            if (a && this.cl.datasets[a]) {
                b.push(this.cl.datasets[a])
            }
        });

    if (b.length > 0) {
        this.plot_historial = $j.plot("#placeholder", b, $.extend(true, {}, this.options_grafico, {
            xaxis: {
                min: d.xaxis.from,
                max: d.xaxis.to
            },
            yaxis: {
                zoomRange: false,
                tickFormatter: function (v:any, a:any) {
                    var k = Math.round(v * 100) / 100;
                    return ".."
                },
                panRange: false
            },
            lines: {
                show: true,
                lineWidth: 1.3,
                fill: false
            },
            colors: ["#08088A", "#FF0000", "#00FF00", "#F3A405", "#9440ed", "#0B8EE0"],
            legend: {
                show: false
            },
            yaxes: [{
                position: 'left',
                min: 0,
                tickFormatter: function (v:any, a:any) {
                    var k = Math.round(v * 100) / 100;
                    return k + ".."
                },
            }, {
                position: 'left',
                min: this.cl.datasets.CConsumido.data[this.cl.datasets.CConsumido.data.length - 1][1] - 3,
                max: this.cl.datasets.CConsumido.data[0][1] + 3
            }, {
                position: 'left',
                min: 0,
                max: j
            }, {
                position: 'left',
                min: this.cl.datasets.CInput.data[0][1] - 3,
                max: this.cl.datasets.CInput.data[this.cl.datasets.CInput.data.length - 1][1] + 3
            }, {
                position: 'left',
                min: -1,
                max: 2
            }, {
                position: 'left',
            }]
        }))
    }
  }


  changeOpcionVelocidadGraficoConsola() {
    //console.log('changeOpcionVelocidadGraficoConsola');

  }

  changeOpcionTamanoConsola() {

    //console.log('changeOpcionTamanoConsola');

    switch (this.opcionTamanoConsola) {

      case '1':
          // $("#divprincipal").css( "height", "70%" );

          $("#graficohistorial").css( "height", "200px" ); //30%
          // $("#placeholder").css('height', '100%').css('height', '-=35px');

          // if ($("#opcionGraficoConsola").val() == '4') {
          //     $("#placeholder").css('height', '100%').css('height', '-=150px');
          // } else {
          //     $("#placeholder").css("height", "100%").css("height", "-=35px");
          // }

          break;
      case '2':
          // $("#divprincipal").css( "height", "50%" );
          // $("#map").css( "height", "50%" );

          $("#graficohistorial").css( "height", "50%" );
          // $("#placeholder").css('height', '100%').css('height', '-=35px');

          // if ($("#opcionGraficoConsola").val() == '4') {
          //     $("#placeholder").css('height', '100%').css('height', '-=150px');
          // } else {
          //     $("#placeholder").css("height", "100%").css("height", "-=35px");
          // }

          break;
      case '3':
          // $("#divprincipal").css( "height", "0%" );
          $("#graficohistorial").css( "height", "100%" );
          // $("#placeholder").css('height', '100%').css('height', '-=35px');

          // if ($("#opcionGraficoConsola").val() == '4') {
          //     $("#placeholder").css('height', '100%').css('height', '-=150px');
          // } else {
          //     $("#placeholder").css("height", "100%").css("height", "-=35px");
          // }

          break;
    }

    if ( this.opcionGraficoConsola == '4') {
        $("#placeholder").css('height', '100%').css('height', '-=123px'); //-=150px
    } else {
      //console.log("gaaaaaaaa");

        $("#placeholder").css("height", "100%").css("height", "-=35px");
    }


  }




  consolahistorialPlay() {
      // temporizadorConsola
      // vm.plot_historial.pan({  left: -100  });
      //console.log("-----ini0");

      //console.log(this.historialService);

      var dH =  this.historialService.tramasHistorial; // Data Historial

      //$timeout.cancel(vm.cl.temporizadorConsola);
      clearTimeout(this.cl.temporizadorConsola);

      if ((dH.length > 0) && (this.cl.position < dH.length)) {

        var d = dH[this.cl.position].dt_tracker.replace(/\//g, "-");
        var c = dH[this.cl.position].dt_js.getTime();
        var pos = this.cl.position;

        this.consolaSetCrosshair(c);
        //console.log("position : "+this.cl.position);
        ////console.log("--1");

        // var a = $("#opcionGraficoConsola").val();

        switch (this.opcionGraficoConsola) {
          case '1':
              $("#datoslegend").html( "<strong>" + dH[pos].speed + " km/h</strong> - " + d );
              break;
          case '2':
              $("#datoslegend").html( "<strong>" + dH[pos].altitude + " m</strong> - " + d );
              break;
          case '3':

              let di4  = (dH[pos].paramsGet.filter((item:any)=> item.id == "di4"))[0];
              di4 = di4.value;
              if (di4 == 5 || di4 == '5' || di4 == 1 || di4 == '1') {
                  var s = '<span>Encendido</span>'
              } else {
                  var s = '<span>Apagado</span>'
              }

              $("#datoslegend").html( "<strong>" + s + "</strong> - " + d );
              break;
        }


        if (this.opcionGraficoConsola != '4') {
            // var b = marcadores_bd_base.map(function (e) { return e.idMarcador }).indexOf(datarow[0].imei);
            // var f = [vm.tramas[vm.cl.position].lat, vm.tramas[vm.cl.position].lng];
            //
            // var imh = L.icon({
            //     iconUrl: marcadores_bd_base[b].icon_bkp,
            //     iconSize: [26, 26],
            //     iconAnchor: [13, 13]
            // });

            //vm.icoGplay = values[0][3][1];




            //======================================================


            //======================================================
              this.icoGplay.setLatLng([dH[pos].lat, dH[pos].lng]).addTo(this.mapService.map);
              //this.icoGplay.bindPopup( this.getContentSimu(dH[pos]), { offset: new L.Point(0, -16) } );
              //this.icoGplay._popup.setContent( this.getContentSimu(dH[pos]) );
              this.icoGplay.setPopupContent( this.getContentSimu(dH[pos]) );
              this.icoGplay.openPopup();

              this.mapService.map.setView([dH[pos].lat, dH[pos].lng],13);

              // this.mapService.map._onResize();





            // historialDataFactory.getMap().getData().then( mapData => {
            //   var overlay = mapData.layers.overlays[historisOverlay];
            //   ////console.log(vm.icoGplay);
            //   //vm.icoG.addTo(overlay);
            //   vm.icoGplay.setLatLng([vm.tramas[pos].lat, vm.tramas[pos].lng]).addTo(overlay);
            //   vm.icoGplay._popup.setContent( historialHelper.getContentSimu(vm.tramas[pos], vm.tramas[0].nombre) );
            //   vm.icoGplay.openPopup();
            //   //var popup = layer.bindPopup(feature.properties.works);
            //   vm.icoGplay._popup.on("popupclose", function(e) {
            //       overlay.removeLayer(vm.icoGplay);
            //   });
            //   vm.icoGplay.on('popupclose', function(e) {
            //       setTimeout(function(){
            //               overlay.removeLayer(vm.icoGplay);
            //       },300);
            //   });
            //   mapData.map.setView([vm.tramas[pos].lat, vm.tramas[pos].lng]);
            //   mapData.map._onResize();
            // });

            this.cl.position++;

            // var vG = $("#opcionVelocidadGraficoConsola").val();
            var vG = this.opcionVelocidadGraficoConsola;
            if (vG == '1') {
              this.cl.temporizadorConsola = setTimeout(() => {
                this.consolahistorialPlay();
                }, 3333);
            } else if (vG == '2') {
              this.cl.temporizadorConsola = setTimeout(() => {
                this.consolahistorialPlay();
                }, 2222);
            } else if (vG == '3') {
              this.cl.temporizadorConsola = setTimeout(() => {
                this.consolahistorialPlay();
                }, 1111);
            } else if (vG == '4') {
              this.cl.temporizadorConsola = setTimeout(() => {
                this.consolahistorialPlay();
                }, 555);
            } else if (vG == '5') {
              this.cl.temporizadorConsola = setTimeout(() => {
                this.consolahistorialPlay();
                }, 222);
            } else if (vG == '6') {
              this.cl.temporizadorConsola = setTimeout(() => {
                this.consolahistorialPlay();
                }, 111);
            }





        } else {
          //console.log("Opcion 4 de combustible");
        }
      } else {
          //console.log("-----FINAL-----");
          // $timeout.cancel(vm.cl.temporizadorConsola);
          clearTimeout(this.cl.temporizadorConsola);
          this.cl.position = 0;
          return
      }
  };

  consolaSetCrosshair(b:any) {
    ////console.log("consolaSetCrosshair : "+b);
    var c = parseInt(this.plot_historial.pointOffset({ x: b, y: 0 }).left, 10) - this.plot_historial.getPlotOffset().left;
    let a = this.plot_historial.width();
    //var d = parseInt(a / 2, 10);
    var d = parseInt(a , 10) / 2;

    if (c > a - d) {
        this.plot_historial.pan({ left: c - (a - d), top: 0 })
    }
    if (c < d) {
        this.plot_historial.pan({ left: c - d, top: 0 })
    }
    this.plot_historial.setCrosshair({ x: b, y: 0 })
}


getContentSimu(item:any) {

  var xdt_tracker= item.dt_tracker.replace(/\//g, "-");

  return (
    `<table class="dl-horizontal">
      <tr><td><b> ${ xdt_tracker } </b></td><td> &#160;(${item.speed} km/h)</td></tr>
    </table>`
  );
}

getContentHis(item:any, nombre:any) {

  var xlat = parseFloat(item.lat).toFixed(6);
  var xlng = parseFloat(item.lng).toFixed(6);
  var xdt_tracker= item.dt_tracker.replace(/\//g, "-");

  return (
    `<table class="dl-horizontal">
      <tr><td>Objeto</td><td>: ${nombre}</td></tr>
      <tr><td>Direcci&#243n</td><td>: ...</td></tr>
      <tr><td>P.Cercano</td><td>: </td></tr>
      <tr><td>Posición</td><td>:<a href="https://maps.google.com/maps?q=${item.lat},${item.lng}&amp;t=m" target="_blank">${xlat}°,${xlng}°</a></td></tr>
      <tr><td>Altitud</td><td>: ${item.altitude} m</td></tr>
      <tr><td>Angulo</td><td>: ${item.angle}&#160;&#176;</td></tr>
      <tr><td>Velocidad</td><td>: ${item.speed} km/h</td></tr>
      <tr><td>Tiempo</td><td>: ${xdt_tracker} </td></tr>
    </table>`
  );
}



// mostrar_tabla(dH:any, iH:any) {
//   if (this.conHistorial) {
//         // para la tabla
//         this.transfers = [];
//         this.transfers.push({icono:"assets/images/start.png", trama:dH[0],icono_width:"13px",icono_height:"13px"});
//         for (let i = 0; i < iH.length; i++) {
//           if (dH[iH[i]].marker == "PARADA") {
//             if (this.form.chckParada ) {
//               this.transfers.push({icono:"assets/images/stop.png",trama:dH[iH[i]],icono_width:"11px",icono_height:"13px"});
//             }
//           }
//           else {
//             this.transfers.push({icono:"assets/images/drive.png",trama:dH[iH[i]],icono_width:"13px",icono_height:"13px"});
//           }
//         }
//         this.transfers.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});
//   }
// }

clickVerTablaRecorrido() {
  this.verTabla = true;

  this.tConsola =  this.historialService.tramasHistorial; // Data Historial

  $("#botonverconsola").css( "display", "none" );
  $("#botonocultarconsola").css( "display", "block" );

  // tConsola = new Array();
}

clickOcultarTablaRecorrido() {
  this.verTabla = false;

  $("#botonverconsola").css( "display", "block" );
  $("#botonocultarconsola").css( "display", "none" );

}



  // $( "#opcionGraficoConsola" ).change(function() {

  //   var c = $("#opcionGraficoConsola").val();

  //   $("#choices").empty();
  //   $("#datoslegend").empty();


  //   switch (c) {
  //     case '1':
  //         vm.plot_historial = $.plot("#placeholder", [{
  //             data: vm.cl.sin
  //         }], vm.options_grafico);
  //         break;
  //     case '2':
  //         var d = 0;
  //         for (var i = 0; i < vm.cl.altitudConsola.length; i++) {
  //             if (vm.cl.altitudConsola[i][1] > 0) {
  //                 d = 1;
  //                 i = vm.cl.altitudConsola.length
  //             }
  //         };
  //         if (d == 0) {
  //             vm.plot_historial = $.plot($("#placeholder"), [{
  //                 data: vm.cl.altitudConsola
  //             }], $.extend(true, {}, vm.options_grafico, {
  //                 yaxis: {
  //                     max: 1,
  //                     min: -1,
  //                     zoomRange: false,
  //                     tickFormatter: function (v, a) {
  //                         k = Math.round(v * 100) / 100;
  //                         return k + " m"
  //                     },
  //                     panRange: false
  //                 }
  //             }))
  //         } else {
  //             vm.plot_historial = $.plot($("#placeholder"), [{
  //                 data: vm.cl.altitudConsola
  //             }], $.extend(true, {}, vm.options_grafico, {
  //                 yaxis: {
  //                     min: -1,
  //                     zoomRange: false,
  //                     tickFormatter: function (v, a) {
  //                         var k = Math.round(v * 100) / 100;
  //                         return k + " m"
  //                     },
  //                     panRange: false
  //                 }
  //             }))
  //         }
  //         break;
  //     case '3':

  //         //console.log("-----CASO 3 DEL GRAFICO");
  //         ////console.log(vm.tramas[1]);
  //         //================================================================
  //         // vm.tramas[0].paramObj["di4"]
  //         //================================================================
  //         ////console.log(vm.tramas[1].paramObj["gfbdfghfdhbg"]);
  //         vm.cl.motor.length = 0;
  //         for (var i = 0; i < vm.tramas.length; i++) {
  //             if (!(typeof vm.tramas[i].paramObj["di4"] === "undefined")) {
  //                 var g = vm.tramas[i].dt_js.getTime();
  //                 var a = vm.tramas[i].paramObj["di4"];
  //                 vm.cl.motor.push([g, a]);
  //             }
  //         }

  //         //console.log("******* MOTOR *******");
  //         //console.log(vm.cl.motor);
  //         //console.log("*********************");

  //         ////console.log(vm.cl.motor);

  //         // if (vm.tramas[0].params.indexOf("acc=") > -1) {
  //         //     var f = 0;
  //         //     if (vm.tramas[0].params.indexOf("acc=00.00") > -1) {
  //         //         //var g = new Date(vm.tramas[0].dt_tracker.replace(/-/g, "/")).getTime();
  //         //         var g = vm.tramas[0].dt_js.getTime();
  //         //         var a = 0;
  //         //
  //         //         vm.cl.motor.push([g, a])
  //         //         //motorcos.push(vm.tramas[0]);
  //         //         f = 0
  //         //     } else {
  //         //         //var g = new Date(vm.tramas[0].dt_tracker.replace(/-/g, "/")).getTime();
  //         //         var g = vm.tramas[0].dt_js.getTime();
  //         //         var a = 5;
  //         //         vm.cl.motor.push([g, a]);
  //         //         //motorcos.push(vm.tramas[0]);
  //         //         f = 5
  //         //     }
  //         //     for (var i = 1; i < vm.tramas.length - 1; i++) {
  //         //         if (vm.tramas[i].params.indexOf("acc=00.00") > -1) {
  //         //             if (f != 0) {
  //         //                 //var g = new Date(vm.tramas[i].dt_tracker.replace(/-/g, "/")).getTime();
  //         //                 var g = vm.tramas[i].dt_js.getTime();
  //         //                 var a = 0;
  //         //                 vm.cl.motor.push([g, a]);
  //         //                 //motorcos.push(vm.tramas[i]);
  //         //                 f = 0
  //         //             }
  //         //         } else if (vm.tramas[i].params.indexOf("acc=") > -1) {
  //         //             if (f != 5) {
  //         //                 //var g = new Date(vm.tramas[i].dt_tracker.replace(/-/g, "/")).getTime();
  //         //                 var g = vm.tramas[i].dt_js.getTime();
  //         //                 var a = 5;
  //         //                 vm.cl.motor.push([g, a]);
  //         //                 //motorcos.push(vm.tramas[i]);
  //         //                 f = 5
  //         //             }
  //         //         }
  //         //     };
  //         //     if (vm.tramas[vm.tramas.length - 1].params.indexOf("acc=00.00") > -1) {
  //         //         //var g = new Date(vm.tramas[vm.tramas.length - 1].dt_tracker.replace(/-/g, "/")).getTime();
  //         //         var g = vm.tramas[vm.tramas.length - 1].dt_js.getTime();
  //         //         var a = 0;
  //         //         vm.cl.motor.push([g, a]);
  //         //         //motorcos.push(vm.tramas[vm.tramas.length - 1]);
  //         //         f = 0
  //         //     } else if (vm.tramas[vm.tramas.length - 1].params.indexOf("acc=") > -1) {
  //         //         //var g = new Date(vm.tramas[vm.tramas.length - 1].dt_tracker.replace(/-/g, "/")).getTime();
  //         //         var g = vm.tramas[vm.tramas.length - 1].dt_js.getTime();
  //         //         var a = 5;
  //         //         vm.cl.motor.push([g, a]);
  //         //         //motorcos.push(vm.tramas[vm.tramas.length - 1]);
  //         //         f = 5
  //         //     }
  //         // }


  //         vm.plot_historial = $.plot($("#placeholder"), [{
  //             data: vm.cl.motor
  //         }], $.extend(true, {}, vm.options_grafico, {
  //             yaxis: {
  //                 min: 0,
  //                 tickFormatter: function (v, a) {
  //                     var k = Math.round(v * 100) / 100;
  //                     return k + " v."
  //                 },
  //             },
  //             lines: {
  //                 show: true,
  //                 steps: true
  //             }
  //         }));
  //         break;


  //     case '4':
  //         // var h = [];
  //         // var l = [];
  //         // var m = [];
  //         // var n = [];
  //         // var o = [];
  //         // var p = []
  //         // var q = 0;
  //         // var r = 0;
  //         // var s = 0;
  //         // var t = 0;
  //         // var u = 0;

  //         // var w = marcadores_bd_base.map(function (e) {
  //         //         return e.idMarcador
  //         //     })
  //         //     .indexOf(datarow[0].imei);
  //         // var x = marcadores_bd_base[w].tanque;

  //         //*****************************************************

  //         vm.cl.m.length = 0;//-CRestante
  //         vm.cl.h.length = 0;//-Velocidad
  //         vm.cl.datasdatos.length = 0;//i
  //         vm.cl.l.length = 0;//-C.Consumido
  //         vm.cl.n.length = 0;//-Odómetro
  //         vm.cl.o.length = 0;//-Rev.x Min.
  //         vm.cl.p.length = 0;//-On/Off


  //         var x = 200;
  //         for (var i = 0; i < vm.tramas.length; i++) {
  //             //var g = new Date(datarow[i].dt_tracker.replace(/-/g, "/")).getTime();
  //             var g = vm.tramas[i].dt_js.getTime();

  //             vm.cl.h.push([g, vm.tramas[i].speed]);
  //             vm.cl.datasdatos.push(i);

  //             if (!(typeof vm.tramas[i].paramObj["fuel_level"] === "undefined")) {
  //                 var z = vm.tramas[i].paramObj["fuel_level"];
  //                 z = (z * x) / 100;
  //                 vm.cl.m.push([g, z]);
  //             }

  //             if ( !(typeof vm.tramas[i].paramObj["CAN_fuel_used"] === "undefined") ) {
  //                 var A = vm.tramas[i].paramObj["CAN_fuel_used"];
  //                 vm.cl.l.push([g, A]);
  //             } else if ( !(typeof vm.tramas[i].paramObj["can_fuel_used"] === "undefined") ) {
  //                 var A = vm.tramas[i].paramObj["can_fuel_used"];
  //                 vm.cl.l.push([g, A]);
  //             }

  //             if (!(typeof vm.tramas[i].paramObj["can_dist"] === "undefined")) {
  //                 var B = vm.tramas[i].paramObj["can_dist"];
  //                 vm.cl.n.push([g, B]);
  //             }

  //             if (!(typeof vm.tramas[i].paramObj["can_rpm"] === "undefined")) {
  //                 var C = vm.tramas[i].paramObj["can_rpm"];
  //                 vm.cl.o.push([g, C]);
  //             }

  //             if (!(typeof vm.tramas[i].paramObj["di4"] === "undefined")) {
  //                 var D = vm.tramas[i].paramObj["di4"];
  //                 vm.cl.p.push([g, D]);
  //             }

  //             //*****************************************************
  //         };

  //         //console.log("*****************************************************vm.cl.m");
  //         //console.log(vm.cl.m);//-CRestante
  //         //console.log(vm.cl.h);//-Velocidad
  //         //console.log(vm.cl.datasdatos);//i
  //         //console.log(vm.cl.l);//-C.Consumido
  //         //console.log(vm.cl.n);//-Odómetro
  //         //console.log(vm.cl.o);//-Rev.x Min.
  //         //console.log(vm.cl.p);//-On/Off
  //         //console.log("*****************************************************vm.cl.m");

  //         vm.cl.datasets = {
  //             "velocidad": {
  //                 label: "Velocidad",
  //                 data: vm.cl.h,
  //                 colorx: "#08088A",
  //                 yaxis: 1
  //             },
  //             "CConsumido": {
  //                 label: "C.Consumido",
  //                 data: vm.cl.l,
  //                 colorx: "#FF0000",
  //                 yaxis: 2
  //             },
  //             "CRestante": {
  //                 label: "C.Restante",
  //                 data: vm.cl.m,
  //                 colorx: "#00FF00",
  //                 yaxis: 3
  //             },
  //             "CInput": {
  //                 label: "Odómetro",
  //                 data: vm.cl.n,
  //                 colorx: "#F3A405",
  //                 yaxis: 4
  //             },
  //             "OnOff": {
  //                 label: "On/Off",
  //                 data: vm.cl.p,
  //                 colorx: "#9440ed",
  //                 yaxis: 5
  //             },
  //             "RxM": {
  //                 label: "Rev.x Min.",
  //                 data: vm.cl.o,
  //                 colorx: "#0B8EE0",
  //                 yaxis: 6
  //             }
  //         };
  //         var i = 0;
  //         $.each(vm.cl.datasets, function (a, b) {
  //             b.color = i;
  //             ++i
  //         });
  //         var E = $("#datoslegend");
  //         $("#datoslegend").empty();
  //         if (vm.cl.h.length > 2 && vm.cl.l.length > 2 && vm.cl.n.length > 2) {
  //             $.each(vm.cl.datasets, function (a, b) {
  //                 E.append("<span><label style='height:11px; width:11px; margin-bottom:-5px; background: " + b.colorx + "; color: " + b.colorx + ";border-style: dotted;'>-</label>" + "<input type='checkbox' name='" + a + "' checked='checked' id='id" + a + "'></input>" + "<label style='margin-bottom:-5px;' for='id" + a + "' id='mostrar" + a + "'>" + b.label + "</label></span><br>")
  //             })
  //         } else {
  //           $.each(vm.cl.datasets, function (a, b) {
  //               E.append("-")
  //           })
  //         }
  //         $('#idCInput').attr('checked', false);
  //         $('#idOnOff').attr('checked', false);
  //         $('#idRxM').attr('checked', false);

  //         function plotAccordingToChoices() {
  //             var b = [];
  //             E.find("input:checked").each(function () {
  //                     var a = $(this).attr("name");
  //                     if (a && vm.cl.datasets[a]) {
  //                         b.push(vm.cl.datasets[a])
  //                     }
  //                 });


  //             if (vm.cl.h.length > 2 && vm.cl.l.length > 2 && vm.cl.n.length > 2) {
  //                 //console.log("solo mas de 2 elementos en velocidad __");
  //                 vm.plot_historial = $.plot("#placeholder", b, $.extend(true, {}, vm.options_grafico, {
  //                     xaxis: {
  //                         mode: "time",
  //                         timezone: "browser",
  //                     },
  //                     yaxis: {
  //                         zoomRange: false,
  //                         tickFormatter: function (v, a) {
  //                             var k = Math.round(v * 100) / 100;
  //                             return ".."
  //                         },
  //                         panRange: false
  //                     },
  //                     lines: {
  //                         show: true,
  //                         lineWidth: 1.3,
  //                         fill: false
  //                     },
  //                     colors: ["#08088A", "#FF0000", "#00FF00", "#F3A405", "#9440ed", "#0B8EE0"],
  //                     legend: {
  //                         show: false
  //                     },
  //                     yaxes: [{
  //                         position: 'left',
  //                         min: 0,
  //                         tickFormatter: function (v, a) {
  //                             var k = Math.round(v * 100) / 100;
  //                             return k + ".."
  //                         },
  //                     }, {
  //                         position: 'left',
  //                         min: vm.cl.datasets.CConsumido.data[vm.cl.datasets.CConsumido.data.length - 1][1] - 3,
  //                         max: vm.cl.datasets.CConsumido.data[0][1] + 3
  //                     }, {
  //                         position: 'left',
  //                         min: 0,
  //                         max: x
  //                     }, {
  //                         position: 'left',
  //                         min: vm.cl.datasets.CInput.data[0][1] - 3,
  //                         max: vm.cl.datasets.CInput.data[vm.cl.datasets.CInput.data.length - 1][1] + 3
  //                     }, {
  //                         position: 'left',
  //                         min: -1,
  //                         max: 2
  //                     }, {
  //                         position: 'left',
  //                     }]
  //                 }));
  //                 $("#placeholder").css('height', '100%').css('height', '-=150px');

  //             } else {
  //                 notificationService.success('NO CUENTA CON PARAMETROS DE COMBUSTIBLE PARA SU EVALUACIÓN.');
  //                 vm.plot_historial = $.plot("#placeholder", [{  data: [] }], vm.options_grafico);
  //                 $("#placeholder").css("height", "100%").css("height", "-=35px");

  //             }
  //         }
  //         E.find("input").click(plotAccordingToChoices);
  //         plotAccordingToChoices();

  //         break;

  //   }

  // });







}
