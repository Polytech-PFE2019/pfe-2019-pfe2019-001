import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created by Camille, Quentin, Paul et Sébastien / 2020</span>
    <div class="socials">
      <a href="https://github.com/Polytech-PFE2019/pfe-2019-pfe2019-001" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
