import { ModalDirective } from 'ngx-bootstrap';
import { CcmartService } from './service/ccmart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IProduct } from './model/product';
import { productData } from '../../../../../tests/mock/products';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@AutoUnsubscribe()
export class HomeComponent implements OnInit {
  products: Array<IProduct> = [];
  thucDon: Array<IProduct> = [];
  gioHang: Array<IProduct> = [];
  pageLoad = false;
  addToCartMessage = '';
  @ViewChild('giohangModal') giohangModal: ModalDirective;
  @ViewChild('addToCartModal') addToCartModal: ModalDirective;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ccmartService: CcmartService
  ) {
    this.products = productData;
  }

  ngOnInit() {
    this.ccmartService.getThucDonHomNay()
      .pipe(
        finalize(
          () => this.pageLoad = true
        )
      )
      .subscribe(
        (td: any) => {
          this.thucDon = td;
        }
      );
  }

  getProductImage(product: IProduct) {
    return product.IMAGE_URL ? product.IMAGE_URL : '/assets/img/logo.jpg';
  }
  getButtonState(sp: IProduct) {
    const idx = _.findIndex(this.gioHang, (s: IProduct) => {
      return sp.ID === s.ID;
    });
    if (idx > -1) {
      return 'ĐÃ MUA';
    }
    return 'MUA';
  }

  muaSanPham(sp: IProduct) {
    const idx = _.findIndex(this.gioHang, (s: IProduct) => {
      return sp.ID === s.ID;
    });
    if (idx > -1) {
      this.gioHang.splice(idx, 1, sp);
      this.addToCartMessage = 'Đã sửa giỏ hàng thành: ' + sp.NAME + ', SL: ' + sp.SL_SOLD + ' (' + sp.TYPE + '). Cám ơn QK!';
      this.addToCartModal.show();
      setTimeout(() => {
        this.addToCartModal.hide();
      }, 3000);
      return;
    }
    this.gioHang.push(sp);
    this.addToCartMessage = 'Đã thêm: ' + sp.NAME + ', SL: ' + sp.SL_SOLD + ' (' + sp.TYPE + ') vào giỏ hàng. Cám ơn QK!';
    this.addToCartModal.show();
    setTimeout(() => {
      this.addToCartModal.hide();
    }, 3000);
  }
  xemGioHang() {
    this.giohangModal.show();
  }
  chotDonHang() {

  }
}
