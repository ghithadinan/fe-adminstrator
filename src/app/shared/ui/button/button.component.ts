import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() btnId = '';
  @Input() btnClass = '';
  @Input() btnNgClass: object = {};
  @Input() btnTitle = '';
  @Input() btnType = 'button';
  @Input() btnDisabled = false;
  @Input() loading = false;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  click($event: any) {
    if (this.onClick) {
      this.onClick.emit($event);
    }
  }

}
