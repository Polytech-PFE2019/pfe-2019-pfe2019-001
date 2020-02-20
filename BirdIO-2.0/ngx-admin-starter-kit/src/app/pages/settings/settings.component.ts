import { Component, OnInit } from '@angular/core';
import { localServer } from '../../../environments/environment';
import { DbService } from '../../../services/db.service'

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public foodEtalonUrl: string;
  public refresh: string;
  public etalonOk: boolean;
  public currentMail: String;
  public oldMail: String;
  public newMail: String;

  constructor(private dbService: DbService) {
    this.dbService.getEmail().then((res: any) => {
      this.oldMail = res.email;
    }).catch((err) => {
      this.oldMail = "Email not defined";
    })
  }

  ngOnInit() {
    this.etalonOk = true;
    this.foodEtalonUrl = localServer + '/food/etalon';
    this.refresh = this.foodEtalonUrl + '?' + Date.now();
  }

  setFoodEtalon() {
    this.dbService.setFoodEtalon().then((data) => {
      console.log(data);
      this.etalonOk = true;
      this.refresh = this.foodEtalonUrl + '?' + Date.now();
    });
  }

  etalonNotOk() {
    console.log('No etalon found');
    this.etalonOk = false;
  }

  setEmail() {
    this.dbService.setEmail(this.newMail).then(newMail => {
      this.newMail = '';
      this.oldMail = newMail.email
    });
  }

}
