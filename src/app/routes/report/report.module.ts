import { NgModule } from '@angular/core';
import { ReportComponent } from './report/report.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [ReportComponent],
    imports: [
      SharedModule
    ]
})
export class ReportModule { }
