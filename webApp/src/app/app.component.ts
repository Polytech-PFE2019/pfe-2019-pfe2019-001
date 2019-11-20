import { Component } from '@angular/core';

import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'webApp';
  isHome = true;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if(this.router.url === '/'){
        this.isHome = true;
      }else{
        this.isHome = false;
      }
    });
  }
}
