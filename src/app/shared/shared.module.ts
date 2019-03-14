import { CcmartService } from './../routes/home/home/service/ccmart.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ColorsService } from './colors/colors.service';
import { MuUserModule } from '@mu/common';
import { MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocalStorageService } from './LocalStorage/local-storage.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChecklistModule } from 'angular-checklist';
import { BsDatepickerModule } from 'ngx-bootstrap';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
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
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatIconModule
  ],
  providers: [
    ColorsService,
    CcmartService,
    LocalStorageService
  ],
  declarations: [
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
    ChecklistModule,
    BsDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatIconModule
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
