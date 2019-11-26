import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.scss']
})
export class VideoDisplayComponent implements OnInit {

  constructor() { }

  ngOnInit() {

        var jsmpeg = require('jsmpeg');
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
  }
}
