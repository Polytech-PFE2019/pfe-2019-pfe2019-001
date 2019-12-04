import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as CanvasJS from '../../canvasjs.min';
import * as firebase from 'firebase';

@Component({
  selector: 'app-stats-display',
  templateUrl: './stats-display.component.html',
  styleUrls: ['./stats-display.component.scss']
})
export class StatsDisplayComponent implements OnInit {

  constructor() {
    const config = {
      apiKey: "AIzaSyCncb_SkW0LNdf2phmjahcwr5R3KOGQzDM",
      authDomain: "bird-c45f2.firebaseapp.com",
      databaseURL: "https://bird-c45f2.firebaseio.com",
      projectId: "bird-c45f2",
      storageBucket: "bird-c45f2.appspot.com",
      messagingSenderId: "687579025809",
      appId: "1:687579025809:web:33036a6e9e2983f6da8a30"
    };
    firebase.initializeApp(config);
  }

  ngOnInit() {
    this.getUsers();
  	let dataPoints = [];
  	let dpsLength = 0;
  	let chart = new CanvasJS.Chart("chartContainer",{
  		exportEnabled: true,
  		title:{
  			text:"Live Chart with Data-Points from External JSON"
  		},
  		data: [{
  			type: "spline",
  			dataPoints : dataPoints,
  		}]
  	});

  	$.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=25&length=20&type=json&callback=?", function(data) {
  		$.each(data, function(key, value){
  			dataPoints.push({x: value[0], y: parseInt(value[1])});
  		});
  		dpsLength = dataPoints.length;
  		chart.render();
  		updateChart();
  	});
  	function updateChart() {
  	$.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=" + (dpsLength + 1) + "&ystart=" + (dataPoints[dataPoints.length - 1].y) + "&length=1&type=json&callback=?", function(data) {
  		$.each(data, function(key, value) {
  			dataPoints.push({
  			x: parseInt(value[0]),
  			y: parseInt(value[1])
  			});
  			dpsLength++;
  		});

  		if (dataPoints.length >  20 ) {
        		dataPoints.shift();
        	}
  		chart.render();
  		setTimeout(function(){updateChart()}, 1000);
  	});
      }

  }

  getUsers() {
    firebase.database().ref('/users')
      .on('value', (data: any) => {
            console.log(data.child("/nom").val());
        }
      );
  }
}
