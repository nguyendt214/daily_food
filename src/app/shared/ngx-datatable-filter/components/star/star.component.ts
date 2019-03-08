import { Component, OnInit, Input } from '@angular/core';
import { QUALIFICATION } from '../../../../routes/home/home/model/qualification';

@Component({
  selector: 'app-mu-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements OnInit {
  @Input() public value: string;
  @Input() public type: string;
  public qualification = QUALIFICATION;
  constructor() { }

  ngOnInit() {
  }

}
