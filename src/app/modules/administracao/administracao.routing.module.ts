import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioViewComponent } from './usuario/view/usuario-view.component';
import { ConfiguracaoViewComponent } from './configuracao/view/configuracao-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full'
  },
  {
    path: 'usuarios',
    component: UsuarioViewComponent
  },
  {
    path: 'configuracoes',
    component: ConfiguracaoViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracaoRoutingModule {}
