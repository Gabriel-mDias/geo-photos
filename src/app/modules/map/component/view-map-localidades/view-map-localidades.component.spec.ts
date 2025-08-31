import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMapLocalidadesComponent } from './view-map-localidades.component';

describe('MapHomeComponent', () => {
  let component: ViewMapLocalidadesComponent;
  let fixture: ComponentFixture<ViewMapLocalidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapLocalidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMapLocalidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
