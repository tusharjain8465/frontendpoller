import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingClientsComponent } from './existing-clients.component';

describe('ExistingClientsComponent', () => {
  let component: ExistingClientsComponent;
  let fixture: ComponentFixture<ExistingClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
