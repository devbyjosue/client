import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDetail } from './sales-detail';

describe('SalesDetail', () => {
  let component: SalesDetail;
  let fixture: ComponentFixture<SalesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
