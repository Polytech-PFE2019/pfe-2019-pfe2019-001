import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { ChildActivationEnd } from '@angular/router';



@Injectable({ providedIn: "root" })
export class dbService {
    constructor() {

    }

    getAlbums() {

    }

    getBirdStats() {
      var mock = []
      mock.push({date: 1581073922546, state: true})
      mock.push({date: 1581074115285, state: false})
      mock.push({date: 1581074151077, state: true})
      mock.push({date: 1581074160742, state: false})
      return mock;
    }

    getBirdsDaily(day, month, year) {

    }

    getBirdsMonthly(month, year) {

    }

    getBirdsYearly(year) {

    }

}
