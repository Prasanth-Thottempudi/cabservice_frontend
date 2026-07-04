import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedFleet } from './featured-fleet';

describe('FeaturedFleet', () => {
  let component: FeaturedFleet;
  let fixture: ComponentFixture<FeaturedFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedFleet],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedFleet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
