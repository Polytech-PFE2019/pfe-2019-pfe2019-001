import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import * as io from "socket.io-client";
import { HttpClient } from '@angular/common/http';
import { firebaseService } from '../../../services/firebase.service'
import { BirdsService } from '../../../services/birds.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { picamServer, usbcamServer } from '../../../environments/environment';
import { saveAs } from 'file-saver';
import { NbToastrService } from '@nebular/theme';

export interface DialogData {
  image: string;
}


@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.scss']
})
export class VideoDisplayComponent implements OnInit {

  private birdsNearby = undefined;
  public birdsNearbyFull = [];
  public display = [];
  private image;
  private camera_id = 0;
  private videoSource = picamServer;
  private flipped = false;
  private error = false;

  @HostBinding('class')
  classes = 'example-iteems-row';

  constructor(private http: HttpClient, private firebase: firebaseService, private _snackBar: MatSnackBar, private _birdsService: BirdsService, private toastrService: NbToastrService) {

  }

  ngOnInit() {
    this.image = document.getElementById('image');
    console.log(this.image);
    this._birdsService.getBirdsNearby().then(data => {
      this.birdsNearby = data;
      this.birdsNearby.forEach((bird) => {
        this._birdsService.getBirdImage(bird.comName).then((result) => {
          var hits = Object.keys(result)[1]
          if (result[hits].length > 0) {
            this.birdsNearbyFull.push({ name: bird.comName, url: result[hits][0].largeImageURL });
            this.display.push({ name: bird.comName, url: result[hits][0].largeImageURL });
          }
        });
      });
    });
  }

  ngOnDestroy() {

  }

  filter(value) {
    this.display = [];
    if (value == undefined || value == "") {
      this.display = this.birdsNearbyFull;
      return;
    }
    for (var bird in this.birdsNearbyFull) {
      console.log(bird);
      if (this.birdsNearbyFull[bird].name.toLowerCase().includes(value.toLowerCase())) {
        this.display.push(this.birdsNearbyFull[bird]);
      }
    }
  }

  imgError() {
    console.log("Can't find video source.");
    if (this.error) {
      return;
    }
    if (this.videoSource == picamServer) {
      this.videoSource = usbcamServer;
    } else {
      this.videoSource = picamServer;
    }
  }

  fullScreen() {
    console.log("full screen");
    this.image = document.getElementById('image');
    if (this.image.requestFullscreen) {
      this.image.requestFullscreen();
    } else if (this.image.mozRequestFullScreen) { /* Firefox */
      this.image.mozRequestFullScreen();
    } else if (this.image.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      this.image.webkitRequestFullscreen();
    } else if (this.image.msRequestFullscreen) { /* IE/Edge */
      this.image.msRequestFullscreen();
    }
  }

  public switch() {
    this.videoSource = this.videoSource == picamServer ? usbcamServer : picamServer;
    console.log("Switchii");
  }

  matchCapture(name) {
    if (name == undefined)  {
      name = "new";
    }
    var video_ctx = this;
    var direct = document.createElement('canvas');
    var stream = document.createElement('canvas');
    let img = document.getElementById("image") as HTMLImageElement;
    var ctx_direct = direct.getContext('2d');
    var ctx_stream = stream.getContext('2d');
    img.onload = () => {
      stream.width = direct.width = img.naturalWidth;
      stream.height = direct.height = img.naturalHeight;
      // onload should fire multiple times
      // but it seems it's not at every frames
      // so we'll disable t and use an interval instead
      img.onload = null;
      var temp = stream.cloneNode() as HTMLCanvasElement;
      let ctx_off = temp.getContext('2d');
      ctx_off.drawImage(img, 0, 0);
      // and draw it back to our visible one
      ctx_stream.drawImage(ctx_off.canvas, 0, 0);

      // draw the img directly on 'direct'
      ctx_direct.drawImage(img, 0, 0);
      console.log(direct.toDataURL("image/jpeg"));
      var image = { value: direct.toDataURL("image/jpeg") }
      video_ctx.firebase.push("picture/" + name, image);
      var position = 'top-right' as any;
      var status = 'success' as any;
      this.toastrService.show(status || 'Success', `Photo ajoutée à l'album ${name}`, {position, status});
    };
  }
}
