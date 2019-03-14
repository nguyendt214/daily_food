import { IProduct } from './../../home/home/model/product';
import { CcmartService } from './../../home/home/service/ccmart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-mu-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products: Array<IProduct> = [];
  temp: Array<IProduct> = [];
  thucDon: Array<IProduct> = [];
  searchBox = '';
  @ViewChild('confirmModal') confirmModal: ModalDirective;
  constructor(
    private ccmartService: CcmartService
  ) { }

  ngOnInit() {
    this.ccmartService.getProducts()
      .subscribe(
        products => {
          this.products = products;
          this.temp = [...products];
        }
      );
  }

  getProductImage(product: IProduct) {
    return product.IMAGE_URL ? product.IMAGE_URL : '/assets/img/logo.jpg';
  }
  updateFilter() {
    const val = this.searchBox.toUpperCase();
    // filter our data
    const temp = this.temp.filter(function (d: IProduct) {
      return (d.NAME && d.NAME.toUpperCase().indexOf(val) !== -1) ||
        (d.SKU && d.SKU.toString().toUpperCase().indexOf(val) !== -1) ||
        (d.GROUP && d.GROUP.toString().toUpperCase().indexOf(val) !== -1) ||
        !val;
    });
    this.products = temp;
  }
  addThucDon(sp: IProduct) {
    sp.GIA_THEO_NGAY = sp.GIA_THEO_NGAY ? sp.GIA_THEO_NGAY : sp.PRICE_ORIGIN;
    const idx = _.findIndex(this.thucDon, (s: IProduct) => {
      return sp.ID === s.ID;
    });
    if (idx > -1) {
      this.thucDon.splice(idx, 1, sp);
      return;
    }
    this.thucDon.push(sp);
  }

  hoanThanhThucDon() {
    this.confirmModal.show();
  }
  hideConfirmPopup() {
    this.confirmModal.hide();
  }
  taoThucDon() {
    this.hideConfirmPopup();
    this.ccmartService.taoThucDon(JSON.stringify(this.thucDon))
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }

}
