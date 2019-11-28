import { Component } from '@angular/core';
import * as io from "socket.io-client";
import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'webApp';
  isHome = true;
  presence = false;
  private url = "http://192.168.43.68:1337";
  private socket;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if(this.router.url === '/'){
        this.isHome = true;
      }else{
        this.isHome = false;
      }
    });

    this.socket = io(this.url);
    this.socket.on('presence', (pres) => {
      this.presence = pres;
    });

    this.socket.on("connect_error", (exeception) => {
      this.presence = false;
    });
    this.socket.on("connect_timeout", (timeout) => {
      this.presence = false;
      console.log("timeout");
    });
    this.socket.on('error', (error) => {
      this.presence = false;
      console.log("timeout");
    });
  }

  ngOnInit() {
    setInterval(() => {
      if(this.presence){
        document.getElementById('blink').style.opacity = 1;
        document.getElementById('blink').style.backgroundColor = "red";
        setTimeout(() =>{
          document.getElementById('blink').style.opacity = 0;
        },3000);
      }
    }, 2000);
  }
}
