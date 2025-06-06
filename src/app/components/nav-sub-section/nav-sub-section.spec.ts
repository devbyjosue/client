import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSubSection } from './nav-sub-section';

describe('NavSubSection', () => {
  let component: NavSubSection;
  let fixture: ComponentFixture<NavSubSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSubSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSubSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
