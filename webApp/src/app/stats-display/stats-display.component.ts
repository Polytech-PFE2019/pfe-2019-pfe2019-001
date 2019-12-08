import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as CanvasJS from '../../canvasjs.min';
import * as firebase from 'firebase';
import { firebaseService } from '../services/firebaseService';

@Component({
  selector: 'app-stats-display',
  templateUrl: './stats-display.component.html',
  styleUrls: ['./stats-display.component.scss']
})
export class StatsDisplayComponent implements OnInit {

  database;

  constructor(private firebaseService: firebaseService) {
    this.database = firebaseService.getDatabase();
  }

  ngOnInit() {
    this.getWaterStats();
    let dataPoints = [];
    let dpsLength = 0;
    let chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      title: {
        text: "Live Chart with Data-Points from External JSON"
      },
      data: [{
        type: "spline",
        dataPoints: dataPoints,
      }]
    });

    $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=25&length=20&type=json&callback=?", function (data) {
      $.each(data, function (key, value) {
        dataPoints.push({ x: value[0], y: parseInt(value[1]) });
      });
      dpsLength = dataPoints.length;
      chart.render();
      updateChart();
    });
    function updateChart() {
      $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=" + (dpsLength + 1) + "&ystart=" + (dataPoints[dataPoints.length - 1].y) + "&length=1&type=json&callback=?", function (data) {
        $.each(data, function (key, value) {
          dataPoints.push({
            x: parseInt(value[0]),
            y: parseInt(value[1])
          });
          dpsLength++;
        });

        if (dataPoints.length > 20) {
          dataPoints.shift();
        }
        chart.render();
        setTimeout(function () { updateChart() }, 1000);
      });
    }

  }

  getWaterStats() {
    var statsWater = [];
    var average = 0;
    var temp = undefined;
    var waterStatsRef = this.database.ref('/stats/water');
    waterStatsRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
        if (temp == undefined) {
          temp = new Date(childSnap.child("/time").val() * 1000).valueOf()
        } else {
          var time = new Date(childSnap.child("/time").val() * 1000).valueOf();
          const diffTime = Math.abs(time - temp);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          statsWater.push(diffDays);
          temp = time
        }
      });
      var total = 0;
      for (var i = 0; i < statsWater.length; i++) {
        total += statsWater[i];
      }
      average = total / statsWater.length;
      var hours = (average / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      var days = (hours / 24)
      var rdays = Math.floor(days);
      var hours = (days - rdays) * 24;
      var rhours = Math.round(hours);
      document.getElementById("waterStat").innerHTML = rdays + " jour(s), " + rhours + " heure(s) et " + rminutes + " minute(s)";
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
