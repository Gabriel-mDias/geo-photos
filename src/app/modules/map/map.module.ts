import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMapLocalidadesComponent } from './component/view-map-localidades/view-map-localidades.component';
import { LocalidadesViewComponent } from './localidade/localidades-view/localidades-view.component';
import { MapRoutingModule } from './map.routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    ViewMapLocalidadesComponent,
    LocalidadesViewComponent
  ],
  exports: [
    ViewMapLocalidadesComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    FontAwesomeModule,
  ],
})
export class MapModule { }
