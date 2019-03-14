import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductComponent } from './product/product.component';
import { AdminComponent } from './admin.component';

@NgModule({
    declarations: [ProductComponent, AdminComponent],
    imports: [
      AdminRoutingModule,
      SharedModule
    ]
})
export class AdminModule { }
