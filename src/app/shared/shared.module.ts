import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ColorsService } from './colors/colors.service';
import { MuUserModule } from '@mu/common';
import { ScoutService } from '../routes/home/home/service/scout.service';
import { MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocalStorageService } from './LocalStorage/local-storage.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChecklistModule } from 'angular-checklist';
import { BsDatepickerModule, frLocale, defineLocale } from 'ngx-bootstrap';
import { NgxDatatableCommonFilterComponent } from './ngx-datatable-filter/components/common/ngx-datatable-common.component';
import { NgxDatatablesFilterService } from './ngx-datatable-filter/service/ngx-datatable-filter.service';
import { NgxDatatableFilterComponent } from './ngx-datatable-filter/components/ngx-datatable-filter.component';
import { StaticModule } from './statics/static.module';
import { StarComponent } from './ngx-datatable-filter/components/star/star.component';
defineLocale('fr', frLocale);
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    MatProgressSpinnerModule,
    MuUserModule,
    NgxDatatableModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ChecklistModule,
    StaticModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [
    ColorsService,
    ScoutService,
    LocalStorageService,
    NgxDatatablesFilterService
  ],
  declarations: [
    NgxDatatableFilterComponent,
    NgxDatatableCommonFilterComponent,
    StarComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule,
    MatProgressSpinnerModule,
    NgxDatatableModule,
    BsDropdownModule,
    NgxDatatableFilterComponent,
    NgxDatatableCommonFilterComponent,
    ChecklistModule,
    BsDatepickerModule,
    StaticModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    StarComponent
  ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
