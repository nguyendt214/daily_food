import { CcmartService } from './service/ccmart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IProduct } from './model/product';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@AutoUnsubscribe()
export class HomeComponent implements OnInit {
  products: Array<IProduct> = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ccmartService: CcmartService
  ) { }

  ngOnInit() {
    this.ccmartService.getProducts()
      .subscribe(
        products => {
          this.products = products;
        }
      );
  }

  getProductImage(product: IProduct) {
    return product.IMAGE_URL ? product.IMAGE_URL : '/assets/img/logo.jpg';
  }
}
