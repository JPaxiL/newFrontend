import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaRequest } from '../multiview/models/interfaces';
import { MultimediaService } from '../multiview/services/multimedia.service';


@Component({
  selector: 'app-cipia',
  templateUrl: './cipia.component.html',
  styleUrls: ['./cipia.component.scss']
})
export class CipiaComponent implements OnInit {

    //-------- test retrieveVideo------------
  loading = false;
  mediaRequestRetrieve: MediaRequest = {
    device_id: "E321361152",
    from: "2023-10-30 18:45:00",
    seconds: 60,
    source: "CABIN"
  };
  mediaRequestRecord: MediaRequest = {
    device_id: "E321361152",
    seconds: 60,
    source: "CABIN"
  };
  videoUrl!:SafeResourceUrl;
  //-----------------------------

  constructor(private multimediaService: MultimediaService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getMediaTest(){
    this.loading = true;
    this.multimediaService.retrieveVideoFrom(this.mediaRequestRetrieve).subscribe( (url:any) => {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    },
    error => {
      console.log(error);
    });
  }

  recordMediaTest(){
    this.loading = true;
    this.multimediaService.recordVideo(this.mediaRequestRecord).subscribe( (url:any) => {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    },
    error => {
      console.log(error);
    });
  }

}
