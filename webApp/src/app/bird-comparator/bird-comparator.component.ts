import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bird-comparator',
  templateUrl: './bird-comparator.component.html',
  styleUrls: ['./bird-comparator.component.scss']
})
export class BirdComparatorComponent implements OnInit {

  @Input() name: string;
  @Input() url: string;

  constructor() { }

  ngOnInit() {
  }

}
