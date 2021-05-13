import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshmentsComponent } from './refreshments.component';

describe('RefreshmentsComponent', () => {
  let component: RefreshmentsComponent;
  let fixture: ComponentFixture<RefreshmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefreshmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
