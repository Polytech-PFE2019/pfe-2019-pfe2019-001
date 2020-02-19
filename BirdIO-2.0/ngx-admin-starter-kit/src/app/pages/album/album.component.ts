import { Component, OnInit, Inject, Sanitizer } from '@angular/core';
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
  constructor(private sanitizer: DomSanitizer, private db: DbService) {
    this.placeholder = this.displayImage("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");
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
    console.log(this.selectedItem);
    console.log(this.albumName);
    for (let e of this.pictures) {
      if (e.checked == true) {
        this.db.moveImage(this.albumName, this.customName, { path: e.path, image: e.image }).then((res) => {
          console.log(res)
        })
      };
    }
  }

}
