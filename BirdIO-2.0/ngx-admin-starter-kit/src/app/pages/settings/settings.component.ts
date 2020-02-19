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

  constructor(private dbService: DbService) { }

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

}
