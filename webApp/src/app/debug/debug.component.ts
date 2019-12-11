import { Component, OnInit } from '@angular/core';
import { firebaseService } from '../services/firebaseService';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  private albumName;
  private base64;
  constructor(private firebase: firebaseService) { }

  ngOnInit() {
  }

  uploadImage() {
    console.log(this.albumName)
    var image = { value: this.base64 }
    this.firebase.push("picture/" + this.albumName, image);
  }

}
