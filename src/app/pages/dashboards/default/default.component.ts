import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  title = 'Dashboard';
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{label: this.title, active: true}];
  }
}
