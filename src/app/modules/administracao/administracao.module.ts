import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracaoRoutingModule } from './administracao.routing.module';
import { UsuarioViewComponent } from './usuario/view/usuario-view.component';
import { ConfiguracaoViewComponent } from './configuracao/view/configuracao-view.component';



@NgModule({
  declarations: [
    UsuarioViewComponent,
    ConfiguracaoViewComponent,
  ],
  imports: [
    CommonModule,
    AdministracaoRoutingModule,
  ]
})
export class AdministracaoModule { }
