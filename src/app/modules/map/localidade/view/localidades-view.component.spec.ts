import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalidadesViewComponent } from './localidades-view.component';

describe('LocalidadesViewComponent', () => {
  let component: LocalidadesViewComponent;
  let fixture: ComponentFixture<LocalidadesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalidadesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalidadesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
