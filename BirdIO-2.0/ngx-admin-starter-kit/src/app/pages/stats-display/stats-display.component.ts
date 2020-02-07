import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { firebaseService } from '../../../services/firebase.service';
import { dbService } from '../../../services/db.service';

@Component({
  selector: 'app-stats-display',
  templateUrl: './stats-display.component.html',
  styleUrls: ['./stats-display.component.scss']
})
export class StatsDisplayComponent implements OnInit {

  database;
  return = false;

  constructor(private firebaseService: firebaseService, private dbService: dbService) {
    this.database = firebaseService.getDatabase();
  }

  ngOnInit() {
    this.getWaterStats();
    this.getFoodStats();
    this.getCountStats();
  }

  getWaterStats() {
    var statsWater = [];
    var average = 0;
    var temp = undefined;
    var valueTemp = undefined;
    var waterStatsRef = this.database.ref('/stats/water');
    waterStatsRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
        if (temp == undefined) {
          temp = new Date(childSnap.child("/time").val()).valueOf()
          valueTemp = childSnap.child("/value").val();
        } else {
          if (childSnap.child("/value").val() != valueTemp) {
            var time = new Date(childSnap.child("/time").val()).valueOf();
            const diffDays = (time - temp) / 1000;
            statsWater.push(diffDays);
            temp = undefined;
          }
        }
      });
      var total = 0;
      for (var i = 0; i < statsWater.length; i++) {
        total += statsWater[i];
      }
      var seconds = total / statsWater.length;
      var days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      var hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      var mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;
      document.getElementById("waterStat").innerHTML = days + " jour(s), " + hrs + " heure(s) et " + mnts + " minute(s)";
    });
  }

  getCountStats() {
    this.return = false;
    var dataPoints = [];
    var rawData = this.dbService.getBirdStats();
    var newThis = this;
    const newClickGraphCount = this.clickGraphCount.bind(this);
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
  }

  clickGraphCount(e) {
    this.return = true;
    var dataPoints = [];
    var rawData = this.dbService.getBirdStats();
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
        indexLabel: "{y} passage(s)",
        dataPoints: dataPoints
      }]

    });
    chart.render();
  }

  getFoodStats() {
    var statsFood = [];
    var average = 0;
    var temp = undefined;
    var valueTemp = undefined;
    var foodStatsRef = this.database.ref('/stats/food');
    foodStatsRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
        if (temp == undefined) {
          temp = new Date(childSnap.child("/time").val()).valueOf()
          valueTemp = childSnap.child("/value").val();
        } else {
          if (childSnap.child("/value").val() != valueTemp) {
            var time = new Date(childSnap.child("/time").val()).valueOf();
            const diffDays = (time - temp) / 1000;
            statsFood.push(diffDays);
            console.log("Diffdays :" + diffDays);
            temp = undefined;
          }
        }
      });
      var total = 0;
      for (var i = 0; i < statsFood.length; i++) {
        total += statsFood[i];
      }
      var seconds = total / statsFood.length;
      var days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      var hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      var mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;
      document.getElementById("foodStat").innerHTML = days + " jour(s), " + hrs + " heure(s) et " + mnts + " minute(s)";
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
