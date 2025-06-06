import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSection } from './nav-section';

describe('NavSection', () => {
  let component: NavSection;
  let fixture: ComponentFixture<NavSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
