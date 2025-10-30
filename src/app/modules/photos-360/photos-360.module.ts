import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photos360RoutingModule } from './photos-360.routing.module';
import { SharedModule } from '../shared/shared.module';
import { Photo360ViewComponent } from './view/photo-360-view.component';



@NgModule({
  declarations: [
    Photo360ViewComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    Photos360RoutingModule,
    SharedModule,
  ]
})
export class Photos360Module { }
