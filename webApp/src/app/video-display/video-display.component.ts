import { Component, OnInit, Inject } from '@angular/core';
import * as io from "socket.io-client";
import { HttpClient } from '@angular/common/http';
import { firebaseService } from '../services/firebaseService'
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

  constructor(private http: HttpClient, private firebase: firebaseService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
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

  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  public capture() {
    this.http.get(`http://localhost:3000/picture`, {
      responseType: 'text'
    }).subscribe((data) => {
      this.chooseAlbum(data)
    })
    this.socket.emit("picture", false);
  }

  public switch() {
    this.socket.emit("switch", 0);
    console.log("Switch");
  }

  chooseAlbum(image): void {
    const dialogRef = this.dialog.open(DialogAlbum, {
      width: '250px',
      data: { image: image }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this._snackBar.open("capture effectué", undefined, {
          duration: 2000,
        });
      }
    });

  }

}

@Component({
  selector: 'dialog-album',
  templateUrl: 'dialog-album.html',
})
export class DialogAlbum {

  albumName = "picture";

  constructor(
    public dialogRef: MatDialogRef<DialogAlbum>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private firebase: firebaseService) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  uploadImage() {
    this.firebase.push("picture/" + this.albumName, this.data.image);
    this.dialogRef.close(true);
  }

}