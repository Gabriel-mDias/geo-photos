import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMapLocalidadesComponent } from './component/view-map-localidades/view-map-localidades.component';
import { LocalidadesViewComponent } from './localidade/view/localidades-view.component';
import { MapRoutingModule } from './map.routing.module';
import { SharedModule } from '../shared/shared.module';
import { LocalidadeStore } from '../../stores/localidade.store';
import { LocalidadesImportComponent } from './localidade/import/localidades-import.component';



@NgModule({
  declarations: [
    ViewMapLocalidadesComponent,
    LocalidadesViewComponent,
    LocalidadesImportComponent
  ],
  providers: [
    LocalidadeStore,
  ],
  exports: [
    ViewMapLocalidadesComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
  ],
})
export class MapModule { }
