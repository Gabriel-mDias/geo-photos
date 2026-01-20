import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photos360RoutingModule } from './photos-360.routing.module';
import { SharedModule } from '../shared/shared.module';
import { Photo360ViewComponent } from './view/photo-360-view.component';
import { LocalidadeStore } from '../../stores/localidade.store';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Photo360ViewComponent,
  ],
  providers: [
    LocalidadeStore,
  ],
  exports: [],
  imports: [
    CommonModule,
    Photos360RoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class Photos360Module { }
