import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExpand, faGear, faLock, faMapLocationDot, faUpRightAndDownLeftFromCenter, faUser } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  exports: [
    FontAwesomeModule,
    HttpClientModule,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HttpClientModule,
  ]
})
export class SharedModule {
  /**
   * Método para declarar os ícones globais da aplicação
   */
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faUser, 
      faLock, 
      faExpand, 
      faUpRightAndDownLeftFromCenter,
      faGear,
      faMapLocationDot,
    );
  }

}
