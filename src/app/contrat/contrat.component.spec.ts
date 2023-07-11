import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratComponent } from './contrat.component';

describe('ContratComponent', () => {
  let component: ContratComponent;
  let fixture: ComponentFixture<ContratComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContratComponent]
    });
    fixture = TestBed.createComponent(ContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
