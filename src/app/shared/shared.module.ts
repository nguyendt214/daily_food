import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ColorsService } from './colors/colors.service';
import { MuUserModule } from '@mu/common';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ScoutService } from '../routes/home/home/service/scout.service';
import { MatProgressSpinnerModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocalStorageService } from './LocalStorage/local-storage.service';
// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    MatProgressSpinnerModule,
    MuUserModule,
    SweetAlert2Module.forRoot(),
    NgxDatatableModule

  ],
  providers: [
    ColorsService,
    ScoutService,
    LocalStorageService
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule,
    MatProgressSpinnerModule,
    NgxDatatableModule
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
