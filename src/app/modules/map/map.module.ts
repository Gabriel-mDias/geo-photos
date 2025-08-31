import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMapLocalidadesComponent } from './component/view-map-localidades/view-map-localidades.component';



@NgModule({
  declarations: [
    ViewMapLocalidadesComponent
  ],
  exports: [
    ViewMapLocalidadesComponent
  ],
  imports: [
    CommonModule,
  ],
})
export class MapModule { }
