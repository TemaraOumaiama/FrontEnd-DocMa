import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeilleJuridiqueComponent } from './veille-juridique.component';

describe('VeilleJuridiqueComponent', () => {
  let component: VeilleJuridiqueComponent;
  let fixture: ComponentFixture<VeilleJuridiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VeilleJuridiqueComponent]
    });
    fixture = TestBed.createComponent(VeilleJuridiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
