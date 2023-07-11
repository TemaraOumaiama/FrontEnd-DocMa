import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratSuiviComponent } from './contrat-suivi.component';

describe('ContratSuiviComponent', () => {
  let component: ContratSuiviComponent;
  let fixture: ComponentFixture<ContratSuiviComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContratSuiviComponent]
    });
    fixture = TestBed.createComponent(ContratSuiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
