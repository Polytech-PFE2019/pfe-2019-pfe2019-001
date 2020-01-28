import { Component, OnInit, Inject } from '@angular/core';
import * as io from "socket.io-client";
import { HttpClient } from '@angular/common/http';
import { firebaseService } from '../../../services/firebase.service'
import { BirdsService } from '../../../services/birds.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { picamServer, usbcamServer } from '../../../environments/environment';
import { saveAs } from 'file-saver';

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
  private image;
  private camera_id = 0;
  private picamServer = picamServer;
  private usbcamServer = usbcamServer;
  private flipped = false;

  constructor(private http: HttpClient, private firebase: firebaseService, private _snackBar: MatSnackBar, public dialog: MatDialog, private _birdsService: BirdsService) {

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
          }
        });
      });
    });
  }

  ngOnDestroy() {

  }

  fullScreen() {
    console.log("full screen");
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

  public capture() {
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
      video_ctx.chooseAlbum(direct.toDataURL("image/jpeg"));
    };
  }

  public switch() {
    this.camera_id = (this.camera_id + 1) % 2;
    console.log("Switchii");
  }

  chooseAlbum(image): void {
    const dialogRef = this.dialog.open(DialogAlbum, {
      //width: '300px',
      data: { image: image }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this._snackBar.open("capture effectuée", undefined, {
          duration: 2000,
        });
      }
    });
  }


  // matchCapture(name) {
  //   this.piSocket.emit('picture', 100, (data) => {
  //     var image = { value: data }
  //     this.firebase.push("picture/" + name, image);
  //     this._snackBar.open("capture effectuée", undefined, {
  //       duration: 2000,
  //     });
  //   });
  // }
}

@Component({
  selector: 'dialog-album',
  templateUrl: 'dialog-album.html',
})
export class DialogAlbum {

  public albumName = "picture";
  public albums = undefined;
  public image;

  constructor(
    public dialogRef: MatDialogRef<DialogAlbum>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private firebase: firebaseService) {
    this.image = `data:image/jpeg;base64,${data.image}`
    this.loadAlbums();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  loadAlbums() {
    this.firebase.getAlbums().then((albums) => {
      this.albums = albums;
    });
  }

  download() {
    saveAs(this.b64toBlob(this.image), "capture.jpg");
  }

  b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  uploadImage() {
    var image = { value: this.data.image }
    this.firebase.push("picture/" + this.albumName, image);
    this.dialogRef.close(true);
  }

}
