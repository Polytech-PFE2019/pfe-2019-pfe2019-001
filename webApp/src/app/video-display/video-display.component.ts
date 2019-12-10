import { Component, OnInit, Inject } from '@angular/core';
import * as io from "socket.io-client";
import { HttpClient } from '@angular/common/http';
import { firebaseService } from '../services/firebaseService'
import { BirdsService } from '../services/birds.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  image: string;
}


@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.scss']
})
export class VideoDisplayComponent implements OnInit {

  private url = "http://localhost:3000";
  private socket;
  private birdsNearby = undefined;
  private birdsNearbyFull = [];
  private image;

  constructor(private http: HttpClient, private firebase: firebaseService, private _snackBar: MatSnackBar, public dialog: MatDialog, private _birdsService: BirdsService) {
    this.socket = io(this.url);
    console.log("Test");
    this.socket.on('image', (image) => {
      const imageElm = document.getElementById('image');
      imageElm.setAttribute("src", `data:image/jpeg;base64,${image}`);
      document.getElementById("loading").style.display = 'none';
      document.getElementById("switch").style.display = 'inline';
      document.getElementById("capture").style.display = 'inline';
    });

    this.socket.on("connect_error", function (exeception) {
      document.getElementById('image').setAttribute("src", "https://image.freepik.com/vecteurs-libre/modele-erreur-404-oiseau-dans-style-dessine-main_23-2147734776.jpg");
      document.getElementById("loading").style.display = 'none';
      document.getElementById("switch").style.display = 'none';
      document.getElementById("capture").style.display = 'none';
    });
  }

  ngOnInit() {
    this.image = document.getElementById('image');
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
    this.socket.disconnect();
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
    this.http.get(`http://localhost:3000/picture`, {
      responseType: 'text'
    }).subscribe((data) => {
      this.chooseAlbum(data)
    })
  }

  public switch() {
    this.socket.emit("switch", 0);
    console.log("Switch");
  }

  chooseAlbum(image): void {
    const dialogRef = this.dialog.open(DialogAlbum, {
      width: '300px',
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


  matchCapture(name, ) {
    this.http.get(`http://localhost:3000/picture`, {
      responseType: 'text'
    }).subscribe((data) => {
      var image = { value: data }
      this.firebase.push("picture/" + name, image);
      this._snackBar.open("capture effectuée", undefined, {
        duration: 2000,
      });
    })
  }

}

@Component({
  selector: 'dialog-album',
  templateUrl: 'dialog-album.html',
})
export class DialogAlbum {

  albumName = "picture";
  albums = undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogAlbum>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private firebase: firebaseService) {
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

  uploadImage() {
    var image = { value: this.data.image }
    this.firebase.push("picture/" + this.albumName, image);
    this.dialogRef.close(true);
  }

}
