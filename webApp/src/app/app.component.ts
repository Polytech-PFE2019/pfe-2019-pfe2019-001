import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './services/SocketService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webApp';
  isHome = true;
  presence = false;

  constructor(private router: Router, private socket: SocketService) {
    router.events.subscribe((val) => {
      if (this.router.url === '/') {
        this.isHome = true;
      } else {
        this.isHome = false;
      }
    });
  }

  ngOnInit() {
    setInterval(() => {
      if (this.presence) {
        document.getElementById('blink').style.opacity = "1";
        document.getElementById('blink').style.backgroundColor = "red";
        setTimeout(() => {
          document.getElementById('blink').style.opacity = "0";
        }, 3000);
      }
    }, 2000);

    this.socket.pres.subscribe((data) => {
      this.presence = data;
    })

  }
}
