import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo360ViewComponent } from './photo-360-view.component';

describe('Photo360ViewComponent', () => {
  let component: Photo360ViewComponent;
  let fixture: ComponentFixture<Photo360ViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Photo360ViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Photo360ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
