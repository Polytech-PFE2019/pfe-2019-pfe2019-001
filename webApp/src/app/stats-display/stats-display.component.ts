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
  return = false;

  constructor(private firebaseService: firebaseService) {
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
    var waterStatsRef = this.database.ref('/stats/water');
    waterStatsRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
        if (temp == undefined) {
          temp = new Date(childSnap.child("/time").val()).valueOf()
        } else {
          var time = new Date(childSnap.child("/time").val()).valueOf();
          const diffTime = Math.abs(time - temp);
          const diffDays = Math.ceil(diffTime / (60 * 60 * 24));
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

  getCountStats(){
    this.return = false;
    var dataPoints = [];
    var countRef = this.database.ref('/stats/birds_count');
    var newThis = this;
    const newClickGraphCount = this.clickGraphCount.bind(this);
    countRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
        if(dataPoints.length == 0){
          var obj = {y : childSnap.child("/value").val(), label: convertToDateFormat(new Date(childSnap.child("/time").val()))};
          dataPoints.push(obj);
          console.log(Object.keys(dataPoints));
        }else{
          for (var i = 0; i < dataPoints.length; i++){
            console.log(dataPoints.length)
            var check = false;
            if (dataPoints[i].label == convertToDateFormat(new Date(childSnap.child("/time").val()))){
              dataPoints[i].y += childSnap.child("/value").val();
              check = true;
              break;
            }
          }
          if(!check){
            var obj = {y : childSnap.child("/value").val(), label: convertToDateFormat(new Date(childSnap.child("/time").val()))};
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
          indexLabel: "{y} oiseaux",
          click: newClickGraphCount,
          dataPoints: dataPoints
        }]

    });
    chart.render();
    });
  }

  clickGraphCount(e){
    this.return = true;
    var dataPoints = [];
    var countRef = this.database.ref('/stats/birds_count');
    countRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
          if (e.dataPoint.label == convertToDateFormat(new Date(childSnap.child("/time").val()))){
            var tmp = new Date(childSnap.child("/time").val());
            var time = ""+tmp.getHours()+":"+tmp.getMinutes()+":"+tmp.getSeconds();
            var obj = {y : childSnap.child("/value").val(), label: time};
            dataPoints.push(obj);
          }
      });
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Nombre approximatif d'oiseaux le " + e.dataPoint.label
        },
        data: [{
          type: "spline",
          indexLabel: "{y} oiseaux",
          dataPoints: dataPoints
        }]

      });
      chart.render();
    });
  }

  getFoodStats() {
    var statsFood = [];
    var average = 0;
    var temp = undefined;
    var foodStatsRef = this.database.ref('/stats/food');
    foodStatsRef.once('value', function (snap) {
      snap.forEach(function (childSnap) {
        if (temp == undefined) {
          temp = new Date(childSnap.child("/time").val()).valueOf()
        } else {
          var time = new Date(childSnap.child("/time").val()).valueOf();
          const diffTime = Math.abs(time - temp);
          const diffDays = Math.ceil(diffTime / (60 * 60 * 24));
          statsFood.push(diffDays);
          temp = time
        }
      });
      var total = 0;
      for (var i = 0; i < statsFood.length; i++) {
        total += statsWater[i];
      }
      average = total / statsFood.length;
      var hours = (average / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      var days = (hours / 24)
      var rdays = Math.floor(days);
      var hours = (days - rdays) * 24;
      var rhours = Math.round(hours);
      document.getElementById("foodStat").innerHTML = rdays + " jour(s), " + rhours + " heure(s) et " + rminutes + " minute(s)";
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
