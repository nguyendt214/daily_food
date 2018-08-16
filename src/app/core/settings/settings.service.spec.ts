/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('Service: Settings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
  });

  it('should specify layout configuration', inject([SettingsService], (service: SettingsService) => {
    expect(service.layout).toBeDefined();
  }));

  it('should be fixed layout', inject([SettingsService], (service: SettingsService) => {
    expect(service.layout.isFixed).toBeTruthy();
  }));
});
