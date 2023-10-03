import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MinimapUtilsService {

  constructor() { }

  getContrastYIQ(hex: string){
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000' : '#fff';
  }

  hexToRGBA(hex: string, alpha?: number){
    if(typeof alpha === 'undefined'){
      alpha = 0.8;
    }
    var c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha.toString() + ')';
    }
    console.log('Hex Color inválido');
    return 'rgba(255,255,255,0.9)';
  }
}
