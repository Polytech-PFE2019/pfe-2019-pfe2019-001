import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { firebaseService } from '../../../services/firebase.service';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-stats-display',
  templateUrl: './stats-display.component.html',
  styleUrls: ['./stats-display.component.scss']
})
export class StatsDisplayComponent implements OnInit {

  database;

  constructor(private firebaseService: firebaseService, private dbService: DbService) {
    this.database = firebaseService.getDatabase();
  }

  ngOnInit() {
    this.getWaterStats();
    this.getFoodStats();
    this.displayDailyBirdsStats(undefined);
  }

  getWaterStats() {
    var statsWater = [];
    this.dbService.getWaterAverage().then((object) => {
      let avg = Math.abs(parseInt(object.avg));
      console.log(avg);
      let display = "";
      let days = Math.trunc(avg / (1000 * 60 * 60 * 24));
      if (days > 0) display += days + " jour(s) ";
      avg = avg - (days * 1000 * 60 * 60 * 24);
      let hours = Math.trunc(avg / (1000 * 60 * 60));
      if (hours > 0 || days > 0) display += hours + " heure(s) ";
      avg = avg - (hours * 1000 * 60 * 60);
      let minutes = Math.trunc(avg / (1000 * 60));
      if (minutes > 0 || hours > 0 || days > 0) display += minutes + " minute(s)";
      avg = avg - (minutes * 1000 * 60);
      let seconds = Math.trunc(avg / 1000);
      if (display == "") display = "Pas assez de données pour être calculé ...";
      document.getElementById("waterStat").innerHTML = display;
    });
  }

  getFoodStats() {
    var statsWater = [];
    this.dbService.getFoodAverage().then((object) => {
      let avg = Math.abs(parseInt(object.avg));
      console.log(avg);
      let display = "";
      let days = Math.trunc(avg / (1000 * 60 * 60 * 24));
      if (days > 0) display += days + " jour(s) ";
      avg = avg - (days * 1000 * 60 * 60 * 24);
      let hours = Math.trunc(avg / (1000 * 60 * 60));
      if (hours > 0 || days > 0) display += hours + " heure(s) ";
      avg = avg - (hours * 1000 * 60 * 60);
      let minutes = Math.trunc(avg / (1000 * 60));
      if (minutes > 0 || hours > 0 || days > 0) display += minutes + " minute(s)";
      avg = avg - (minutes * 1000 * 60);
      let seconds = Math.trunc(avg / 1000);
      if (display == "") display = "Pas assez de données pour être calculé ...";
      document.getElementById("foodStat").innerHTML = display;
    });
  }

  displayYearlyBirdsStats() {
    var dataPoints = [];
    var newThis = this;
    const newClickGraphCount = this.displayMonthlyBirdsStats.bind(this);
    this.dbService.getBirdsYearly(new Date(Date.now()).getFullYear() + '').then((rawData) => {
      rawData.forEach(function (childSnap) {
        if (dataPoints.length == 0) {
          var date = convertToMonthFormat(new Date(childSnap.date));
          var obj = { y: childSnap.state ? 1 : 0, label: date};
          dataPoints.push(obj);
          console.log(Object.keys(dataPoints));
        } else {
          for (var i = 0; i < dataPoints.length; i++) {
            console.log(dataPoints.length)
            var check = false;
            if (dataPoints[i].label == convertToMonthFormat(new Date(childSnap.date))) {
              dataPoints[i].y += childSnap.state ? 1 : 0;
              check = true;
              break;
            }
          }
          if (!check) {
            var obj = { y: childSnap.state ? 1 : 0, label: convertToMonthFormat(new Date(childSnap.date)) };
            dataPoints.push(obj);
            check = false;
          }
        }
      });
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Nombre de passages d'oiseaux par mois"
        },
        data: [{
          type: "column",
          indexLabel: "{y} passage(s)",
          click: newClickGraphCount,
          dataPoints: dataPoints
        }]

      });
      chart.render();
    });
  }

  displayMonthlyBirdsStats(e) {
    var dataPoints = [];
    var newThis = this;
    const newClickGraphCount = this.displayDailyBirdsStats.bind(this);
    var split = e.dataPoint.label.split('/');
    this.dbService.getBirdsMonthly(split[0], split[1]).then((rawData) => {
      rawData.forEach(function (childSnap) {
        if (dataPoints.length == 0) {
          var obj = { y: childSnap.state ? 1 : 0, label: convertToDateFormat(new Date(childSnap.date)) };
          dataPoints.push(obj);
          console.log(Object.keys(dataPoints));
        } else {
          for (var i = 0; i < dataPoints.length; i++) {
            console.log(dataPoints.length)
            var check = false;
            if (dataPoints[i].label == convertToDateFormat(new Date(childSnap.date))) {
              dataPoints[i].y += childSnap.state ? 1 : 0;
              check = true;
              break;
            }
          }
          if (!check) {
            var obj = { y: childSnap.state ? 1 : 0, label: convertToDateFormat(new Date(childSnap.date)) };
            dataPoints.push(obj);
            check = false;
          }
        }
      });
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Nombre approximatif d'oiseaux par jour"
        },
        data: [{
          type: "column",
          indexLabel: "{y} passage(s)",
          click: newClickGraphCount,
          dataPoints: dataPoints
        }]

      });
      chart.render();
    });
  }

  displayDailyBirdsStats(e) {
    if (e == undefined) e = {dataPoint: {label: convertToDateFormat(new Date(Date.now()))}};
    var dataPoints = [];
    var split = e.dataPoint.label.split('/');
    this.dbService.getBirdsDaily(split[0], split[1], split[2]).then((rawData) => {
      rawData.forEach(function (childSnap) {
        if (e.dataPoint.label == convertToDateFormat(new Date(childSnap.date))) {
          var tmp = new Date(childSnap.date);
          var time = "" + tmp.getHours() + ":" + tmp.getMinutes() + ":" + tmp.getSeconds();
          var obj = { y: childSnap.state ? 1 : 0, label: time };
          dataPoints.push(obj);
        }
      });
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Passages d'oiseaux le " + e.dataPoint.label
        },
        data: [{
          type: "stepArea",
          dataPoints: dataPoints
        }]

      });
      chart.render();
    });
  }


}

function convertToDateFormat(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;

  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return date = dd + '/' + mm + '/' + yyyy;
}

function convertToMonthFormat(date) {
  var mm = date.getMonth() + 1;

  var yyyy = date.getFullYear();
  if (mm < 10) {
    mm = '0' + mm;
  }
  return date = mm + '/' + yyyy;
}
