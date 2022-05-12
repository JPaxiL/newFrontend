import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class BrowserDetectorService {
    chromium = !!navigator.userAgent.match(/chrome|chromium|crios/i);
    firefox = !navigator.userAgent.match(/chrome|chromium|crios/i) && !!navigator.userAgent.match(/firefox|fxios/i);
    safari = !navigator.userAgent.match(/chrome|chromium|crios/i) && !navigator.userAgent.match(/firefox|fxios/i) && !!navigator.userAgent.match(/safari/i);
    chEdge = !!navigator.userAgent.match(/chrome|chromium|crios/i) && navigator.userAgent.indexOf("Edg/") > -1;
    opera = !!navigator.userAgent.match(/opr\//i);
    ieEdge = navigator.userAgent.indexOf("Edge") > -1;

    constructor(){
    }

    isChromium():boolean{
        return this.chromium;
    }

    isFirefox():boolean{
        return this.firefox;
    }

    isSafari():boolean{
        return this.safari;
    }

    isOpera():boolean{
        return this.opera;
    }
    
    isChEdge():boolean{
        return this.chEdge;
    }

    isIEEdge():boolean{
        console.log('True ', this.ieEdge == navigator.userAgent.indexOf("Edge") > -1);
        return navigator.userAgent.indexOf("Edge") > -1;
    }
}