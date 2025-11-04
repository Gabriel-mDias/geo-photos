import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faExpand } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SidebarComponent
  ],
  exports: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
  ]
})
export class CoreModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faEye, faExpand);
  }
}
