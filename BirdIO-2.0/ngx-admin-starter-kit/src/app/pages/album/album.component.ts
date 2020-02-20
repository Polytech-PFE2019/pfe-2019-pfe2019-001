import { Component, OnInit, Inject, Sanitizer, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DbService } from '../../../services/db.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { localServer } from '../../../environments/environment';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  private albumdetail = false;
  private loading = true;
  private pictures = null;
  private albumName = null;
  private placeholder;
  public thumbnails;
  public customName = "New";
  public selectedItem = "default";
  constructor(private sanitizer: DomSanitizer, private db: DbService, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.db.getAlbums().then((data) => {
      this.thumbnails = data;
      this.loading = false;
      console.log(this.thumbnails)
    })
  }

  displayImage(base64) {
    if (base64.startsWith('data:image/jpeg;base64,')) {
      return ((this.sanitizer.bypassSecurityTrustResourceUrl(base64)) as any).changingThisBreaksApplicationSecurity;
    }
    return 'data:image/jpeg;base64,' + ((this.sanitizer.bypassSecurityTrustResourceUrl(base64)) as any).changingThisBreaksApplicationSecurity;
  }

  goBack() {
    for (let e of this.pictures) {
      e.checked = false;
    }
    this.pictures = null;
    this.albumdetail = false;
    this.albumName = null;
  }

  videoCheck(thumbnail) {
    return thumbnail.endsWith(".mp4");
  }

  getVideoPathInServer(name) {
    if (!name.endsWith(".mp4")) {
      return name;
    }
    return localServer + "/image/video/" + name.replace(/(\r\n|\n|\r)/gm, "");
  }

  openAlbum(album) {
    console.log("ok")
    this.db.getImgInAlbums(album.album.name).then((res) => {
      this.pictures = res;
      console.log(res);

      this.albumName = album.album.name;
      this.albumdetail = true;
      for (let e of this.pictures) {
        e.checked = false;
      }
    })
  }

  check(picture) {
    console.log("checked =" + picture.checked);

    if (picture.checked == true) {
      picture.checked = false;
      console.log("uncheck");

    } else {
      picture.checked = true;
      console.log("check");

    }
    console.log(this.pictures)
  }

  download() {
    console.log("ok");

    let zip = new JSZip();
    let cpt = 0;
    console.log(this.pictures)
    for (let e of this.pictures) {
      if (e.checked == true) {
        zip.file(cpt + '.jpeg', e.value, { base64: true })
        cpt++
      };
    }
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        saveAs(content, "example.zip");
      });
  }

  selectAll() {
    for (let e of this.pictures) {
      e.checked = true;
    }
  }

  unSelectAll() {
    for (let e of this.pictures) {
      e.checked = false;
    }
  }

  move() {
    for (let e of this.pictures) {
      if (e.checked == true) {
        console.log(e);
        let newName;
        if(this.selectedItem == "Custom"){
            newName = this.customName;
        }
        else {
          newName = this.selectedItem;
        }
        this.db.moveImage(this.albumName, newName, { name: e.img.endsWith('.mp4') ? e.img : "some name", path: e.path }).then((res: any) => {
          console.log(res);
          this.ngOnInit();
          this.albumdetail = false;
        }, err => {
          console.log(err);
        })
      };
    }
  }

  remove() {
    for (let e of this.pictures) {
      if (e.checked == true) {
        this.db.removeImage(this.albumName, e.path).then((res) => {
          console.log(res)
        })
      };
    }
  }

}
