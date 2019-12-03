import { Component, OnInit } from '@angular/core';
import RxPlayer from "rx-player";
import * as io from "socket.io-client";

@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.scss']
})
export class VideoDisplayComponent implements OnInit {

  private url = "http://192.168.43.77:3000";
  private socket;

  constructor() {
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
    })
  }

  ngOnInit() {
    /*var jsmpeg = require('jsmpeg');
        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        var client = new WebSocket('ws://192.168.43.223:8080/video-stream');
        var x = document.getElementById("video");
        client.onerror = function(event){
          x.setAttribute("src", "https://image.freepik.com/vecteurs-libre/modele-erreur-404-oiseau-dans-style-dessine-main_23-2147734776.jpg");
        };
        var player = new jsmpeg(client, {canvas:canvas});

        x.onload = function(event){
          document.getElementById("loading").style.display = 'none';
        };

        /*const player = new RxPlayer({
          videoElement: document.getElementById("video")
        });

        player.loadVideo({
          url : "http://192.168.43.14/video0.mpd",
          transport: "dash",
          autoplay: true
        })*/
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  public capture() {
    this.socket.emit("picture", false);
    document.getElementById("cap").style.display = 'inline';
    console.log("Capture");
    setTimeout(() => {
      document.getElementById('cap').style.display = "none";
    }, 2000);
  }

  public switch() {
    this.socket.emit("switch", 0);
    console.log("Switch");
  }
}
