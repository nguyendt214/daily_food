import { NgModule } from '@angular/core';
import { ReportComponent } from './report/report.component';
import { SharedModule } from '../../shared/shared.module';
import { MainReportComponent } from './report.main.component';

@NgModule({
    declarations: [
      MainReportComponent,
      ReportComponent
    ],
    imports: [
      SharedModule
    ]
})
export class ReportModule { }
