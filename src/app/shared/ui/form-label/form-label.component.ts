import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.scss']
})
export class FormLabelComponent implements OnInit {

  @Input() formLableClass = 'col-form-label-sm';
  @Input() mandatory = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
