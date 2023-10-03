import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossiertestComponent } from './dossiertest.component';

describe('DossiertestComponent', () => {
  let component: DossiertestComponent;
  let fixture: ComponentFixture<DossiertestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DossiertestComponent]
    });
    fixture = TestBed.createComponent(DossiertestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
